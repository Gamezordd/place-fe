import { Stage, Layer, Rect, Group } from "react-konva";
import useStore from "./store";
import { socket } from "./SocketManager";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
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
  const [isSliderActive, setIsSliderActive] = useState(false);
  const sliderTimeoutRef = useRef<any | null>(null);

  const pixelSize = useMemo(() => {
    return Math.min(dimensions.width, dimensions.height) / CANVAS_SIZE;
  }, [dimensions.width, dimensions.height]);

  const minScale = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return 1;
    const scaleX = dimensions.width / (CANVAS_SIZE * pixelSize);
    const scaleY = dimensions.height / (CANVAS_SIZE * pixelSize);
    return Math.min(scaleX, scaleY);
  }, [dimensions.width, dimensions.height, pixelSize]);

  useEffect(() => {
    if (stage.scale < minScale) {
      setStage((prevStage) => ({ ...prevStage, scale: minScale }));
    }
  }, [minScale, stage.scale]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = Math.max(parseFloat(e.target.value), minScale);
    setStage((prevStage) => ({ ...prevStage, scale: newScale }));
    setIsSliderActive(true);

    if (sliderTimeoutRef.current) {
      clearTimeout(sliderTimeoutRef.current);
    }
    sliderTimeoutRef.current = setTimeout(() => {
      setIsSliderActive(false);
    }, 800);
  };

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
            height: containerRef.current.offsetWidth - 16,
          });
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const handleWheel = useCallback((e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stageKonva = e.target.getStage() as StageType;
    const oldScale = stageKonva.scaleX();
    const pointer = stageKonva.getPointerPosition();

    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x) / oldScale,
      y: (pointer.y - stage.y) / oldScale,
    };

    let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    newScale = Math.max(newScale, minScale);

    setStage(() => ({
      scale: newScale,
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    }));
  }, [minScale]);

  /**
   * Handle a click on a pixel.
   * If the user is not logged in, show an alert.
   * If the cooldown is not over, shake the pixel and then restore its color.
   * If the cooldown is over, send a draw_pixel event to the server and update the pixel's color.
   * @param {KonvaEventObject<MouseEvent>} e - The event object.
   */
  const handlePixelClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
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
  }, [username, cooldown, canvas, selectedColor, pixelSize, setIsShaking, updatePixel]);

  const dragBoundFunc = useCallback((pos: { x: number; y: number }) => {
    const scale = stage.scale;
    const stageWidth = dimensions.width;
    const stageHeight = dimensions.height;
    const canvasRenderedWidth = CANVAS_SIZE * pixelSize * scale;
    const canvasRenderedHeight = CANVAS_SIZE * pixelSize * scale;

    const x = Math.max(pos.x, stageWidth - canvasRenderedWidth);
    const y = Math.max(pos.y, stageHeight - canvasRenderedHeight);

    return { x: Math.min(x, 0), y: Math.min(y, 0) };
  }, [dimensions.width, dimensions.height, stage.scale, pixelSize]);

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
        dragBoundFunc={dragBoundFunc}
      >
        <Layer ref={layerRef}>
          <Rect x={0} y={0} fill="#FFFFFF" />
          <Group>
            {useMemo(() => (
              Array.from({ length: CANVAS_SIZE * CANVAS_SIZE }).map(
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
              )
            ), [canvas, pixelSize, handlePixelClick])}
          </Group>
        </Layer>
      </Stage>
      <input
        type="range"
        min={minScale}
        max="10"
        step="0.5"
        value={stage.scale}
        onChange={handleSliderChange}
        onMouseDown={() => {
          setIsSliderActive(true);
          if (sliderTimeoutRef.current) {
            clearTimeout(sliderTimeoutRef.current);
          }
        }}
        onTouchStart={() => {
          setIsSliderActive(true);
          if (sliderTimeoutRef.current) {
            clearTimeout(sliderTimeoutRef.current);
          }
        }}
        onMouseUp={() => {
          sliderTimeoutRef.current = setTimeout(() => {
            setIsSliderActive(false);
          }, 800);
        }}
        onTouchEnd={() => {
          sliderTimeoutRef.current = setTimeout(() => {
            setIsSliderActive(false);
          }, 800);
        }}
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2 md:hidden transition-opacity duration-500 ${isSliderActive ? 'opacity-100' : 'opacity-50'}`}
      />
    </div>
  );
};

export default KonvaCanvas;
