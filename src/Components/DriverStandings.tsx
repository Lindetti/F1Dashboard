import { useState, useEffect } from "react";

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
    <div className="bg-white p-5 rounded-tl-lg rounded-b-lg shadow-lg border">
      {loading ? (
        <div className="text-center text-xl py-10">Loading...</div>
      ) : (
        <table className="w-full table-auto relative">
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
                  <td className="px-5 py-4 ">{standing.position}</td>
                  <td className="px-4 py-2">
                    {standing.Driver.givenName} {standing.Driver.familyName}
                  </td>
                  <td className="px-4 py-2">{standing.Driver.nationality} </td>
                  <td className="px-4 py-2">
                    {standing.Constructors[0]?.name}
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    {standing.points || "N/A"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DriverStandings;
