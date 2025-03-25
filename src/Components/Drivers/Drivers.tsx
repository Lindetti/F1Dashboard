import { useState, useEffect, useRef } from "react";

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

  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

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
    <div className="md:w-4/6 min-h-screen flex flex-col gap-2 mb-5 text-black">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between border-t-[12px] border-r-[12px] py-4 pr-4 border-gray-800 rounded-tr-3xl">
          <h1 className="font-semibold text-4xl">F1 Drivers 2025</h1>
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
                    className={`px-4 py-2 cursor-pointer ${
                      selectedYear === year
                        ? "bg-[#E10600] text-white"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    {year === currentYear ? "Current Season" : `Season ${year}`}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="font-semibold text-2xl">Driver Profiles</h1>
            <p>2025 season Drivers</p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center ">
            {drivers.slice(0, 20).map((driver) => {
              return (
                <div
                  key={driver.Driver.driverId}
                  className="w-[250px] h-[230px] flex-grow p-4 border-t-[15px] rounded-tl-lg rounded-tr-lg"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-lg">
                        {driver.Driver.givenName} {driver.Driver.familyName}
                      </p>
                      <p className="bg-black w-[30px] h-[30px] text-white flex items-center justify-center rounded-full text-lg font-semibold">
                        {driver.position}
                      </p>
                    </div>
                    <div>
                      <p>{driver.Constructors[0]?.name}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-sm text-gray-600">
                        <p>Number</p>
                        <p className="text-black font-semibold">
                          {driver.Driver.permanentNumber}
                        </p>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <p>Nationality</p>
                        <p className="text-black font-semibold">
                          {driver.Driver.nationality}
                        </p>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <p>Points</p>
                        <p className="text-black font-semibold">
                          {driver.points}
                        </p>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <p>Wins</p>
                        <p className="text-black font-semibold">
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
