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
        <div className="flex gap-4 font-semibold ">
          <NavLink
            to="/"
            className={
              ({ isActive }) =>
                isActive
                  ? "text-[#E10600] underline underline-offset-8 decoration-2" // Röd text, understrykning med avstånd
                  : "text-black" // Standard textfärg
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/standings"
            className={({ isActive }) =>
              isActive
                ? "text-[#E10600] underline underline-offset-8 decoration-2"
                : "text-black"
            }
          >
            Standings
          </NavLink>
          <p>Drivers</p>
          <p>About</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
