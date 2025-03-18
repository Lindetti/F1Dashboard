import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

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
    <div className=" md:w-4/6 min-h-screen flex flex-col gap-4 mb-5 text-white p-4">
      <div className="flex justify-between items-center ">
        <Link
          className="bg-gray-600 w-[150px] h-[40px] flex items-center justify-center rounded-lg cursor-pointer"
          to="/"
        >
          Back to dashboard
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-gray-600 text-white flex items-center justify-between p-2 rounded-md cursor-pointer w-[100px] h-[40px]"
          >
            {selectedYear}
            <div>▼</div>
          </button>
          {isDropdownOpen && (
            <div className="absolute bg-gray-600 text-white w-[100px] mt-1 rounded-md shadow-md">
              {yearOptions.map((year) => (
                <div
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setIsDropdownOpen(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-500"
                >
                  {year}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
        <div className="bg-gray-800 h-[80px] p-2">
          <h1 className="font-bold text-3xl">Driver Standings {season}</h1>
        </div>
        {loading ? (
          <div className="text-center text-xl py-10">Loading...</div>
        ) : (
          <table className="w-full table-auto">
            <thead className="bg-gray-800 text-left uppercase border-b border-gray-500">
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
                    className={index % 2 === 0 ? "bg-gray-800 " : "bg-gray-700"}
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
