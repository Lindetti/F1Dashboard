import { useState, useEffect, useRef } from "react";

interface DriverStanding {
  Driver: {
    driverId: string;
    familyName: string;
    givenName: string;
    nationality: string;
  };
  Constructors: {
    name: string;
  }[];
  position: "string";
  points: string;
}

const DriverStandings = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [season, setSeason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDriverStandings = async () => {
      try {
        const response = await fetch(
          `https://api.jolpi.ca/ergast/f1/${selectedYear}/driverstandings.json`
        );
        const data = await response.json();

        if (data.MRData.StandingsTable.StandingsLists.length > 0) {
          const season = data.MRData.StandingsTable.StandingsLists[0].season;
          setSeason(season);
          setDriverStandings(
            data.MRData.StandingsTable.StandingsLists[0].DriverStandings
          );
        } else {
          console.warn("No standings data available for this season.");
        }
      } catch (error) {
        console.error("Error fetching driver standings:", error);
      } finally {
        setLoading(false); // Oavsett resultat, sätt loading till false
      }
    };

    fetchDriverStandings();
  }, [selectedYear]);

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
      <div className="flex justify-between items-center ">
        <div className="h-[80px]">
          <h1 className="font-bold text-5xl">Championship Standings</h1>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className=" border border-gray-400 flex items-center justify-between p-2 rounded-md cursor-pointer w-[150px] h-[40px]"
          >
            {selectedYear === currentYear
              ? "Current Season"
              : `Season: ${selectedYear}`}
            <div>▼</div>
          </button>
          {isDropdownOpen && (
            <div className="absolute bg-white border w-[150px] mt-1 rounded-md shadow-md">
              {yearOptions.map((year) => (
                <div
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setIsDropdownOpen(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {year === currentYear ? "Current Season" : `Season ${year}`}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-8 mb-4">
        <div className="flex gap-5 bg-gray-300 w-[400px] h-[40px] items-center justify-center">
          <p>Driver Standings</p>
          <p>Constructor Standings</p>
        </div>

        <div className="flex flex-col">
          <h1 className="font-bold text-2xl">Driver Championship</h1>
          <p className="font-semibold text-gray-400 pl-0.5">
            {season} Season Driver Standings
          </p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-lg border">
        {loading ? (
          <div className="text-center text-xl py-10">Loading...</div>
        ) : (
          <table className="w-full table-auto">
            <thead className="bg-white text-left uppercase border-b border-gray-500">
              <tr>
                <th className="border-b-0 px-4 py-5">Pos</th>
                <th className="px-4 py-2">Driver</th>
                <th className="px-4 py-2">Nationality</th>
                <th className="px-4 py-2">Constructor</th>
                <th className="px-4 py-2">PTS</th>
              </tr>
            </thead>
            <tbody>
              {driverStandings
                .filter((standing) => !isNaN(Number(standing.position))) // Filtrera bort de utan giltig position
                .map((standing, index) => (
                  <tr
                    key={standing.Driver.driverId}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                  >
                    <td className="px-5 py-4">{standing.position}</td>
                    <td className="px-4 py-2">
                      {standing.Driver.givenName} {standing.Driver.familyName}
                    </td>
                    <td className="px-4 py-2">
                      {standing.Driver.nationality}{" "}
                    </td>
                    <td className="px-4 py-2">
                      {standing.Constructors[0]?.name}
                    </td>
                    <td className="px-4 py-2">{standing.points || "N/A"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DriverStandings;
