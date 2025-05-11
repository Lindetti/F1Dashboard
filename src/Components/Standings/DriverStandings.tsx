import { useState, useEffect } from "react";
import { flagData } from "../../flagData";
import { teamColors } from "../../TeamColors";

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
        const response = await fetch(
          `https://api.jolpi.ca/ergast/f1/${selectedYear}/driverstandings.json`
        );
        const data = await response.json();
        console.log(data);

        if (data.MRData.StandingsTable.StandingsLists.length > 0) {
          setDriverStandings(
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

  return (
    <div className="rounded-tl-lg rounded-b-lg shadow-lg border border-gray-700 overflow-x-auto">
      {loading ? (
        <div className="text-center text-xl py-10">Loading...</div>
      ) : (
        <div className="min-w-[600px] md:w-full">
          {" "}
          {/* Minimum width for mobile scrolling */}
          <table className="w-full table-auto">
            <thead className="text-left uppercase border-b border-gray-500">
              <tr className="text-gray-300">
                <th className="border-b-0 px-7 py-5 whitespace-nowrap">Pos</th>
                <th className="px-4 py-2 whitespace-nowrap">Driver</th>
                <th className="px-4 py-2 whitespace-nowrap">Nationality</th>
                <th className="px-4 py-2 whitespace-nowrap">Constructor</th>
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
                      <td className="px-4 py-2 whitespace-nowrap min-w-[180px]">
                        {standing.Driver.givenName} {standing.Driver.familyName}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap min-w-[150px]">
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
                      <td className="px-4 py-2 whitespace-nowrap min-w-[150px]">
                        <div
                          className="px-2 py-0.5 rounded-lg inline-block text-white"
                          style={{ backgroundColor }}
                        >
                          {standing.Constructors[0]?.name}
                        </div>
                      </td>
                      <td className="px-4 py-2 font-semibold whitespace-nowrap">
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
