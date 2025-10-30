import React from 'react';
import useStore from './store';

const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFFFFF', '#000000'];

const Toolbar: React.FC = () => {
  const { cooldown, selectedColor, setSelectedColor } = useStore();

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: '#333', color: 'white', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>{cooldown > 0 ? `Cooldown: ${cooldown}s` : 'Ready to place a pixel'}</div>
      <div>
        {colors.map(color => (
          <div 
            key={color} 
            onClick={() => setSelectedColor(color)} 
            style={{ 
              backgroundColor: color, 
              width: '30px', 
              height: '30px', 
              display: 'inline-block', 
              margin: '0 5px', 
              cursor: 'pointer',
              border: selectedColor === color ? '2px solid white' : '2px solid transparent'
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
