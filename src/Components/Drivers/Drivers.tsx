import { useState, useEffect, useRef } from "react";
import { flagData } from "../../flagData";
import { teamColors } from "../../TeamColors";
import Modal from "../Modal/Modal";
import DriverInfo from "../DriverInfo/DriverInfo";

interface Drivers {
  Driver: {
    driverId: string;
    familyName: string;
    givenName: string;
    nationality: string;
    permanentNumber: string;
  };
  Constructors: {
    name: string;
  }[];
  position: string;
  points: string;
  wins: string;
}

const Drivers = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [drivers, setDrivers] = useState<Drivers[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleDriverClick = (driverId: string) => {
    setSelectedDriver(driverId);
  };

  useEffect(() => {
    const fetchDriverStandings = async () => {
      try {
        const cacheKey = `drivers-page-${selectedYear}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < 6 * 60 * 60 * 1000) {
            setDrivers(data);
            setLoading(false);
            return;
          }
          localStorage.removeItem(cacheKey);
        }

        const response = await fetch(
          `https://api.jolpi.ca/ergast/f1/${selectedYear}/driverstandings.json`
        );
        const data = await response.json();

        if (data.MRData.StandingsTable.StandingsLists.length > 0) {
          const driversData =
            data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
          setDrivers(driversData);

          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: driversData,
              timestamp: Date.now(),
            })
          );
        } else {
          console.warn("No standings data available for this season.");
        }
      } catch (error) {
        console.error("Error fetching driver standings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverStandings();
  }, [selectedYear]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="w-full min-h-screen flex flex-col gap-2 mb-5 text-black items-center">
        <div className="w-full flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t-[5px] border-r-[5px] md:border-t-[10px] md:border-r-[10px] py-4 pr-3 border-[#20202D] rounded-tr-3xl">
            <h1 className="font-bold text-3xl md:text-5xl text-gray-400">
              F1 Drivers {selectedYear}
            </h1>{" "}
            <div ref={dropdownRef} className="w-full md:w-auto relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="border border-gray-700 text-gray-300 flex items-center justify-between p-2 rounded-md rounded-0 md:rounded-tr-2xl cursor-pointer w-full md:w-[150px] h-[40px] z-10"
              >
                {selectedYear === currentYear
                  ? "Current Season"
                  : `Season: ${selectedYear}`}
                <div>▼</div>
              </button>
              {isDropdownOpen && (
                <div className="absolute bg-[#15151E] border border-gray-700 text-gray-400 w-full mt-1 rounded-md shadow-md z-20">
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
                      {year === currentYear
                        ? "Current Season"
                        : `Season ${year}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="relative p-4 rounded-tl-lg rounded-tr-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-20 z-0" />
              <h1 className="relative z-10 font-semibold text-sm md:text-base text-center md:text-left text-gray-200">
                {selectedYear} drivers, current positions and points
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {drivers.slice(0, 20).map((driver) => {
                const teamName = driver.Constructors[0]?.name;
                const backgroundColor = teamColors[teamName] || "#808080";

                return (
                  <div
                    key={driver.Driver.driverId}
                    className="w-full min-h-[230px] p-4 rounded-lg
                             border-t-[15px] border-b-2 bg-[#1A1A24] border-b-gray-700 
                             transition-all duration-300 ease-in-out shadow-md 
                             hover:shadow-lg cursor-pointer"
                    style={{
                      borderTopColor: "#20202D",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderTopColor = backgroundColor)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderTopColor = "#20202D")
                    }
                    onClick={() => handleDriverClick(driver.Driver.driverId)}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-lg text-gray-300">
                          {driver.Driver.givenName} {driver.Driver.familyName}
                        </p>
                        <p className="bg-gray-600 w-[30px] h-[30px] text-white flex items-center justify-center rounded-full text-lg font-semibold">
                          {driver.position}
                        </p>
                      </div>
                      <div
                        className="w-fit text-center text-white rounded-lg px-2"
                        style={{ backgroundColor }}
                      >
                        <p>{driver.Constructors[0]?.name}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-sm text-gray-400">
                          <p>Number</p>
                          <p className="text-gray-400 font-semibold">
                            {driver.Driver.permanentNumber}
                          </p>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <p>Nationality</p>
                          <div className="flex items-center">
                            {flagData[driver.Driver.nationality] ? (
                              <img
                                src={flagData[driver.Driver.nationality]}
                                alt={driver.Driver.nationality}
                                className="w-4 h-3 mr-2"
                              />
                            ) : null}
                            <p className="text-gray-400 font-semibold">
                              {driver.Driver.nationality}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <p>Points</p>
                          <p className="text-gray-400 font-semibold">
                            {driver.points}
                          </p>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <p>Wins</p>
                          <p className="text-gray-400 font-semibold">
                            {driver.wins}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={selectedDriver !== null}
        onClose={() => setSelectedDriver(null)}
      >
        {selectedDriver && (
          <DriverInfo driverId={selectedDriver} selectedYear={selectedYear} />
        )}
      </Modal>
    </>
  );
};

export default Drivers;
