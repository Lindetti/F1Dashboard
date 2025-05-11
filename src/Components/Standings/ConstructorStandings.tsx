import { useState, useEffect } from "react";
import { teamColors } from "../../TeamColors";

interface ConstructorStanding {
  Constructor: {
    name: string;
    nationality: string;
  };
  position: string;
  points: string;
  wins: string;
}

interface ConstructorStandingsProps {
  selectedYear: number;
}

const ConstructorStandings = ({ selectedYear }: ConstructorStandingsProps) => {
  const [constructorStandings, setConstructorStandings] = useState<
    ConstructorStanding[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchConstructorStandings = async () => {
      try {
        const response = await fetch(
          `https://api.jolpi.ca/ergast/f1/${selectedYear}/constructorstandings.json`
        );
        const data = await response.json();

        if (data.MRData.StandingsTable.StandingsLists.length > 0) {
          setConstructorStandings(
            data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
          );
        } else {
          console.warn("No standings data available for this season.");
        }
      } catch (error) {
        console.error("Error fetching constructor standings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConstructorStandings();
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
                <th className="border-b-0 px-8 py-5 whitespace-nowrap">Pos</th>
                <th className="px-4 py-2 whitespace-nowrap">Constructor</th>
                <th className="px-4 py-2 whitespace-nowrap">PTS</th>
                <th className="px-4 py-2 whitespace-nowrap">Wins</th>
              </tr>
            </thead>
            <tbody>
              {constructorStandings.map((standing, index) => {
                const teamName = standing.Constructor.name;
                const backgroundColor = teamColors[teamName] || "white";

                return (
                  <tr
                    key={standing.position}
                    className={
                      index % 2 === 0
                        ? "bg-[#1A1A24] text-gray-300"
                        : "bg-[#20202D] text-gray-300"
                    }
                  >
                    <td className="px-10 py-4 whitespace-nowrap">
                      {standing.position}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1 min-w-[200px]">
                        <div className="flex gap-2">
                          <div
                            className="h-[30px] w-[5px]"
                            style={{ backgroundColor }}
                          ></div>
                          <p
                            style={{ backgroundColor }}
                            className="text-white text-sm font-semibold flex items-center px-2 rounded-lg whitespace-nowrap"
                          >
                            {standing.Constructor.name}
                          </p>
                        </div>
                        <p className="text-gray-400 text-sm font-semibold">
                          {standing.Constructor.nationality}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-semibold whitespace-nowrap">
                      {standing.points || "N/A"}
                    </td>
                    <td className="px-8 py-2 font-semibold whitespace-nowrap">
                      {standing.wins || "N/A"}
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

export default ConstructorStandings;
