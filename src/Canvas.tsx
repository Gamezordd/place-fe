import useStore from './store';
import { socket } from './SocketManager';

const CANVAS_SIZE = 50;

const Canvas = () => {
  const { canvas, username, selectedColor, updatePixel, cooldown } = useStore();

  const handlePixelClick = (x, y) => {
    if (!username) {
      alert('Please log in to draw.');
      return;
    }

    if (cooldown > 0) {
      alert(`Please wait ${cooldown} seconds before placing another pixel.`);
      return;
    }

    const timestamp = Date.now();

    socket.emit('draw_pixel', { x, y, color: selectedColor, timestamp });
    updatePixel(x, y, selectedColor, timestamp);
  };

  return (
    <div
      className="grid border-2 border-gray-700"
      style={{
        gridTemplateColumns: `repeat(${CANVAS_SIZE}, 1fr)`,
        width: '1000px',
        height: '1000px',
      }}
    >
      {Array.from({ length: CANVAS_SIZE * CANVAS_SIZE }).map((_, index) => {
        const x = index % CANVAS_SIZE;
        const y = Math.floor(index / CANVAS_SIZE);
        const pixel = canvas[`${x}:${y}`];

        return (
          <div
            key={index}
            className="w-full h-full border border-gray-800"
            style={{ backgroundColor: pixel ? pixel.color : '#FFFFFF' }}
            onClick={() => handlePixelClick(x, y)}
          />
        );
      })}
    </div>
  );
};

export default Canvas;