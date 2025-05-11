import { useState, useEffect, useRef } from "react";
import { flagData } from "../../flagData";
import { teamColors } from "../../TeamColors";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [drivers, setDrivers] = useState<Drivers[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleDriverClick = (driverId: string) => {
    navigate(`/driver/${driverId}`, { state: { selectedYear } });
  };

  useEffect(() => {
    const fetchDriverStandings = async () => {
      try {
        const response = await fetch(
          `https://api.jolpi.ca/ergast/f1/${selectedYear}/driverstandings.json`
        );
        const data = await response.json();
        console.log(data);

        if (data.MRData.StandingsTable.StandingsLists.length > 0) {
          setDrivers(
            data.MRData.StandingsTable.StandingsLists[0].DriverStandings
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
    <div className="w-full min-h-screen flex flex-col gap-2 mb-5 text-black items-center px-4 md:px-0">
      <div className="w-full flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t-[10px] border-r-[10px] py-4 pr-3 border-[#20202D] rounded-tr-3xl">
          <h1 className="font-bold text-3xl md:text-5xl text-gray-400">
            F1 Drivers {selectedYear}
          </h1>
          <div ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="border border-gray-700 text-gray-300 flex items-center justify-between p-2 rounded-md rounded-tr-2xl cursor-pointer w-full md:w-[150px] h-[40px] z-10"
            >
              {selectedYear === currentYear
                ? "Current Season"
                : `Season: ${selectedYear}`}
              <div>▼</div>
            </button>
            {isDropdownOpen && (
              <div className="absolute bg-[#15151E] border border-gray-700 text-gray-400 w-full md:w-[150px] mt-1 rounded-md shadow-md z-20">
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

        <div className="flex flex-col gap-8">
          <div className="bg-[#8B0000] p-4 rounded-sm text-white">
            <h1 className="font-semibold text-sm md:text-base">
              {selectedYear} drivers, current positions, points
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {drivers.slice(0, 20).map((driver) => {
              const teamName = driver.Constructors[0]?.name;
              const backgroundColor = teamColors[teamName] || "#808080";

              return (
                <div
                  key={driver.Driver.driverId}
                  className="w-full min-h-[230px] p-4 rounded-tl-lg rounded-tr-lg 
                           border-t-[15px] border-b-2 bg-[#1A1A24] border-b-gray-500 
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
  );
};

export default Drivers;
