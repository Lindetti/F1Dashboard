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
    <div className="bg-white p-5 rounded-tl-lg rounded-b-lg shadow-lg border">
      {loading ? (
        <div className="text-center text-xl py-10">Loading...</div>
      ) : (
        <table className="w-full table-auto">
          <thead className="bg-white text-left uppercase border-b border-gray-500">
            <tr>
              <th className="border-b-0 px-4 py-5">Pos</th>
              <th className="px-4 py-2">Constructor</th>
              <th className="px-4 py-2">PTS</th>
              <th className="px-4 py-2">Wins</th>
            </tr>
          </thead>
          <tbody>
            {constructorStandings.map((standing, index) => {
              const teamName = standing.Constructor.name;
              const backgroundColor = teamColors[teamName] || "white";

              return (
                <tr
                  key={standing.position}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                >
                  <td className="px-5 py-4 ">{standing.position}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-2">
                        <div
                          className="h-[30px] w-[5px]"
                          style={{ backgroundColor }}
                        ></div>
                        <p
                          style={{ backgroundColor }}
                          className="text-white text-sm font-semibold text-center p-1 rounded-lg"
                        >
                          {" "}
                          {standing.Constructor.name}
                        </p>
                      </div>
                      <p className="text-gray-500 text-sm font-semiold">
                        {" "}
                        {standing.Constructor.nationality}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    {standing.points || "N/A"}
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    {standing.wins || "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ConstructorStandings;
