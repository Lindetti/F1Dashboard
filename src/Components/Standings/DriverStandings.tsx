import { useState, useEffect } from "react";
import { flagData } from "../../flagData";
import { teamColors } from "../../TeamColors";

interface DriverStanding {
  Driver: {
    driverId: string;
    familyName: string;
    givenName: string;
    nationality: string;
    code?: string;
  };
  Constructors: {
    name: string;
  }[];
  position: string;
  points: string;
}

interface DriverStandingsProps {
  selectedYear: number;
}

const DriverStandings = ({ selectedYear }: DriverStandingsProps) => {
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchDriverStandings = async () => {
      try {
        // Check localStorage 
        const cacheKey = `driver-standings-${selectedYear}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          // Cache for 6 hours
          if (Date.now() - timestamp < 6 * 60 * 60 * 1000) {
            setDriverStandings(data);
            setLoading(false);
            return;
          }
          // Cache expired, remove it
          localStorage.removeItem(cacheKey);
        }

        const response = await fetch(
          `https://api.jolpi.ca/ergast/f1/${selectedYear}/driverstandings.json`
        );
        const data = await response.json();

        if (data.MRData.StandingsTable.StandingsLists.length > 0) {
          const standings =
            data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
          setDriverStandings(standings);

          // Save to localStorage with timestamp
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: standings,
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

  return (
    <div className="rounded-tl-lg rounded-tr-lg rounded-b-lg shadow-lg border border-gray-700 overflow-x-auto">
      {loading ? (
        <div className="text-center text-xl py-10">Loading...</div>
      ) : (
        <div className="w-full">
          <table className="w-full table-auto">
            <thead className="text-left uppercase border-b border-gray-500">
              <tr className="text-gray-300">
                <th className="border-b-0 px-7 py-5 whitespace-nowrap">Pos</th>
                <th className="px-4 py-2 whitespace-nowrap">Driver</th>
                <th className="hidden md:table-cell px-4 py-2 whitespace-nowrap">
                  Nationality
                </th>
                <th className="hidden md:table-cell px-4 py-2 whitespace-nowrap">
                  Constructor
                </th>
                <th className="px-4 py-2 whitespace-nowrap">PTS</th>
              </tr>
            </thead>
            <tbody>
              {driverStandings
                .filter((standing) => !isNaN(Number(standing.position)))
                .map((standing, index) => {
                  const teamName = standing.Constructors[0]?.name;
                  const backgroundColor = teamColors[teamName] || "bg-gray-500";

                  return (
                    <tr
                      key={standing.Driver.driverId}
                      className={
                        index % 2 === 0
                          ? "bg-[#1A1A24] text-gray-300"
                          : "bg-[#20202D] text-gray-300"
                      }
                    >
                      <td className="px-10 py-4 whitespace-nowrap">
                        {standing.position}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap relative">
                        <div className="flex items-center gap-2">
                          <div
                            className=" md:block w-[5px] h-[15px]"
                            style={{ backgroundColor }}
                          ></div>
                          <div className="relative group">
                            <div className="cursor-default font-semibold">
                              {standing.Driver.code}
                            </div>
                            <div className="absolute w-auto border border-gray-700 left-full top-1/2 transform -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                              {standing.Driver.givenName}{" "}
                              {standing.Driver.familyName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          {flagData[standing.Driver.nationality] ? (
                            <img
                              src={flagData[standing.Driver.nationality]}
                              alt={standing.Driver.nationality}
                              className="w-6 h-4 mr-2"
                            />
                          ) : null}
                          <span>{standing.Driver.nationality}</span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap">
                        <div className="flex gap-2 items-center">
                          <div
                            className="h-[30px] w-[5px]"
                            style={{ backgroundColor }}
                          ></div>
                          <p
                            style={{ backgroundColor }}
                            className={`text-sm font-semibold flex items-center px-2 rounded-lg whitespace-nowrap ${
                              backgroundColor === "#FFF500"
                                ? "text-black"
                                : "text-white"
                            }`}
                          >
                            {standing.Constructors[0]?.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-yellow-500 font-semibold">
                        {standing.points || "N/A"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DriverStandings;
