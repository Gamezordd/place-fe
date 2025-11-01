import React from "react";

const Background: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] bg-gray-900 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 opacity-50"></div>
      <div className="absolute top-1/4 left-1/4 w-[50rem] h-[50rem] bg-blue-500 rounded-full mix-blend-screen filter blur-[10rem] opacity-30 animate-blob"></div>
      <div className="absolute top-1/2 right-1/4 w-[50rem] h-[50rem] bg-purple-500 rounded-full mix-blend-screen filter blur-[10rem] opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[50rem] h-[50rem] bg-pink-500 rounded-full mix-blend-screen filter blur-[10rem] opacity-30 animate-blob animation-delay-4000"></div>
    </div>
  );
};

export default Background;
