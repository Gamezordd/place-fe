import { useState } from "react";
import useStore from "./store";
import { socket } from "./SocketManager";

const CANVAS_SIZE = 50;

const Canvas = () => {
  const {
    canvas,
    username,
    selectedColor,
    updatePixel,
    cooldown,
    setIsShaking,
  } = useStore();
  const [tempPixel, setTempPixel] = useState<{
    x: number;
    y: number;
    color: string;
  } | null>(null);
  const [fadingPixel, setFadingPixel] = useState<{
    x: number;
    y: number;
    color: string;
  } | null>(null);

  const handlePixelClick = (x: number, y: number) => {
    if (!username) {
      alert("Please log in to draw.");
      return;
    }

    if (cooldown > 0) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      const originalColor = canvas[`${x}:${y}`]?.color || "#FFFFFF";
      setTempPixel({ x, y, color: selectedColor });

      setTimeout(() => {
        setTempPixel(null);
        setFadingPixel({ x, y, color: originalColor });
        setTimeout(() => {
          setFadingPixel(null);
        }, 1000);
      }, 100);
      return;
    }

    const timestamp = Date.now();

    socket.emit("draw_pixel", { x, y, color: selectedColor, timestamp });
    updatePixel(x, y, selectedColor, timestamp);
  };

  return (
    <div className="w-full m-2 max-w-[80vh] relative max-h-[80vh] border-2 border-gray-700 box-border p-1.5 aspect-square rounded-lg shadow-2xl">
      <div
        className="grid w-full h-full box-border p-1"
        style={{ gridTemplateColumns: `repeat(${CANVAS_SIZE}, 1fr)` }}
      >
        {Array.from({ length: CANVAS_SIZE * CANVAS_SIZE }).map((_, index) => {
          const x = index % CANVAS_SIZE;
          const y = Math.floor(index / CANVAS_SIZE);
          const pixel = canvas[`${x}:${y}`];
          const tempPixelColor =
            tempPixel && tempPixel.x === x && tempPixel.y === y
              ? tempPixel.color
              : null;
          const fadingPixelColor =
            fadingPixel && fadingPixel.x === x && fadingPixel.y === y
              ? fadingPixel.color
              : null;

          return (
            <div
              key={index}
              className={`w-full h-full border border-gray-300 ${fadingPixel && fadingPixel.x === x && fadingPixel.y === y ? "transition-all duration-1000" : ""}`}
              style={{
                backgroundColor:
                  tempPixelColor ||
                  fadingPixelColor ||
                  (pixel ? pixel.color : "#FFFFFF"),
              }}
              onClick={() => handlePixelClick(x, y)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Canvas;
