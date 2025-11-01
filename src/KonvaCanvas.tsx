import { Stage, Layer, Rect, Group } from "react-konva";
import useStore from "./store";
import { socket } from "./SocketManager";
import { useEffect, useRef, useState } from "react";
import { Layer as KonvaLayer } from "konva/lib/Layer";
import type { KonvaEventObject } from "konva/lib/Node";
import { Stage as StageType } from "konva/lib/Stage";
import type { Shape } from "konva/lib/Shape";

const CANVAS_SIZE = 50;

const KonvaCanvas = () => {
  const {
    canvas,
    username,
    selectedColor,
    updatePixel,
    cooldown,
    setIsShaking,
    initialized,
  } = useStore();
  const layerRef = useRef<KonvaLayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [stage, setStage] = useState({ scale: 1, x: 0, y: 0 });
  const lastDist = useRef(0);

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (containerRef.current) {
          setDimensions({
            width: containerRef.current.offsetWidth - 16,
            height: containerRef.current.offsetHeight - 16,
          });
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const pixelSize = Math.min(dimensions.width, dimensions.height) / CANVAS_SIZE;

  useEffect(() => {
    if (layerRef.current && !initialized) {
      const layer = layerRef.current;
      for (let i = 0; i < CANVAS_SIZE * CANVAS_SIZE; i++) {
        const x = i % CANVAS_SIZE;
        const y = Math.floor(i / CANVAS_SIZE);
        const pixel = canvas[`${x}:${y}`];
        const rect = layer.findOne(`#pixel-${x}-${y}`) as Shape;
        if (rect) {
          rect.fill(pixel ? pixel.color : "#FFFFFF");
        }
      }
    }
  }, [initialized, canvas]);

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = e.target.getStage() as StageType;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    setStage({
      scale: newScale,
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const handleTouch = (e: KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];
    const stage = e.target.getStage() as StageType;

    if (touch1 && touch2) {
      if (stage.isDragging()) {
        stage.stopDrag();
      }

      const p1 = {
        x: touch1.clientX,
        y: touch1.clientY,
      };
      const p2 = {
        x: touch2.clientX,
        y: touch2.clientY,
      };

      if (!lastDist.current) {
        lastDist.current = getDistance(p1, p2);
      }

      const dist = getDistance(p1, p2);
      const scale = (stage.scaleX() * dist) / lastDist.current;
      lastDist.current = dist;

      const center = {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
      };

      const pointTo = {
        x: (center.x - stage.x()) / stage.scaleX(),
        y: (center.y - stage.y()) / stage.scaleX(),
      };

      setStage({
        scale,
        x: center.x - pointTo.x * scale,
        y: center.y - pointTo.y * scale,
      });
    } else if (touch1) {
      if (!stage.isDragging()) {
        stage.startDrag();
      }
    }
  };

  const handleTouchEnd = () => {
    lastDist.current = 0;
  };

  const getDistance = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
  ) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  /**
   * Handle a click on a pixel.
   * If the user is not logged in, show an alert.
   * If the cooldown is not over, shake the pixel and then restore its color.
   * If the cooldown is over, send a draw_pixel event to the server and update the pixel's color.
   * @param {KonvaEventObject<MouseEvent>} e - The event object.
   */
  const handlePixelClick = (e: KonvaEventObject<MouseEvent>) => {
    const rect = e.target as Shape;
    const x = rect.x() / pixelSize;
    const y = rect.y() / pixelSize;

    if (!username) {
      alert("Please log in to draw.");
      return;
    }

    if (cooldown > 0) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      const originalColor = canvas[`${x}:${y}`]?.color || "#FFFFFF";
      rect.fill(selectedColor);

      setTimeout(() => {
        rect.fill(originalColor);
      }, 100);
      return;
    }

    const timestamp = Date.now();

    socket.emit("draw_pixel", { x, y, color: selectedColor, timestamp });
    updatePixel(x, y, selectedColor, timestamp);
  };

  return (
    <div
      ref={containerRef}
      className="w-full m-2 max-w-[80vh] relative max-h-[80vh] border-2 border-gray-700 box-border p-1.5 aspect-square rounded-lg shadow-2xl"
    >
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        onWheel={handleWheel}
        onTouchMove={handleTouch}
        onTouchEnd={handleTouchEnd}
        scaleX={stage.scale}
        scaleY={stage.scale}
        x={stage.x}
        y={stage.y}
        draggable
      >
        <Layer ref={layerRef}>
          <Rect x={0} y={0} fill="#FFFFFF" />
          <Group>
            {Array.from({ length: CANVAS_SIZE * CANVAS_SIZE }).map(
              (_, index) => {
                const x = index % CANVAS_SIZE;
                const y = Math.floor(index / CANVAS_SIZE);
                const pixel = canvas[`${x}:${y}`];

                return (
                  <Rect
                    key={index}
                    id={`pixel-${x}-${y}`}
                    x={x * pixelSize}
                    y={y * pixelSize}
                    width={pixelSize}
                    height={pixelSize}
                    fill={pixel ? pixel.color : "#FFFFFF"}
                    onClick={handlePixelClick}
                    stroke="#CCCCCC"
                    strokeWidth={0.5}
                  />
                );
              },
            )}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaCanvas;
