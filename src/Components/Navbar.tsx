import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white w-full flex items-center justify-center h-[70px] border-b mb-5">
      <div className="w-full md:w-4/6 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <div className="bg-[#E10600] p-1 flex items-center justify-center rounded-md h-[35px]">
            <h1 className="text-white font-bold text-2xl">F1</h1>
          </div>
          <h1 className="text-2xl font-bold"> RaceView</h1>
        </div>
        <div className="flex gap-4 ">
          <NavLink to="/">Dashboard</NavLink>
          <p>Standings</p>
          <p>Drivers</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
