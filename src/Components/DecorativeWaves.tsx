import React from "react";

export const LeftWave: React.FC = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-[25%] z-0 hidden lg:block pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(139, 0, 0, 0.1), rgba(139, 0, 0, 0.03) 70%, transparent 100%)",
          opacity: 0.6,
        }}
      />
    </div>
  );
};

export const RightWave: React.FC = () => {
  return (
    <div className="fixed right-0 top-0 h-full w-[25%] z-0 hidden lg:block pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to left, rgba(139, 0, 0, 0.1), rgba(139, 0, 0, 0.03) 70%, transparent 100%)",
          opacity: 0.6,
        }}
      />
    </div>
  );
};
