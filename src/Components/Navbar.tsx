import { NavLink } from "react-router-dom";
import DashboardRed from "../assets/icons/dashboardRed.png";
import DashboardBlack from "../assets/icons/dashboardBlack.png";
import StandingsRed from "../assets/icons/standingsRed.png";
import StandingsBlack from "../assets/icons/standingsBlack.png";
import DriversRed from "../assets/icons/driversRed.png";
import DriversBlack from "../assets/icons/driversBlack.png";

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
        <div className="flex gap-7 font-semibold ">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `group relative flex items-center gap-1 pb-1 ${
                isActive ? "text-[#E10600]" : "text-black"
              } hover:text-[#E10600] transition-all duration-200 ease-in-out`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? DashboardRed : DashboardBlack}
                  alt="Home Icon"
                  className="w-5 h-5 group-hover:hidden"
                />
                <img
                  src={DashboardRed} // Använd DashboardRed på hover
                  alt="Home Icon Hover"
                  className="w-5 h-5 group-hover:block hidden transition-all duration-300 ease-in-out" // Synlig vid hover
                />
                <span>Dashboard</span>

                {/* Underline som täcker både ikon och text */}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#E10600] ${
                    isActive ? "block" : "hidden"
                  } group-hover:block`}
                />
              </>
            )}
          </NavLink>
          <NavLink
            to="/standings"
            className={({ isActive }) =>
              `group relative flex items-center gap-1 pb-1 ${
                isActive ? "text-[#E10600]" : "text-black"
              } hover:text-[#E10600] transition-all duration-200 ease-in-out`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? StandingsRed : StandingsBlack}
                  alt="Home Icon"
                  className="w-5 h-5 group-hover:hidden"
                />
                <img
                  src={StandingsRed} // Använd DashboardRed på hover
                  alt="Home Icon Hover"
                  className="w-5 h-5 group-hover:block hidden transition-all duration-300 ease-in-out" // Synlig vid hover
                />
                <span>Standings</span>

                {/* Underline som täcker både ikon och text */}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#E10600] ${
                    isActive ? "block" : "hidden"
                  } group-hover:block`}
                />
              </>
            )}
          </NavLink>
          <NavLink
            to="/drivers"
            className={({ isActive }) =>
              `group relative flex items-center gap-1 pb-1 ${
                isActive ? "text-[#E10600]" : "text-black"
              } hover:text-[#E10600] transition-all duration-200 ease-in-out`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? DriversRed : DriversBlack}
                  alt="Home Icon"
                  className="w-6 h-6 group-hover:hidden"
                />
                <img
                  src={DriversRed} // Använd DashboardRed på hover
                  alt="Home Icon Hover"
                  className="w-6 h-6 group-hover:block hidden transition-all duration-300 ease-in-out" // Synlig vid hover
                />
                <span>Drivers</span>

                {/* Underline som täcker både ikon och text */}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#E10600] ${
                    isActive ? "block" : "hidden"
                  } group-hover:block`}
                />
              </>
            )}
          </NavLink>
          <p>About</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
