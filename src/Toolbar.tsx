import React from "react";
import useStore from "./store";

const colors = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FFFFFF",
  "#000000",
];

const Toolbar: React.FC = () => {
  const {
    cooldown,
    selectedColor,
    setSelectedColor,
    username,
    logout,
    isShaking,
  } = useStore();

  return (
    <div className="bg-transparent text-white p-4 flex flex-col z-10">
      <div className="w-full flex justify-between items-center mb-4">
        <div className={`font-mono text-lg ${isShaking ? "shake" : ""}`}>
          {cooldown > 0 ? `Cooldown: ${cooldown}s` : "Ready to place a pixel"}
        </div>
        <div className="flex items-center pl-4">
          <div className="text-lg font-semibold mr-4">{username}</div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex">
        <div className="mr-6">
          <h3 className="text-sm font-bold mb-2">Color Palette</h3>
          <div className="flex items-center p-2 rounded-full bg-gray-700">
            {colors.map((color) => (
              <div
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 mx-1 cursor-pointer rounded-full transition-all transform hover:scale-110 hover:shadow-lg ${selectedColor === color ? "ring-4 ring-blue-500 ring-offset-2 ring-offset-gray-800" : ""}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
