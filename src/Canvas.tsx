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
      style={{
        width: '100%',
        maxWidth: '1000px',
        position: 'relative',
        paddingBottom: '100%', // This creates the square aspect ratio
        border: '2px solid #6B7280',
        boxSizing: 'border-box', // Include padding and border in the element's total width and height
        padding: '10px', // Move padding to the outer wrapper
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${CANVAS_SIZE}, 1fr)`,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        {Array.from({ length: CANVAS_SIZE * CANVAS_SIZE }).map((_, index) => {
          const x = index % CANVAS_SIZE;
          const y = Math.floor(index / CANVAS_SIZE);
          const pixel = canvas[`${x}:${y}`];

          return (
            <div
              key={index}
              style={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: pixel ? pixel.color : '#FFFFFF', 
                border: '1px solid #E5E7EB' 
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