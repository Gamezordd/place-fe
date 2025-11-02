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
  };  /**
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
        scaleX={stage.scale}
        scaleY={stage.scale}
        x={stage.x}
        y={stage.y}
        onWheel={handleWheel}
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
                    onTap={handlePixelClick}
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

const getDistance = (
  p1: PointerEvent | { x: number; y: number },
  p2: PointerEvent | { x: number; y: number },
) => {
  const x1 = "clientX" in p1 ? p1.clientX : p1.x;
  const y1 = "clientY" in p1 ? p1.clientY : p1.y;
  const x2 = "clientX" in p2 ? p2.clientX : p2.x;
  const y2 = "clientY" in p2 ? p2.clientY : p2.y;

  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

export default KonvaCanvas;
