import { useState, useEffect, useRef } from "react";
import DriverStandings from "./Standings/DriverStandings";
import ConstructorStandings from "./Standings/ConstructorStandings";
import { motion } from "framer-motion";
import MobileDriver from "../Images/drivermobile.jpg";
import StandingsDriverImage2 from "../Images/standingsDriver3.jpg";

const Standings = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [view, setView] = useState<"driver" | "constructor">("driver");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="w-full min-h-screen flex flex-col gap-5 mt-2 md:mt-5 mb-5 text-black">
      <div className="flex flex-col h-[380px] md:h-[200px] ">
        <div className=" flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
          <div className="w-full flex flex-col gap-3">
            {" "}
            <div className="md:hidden w-full h-[150px] z-0">
              <div className="relative h-full w-full overflow-hidden rounded-t-2xl">
                <img
                  className="w-full h-full object-cover brightness-75"
                  src={MobileDriver}
                  alt="driverImage"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-500 opacity-60"></div>
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="flex items-center gap-1">
                    <div className="bg-[#8B0000] p-1 flex items-center justify-center rounded-md h-[35px]">
                      <h1 className="text-white font-bold text-2xl">F1</h1>
                    </div>
                    <h1 className="text-2xl font-bold text-white"> RaceView</h1>
                  </div>
                </div>
              </div>
            </div>
            <h1 className="font-bold text-2xl md:text-5xl text-gray-400 text-center md:text-left">
              Championship Standings
            </h1>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 mt-4">
          <div className="flex border border-gray-700 w-full md:w-[400px] h-[40px] items-center justify-center rounded-md">
            <div className="p-1 w-full">
              <button
                onClick={() => setView("driver")}
                className={`w-full cursor-pointer py-0.5 rounded-sm  ${
                  view === "driver"
                    ? "bg-[#8B0000] font-semibold text-gray-300"
                    : "text-gray-400 hover:bg-[#20202D]"
                }`}
              >
                Drivers
              </button>
            </div>
            <div className="p-1 w-full">
              <button
                onClick={() => setView("constructor")}
                className={`w-full cursor-pointer py-0.5 rounded-sm ${
                  view === "constructor"
                    ? "bg-[#8B0000] font-semibold text-gray-300"
                    : "text-gray-400 hover:bg-[#20202D]"
                }`}
              >
                Constructors
              </button>
            </div>
          </div>{" "}
          <div ref={dropdownRef} className="w-full md:w-auto relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="border border-gray-700 text-gray-300 flex items-center justify-between px-4 md:px-2 rounded-md cursor-pointer w-full md:w-[160px] h-[40px] z-10"
            >
              {selectedYear === currentYear
                ? "Current Season"
                : `Season: ${selectedYear}`}
              <div className="text-sm md:mt-1">▼</div>
            </button>
            {isDropdownOpen && (
              <div className="absolute bg-[#15151E] border border-gray-700 text-gray-400 w-full md:w-[160px] mt-1 rounded-md shadow-md z-20">
                {yearOptions.map((year) => (
                  <div
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer ${
                      selectedYear === year
                        ? "bg-[#8B0000] text-white font-semibold"
                        : "hover:bg-[#20202D]"
                    }`}
                  >
                    {year === currentYear ? "Current Season" : `Season ${year}`}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row mb-2 mt-5 items-start md:items-center relative">
          <div>
            <h1 className="font-bold text-xl md:text-2xl text-gray-400">
              {view === "driver"
                ? "Driver Championship"
                : "Constructor Championship"}
            </h1>
            <p className="font-semibold text-gray-400 pl-0.5 text-sm md:text-base">
              {selectedYear} Season{" "}
              {view === "driver" ? "Driver" : "Constructor"} Standings
            </p>
          </div>{" "}
          <div className="hidden md:block absolute top-[-124px] right-[1px] w-[500px] h-[200px] z-0">
            {" "}
            <div className="relative h-full w-full overflow-hidden shadow-[0_0_8px_8px_#1A1A24] rounded-t-lg">
              <img
                className="w-full h-full object-cover brightness-40 mix-blend-multiply"
                src={StandingsDriverImage2}
                alt="driverImage"
                style={{
                  boxShadow: "0 0 12px 12px #1A1A24 inset",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A24]/95 to-[#1A1A24] opacity-85"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-10 text-center py-4 rounded-br-3xl">
              <div className="flex justify-center items-center gap-1">
                <div className="bg-[#8B0000] p-1 flex items-center justify-center rounded-md h-[35px]">
                  <h1 className="text-white font-bold text-2xl">F1</h1>
                </div>
                <h1 className="text-2xl font-bold text-white"> RaceView</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        key={view}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="overflow-x-auto"
      >
        {view === "driver" ? (
          <DriverStandings selectedYear={selectedYear} />
        ) : (
          <ConstructorStandings selectedYear={selectedYear} />
        )}
      </motion.div>
    </div>
  );
};

export default Standings;
