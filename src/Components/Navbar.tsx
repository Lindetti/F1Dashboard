const Navbar = () => {
  return (
    <nav className="bg-[#15151E] w-full flex items-center justify-center h-[80px]">
      <div className="w-full md:w-4/6 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <div className="bg-[#8B0000] p-1 flex items-center justify-center rounded-md h-[35px] w-[35px]">
            <h1 className="text-white font-bold text-2xl">F1</h1>
          </div>
          <h1 className="text-2xl font-bold text-gray-300"> RaceView</h1>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
