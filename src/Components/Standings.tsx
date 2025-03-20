import { useState, useEffect, useRef } from "react";
import DriverStandings from "./DriverStandings";
import ConstructorStandings from "./ConstructorStandings";
import { motion } from "framer-motion";
import StandingsDriverImage from "../Images/standingsDriver2.png";

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
    <div className="md:w-4/6 min-h-screen flex flex-col gap-2 mb-5 text-black">
      <div className="flex justify-between items-center">
        <div className="h-[80px]">
          <h1 className="font-bold text-5xl">Championship Standings</h1>
        </div>
      </div>

      <div className="flex gap-5">
        <div className="flex bg-gray-200 w-[400px] h-[40px] items-center justify-center p-1 rounded-md">
          <button
            onClick={() => setView("driver")}
            className={`w-full cursor-pointer py-1 rounded-sm ${
              view === "driver" ? "bg-white font-semibold" : "text-gray-500"
            }`}
          >
            Driver Standings
          </button>
          <button
            onClick={() => setView("constructor")}
            className={`w-full cursor-pointer py-1 rounded-sm ${
              view === "constructor"
                ? "bg-white font-semibold"
                : "text-gray-500"
            }`}
          >
            Constructor Standings
          </button>
        </div>

        <div ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-white border border-gray-400 flex items-center justify-between p-2 rounded-md cursor-pointer w-[150px] h-[40px] z-10"
          >
            {selectedYear === currentYear
              ? "Current Season"
              : `Season: ${selectedYear}`}
            <div>▼</div>
          </button>
          {isDropdownOpen && (
            <div className="absolute bg-white border w-[150px] mt-1 rounded-md shadow-md z-20">
              {yearOptions.map((year) => (
                <div
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setIsDropdownOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-[#E10600] hover:text-white ${
                    selectedYear === year ? "bg-[#E10600] text-white" : ""
                  }`}
                >
                  {year === currentYear ? "Current Season" : `Season ${year}`}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex mb-2 mt-5 items-center relative">
        <div>
          <h1 className="font-bold text-2xl">
            {view === "driver"
              ? "Driver Championship"
              : "Constructor Championship"}
          </h1>
          <p className="font-semibold text-gray-400 pl-0.5">
            {selectedYear} Season {view === "driver" ? "Driver" : "Constructor"}{" "}
            Standings
          </p>
        </div>

        <div className="absolute top-[-180px] right-[1px] w-[250px] h-[250px] z-0">
          {/* Bilden med rundade hörn */}
          <img
            className="w-full h-full object-cover rounded-tr-2xl relative brightness-75"
            src={StandingsDriverImage}
            alt="driverImage"
          />

          {/* Skuggan som ligger ovanpå */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-500 opacity-40 rounded-tr-2xl"></div>

          {/* Texten längst ner */}
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-10 text-center py-4 rounded-br-3xl">
            <div className="flex justify-center items-center gap-1">
              <div className="bg-[#E10600] p-1 flex items-center justify-center rounded-md h-[35px]">
                <h1 className="text-white font-bold text-2xl">F1</h1>
              </div>
              <h1 className="text-2xl font-bold text-white"> RaceView</h1>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        key={view} // Lägg till key så att Framer Motion vet att det är olika komponenter
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
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
