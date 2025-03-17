import { useState, useEffect } from "react";
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
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [season, setSeason] = useState<string>("");

  useEffect(() => {
    const fetchDriverStandings = async () => {
      try {
        const response = await fetch(
          "https://api.jolpi.ca/ergast/f1/2025/driverstandings.json"
        );
        const data = await response.json();
        console.log(data);

        const season = data.MRData.StandingsTable.StandingsLists[0].season;
        setSeason(season);

        setDriverStandings(
          data.MRData.StandingsTable.StandingsLists[0].DriverStandings
        );
      } catch (error) {
        console.error("Error fetching driver standings:", error);
      }
    };

    fetchDriverStandings();
  }, []);

  return (
    <div className=" md:w-4/6 min-h-screen flex flex-col gap-4 mb-5 text-white p-4">
      <Link
        className="bg-gray-600 w-[150px] h-[50px] flex items-center justify-center rounded-lg cursor-pointer"
        to="/"
      >
        Back to dashboard
      </Link>
      <div className="bg-gray-800 p-5 rounded-md shadow-lg">
        <div className="bg-gray-800 h-[80px] p-4">
          <h1 className="font-bold text-3xl">Driver Standings {season}</h1>
        </div>
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
                  <td className="px-4 py-2">{standing.Driver.nationality} </td>
                  <td className="px-4 py-2">
                    {standing.Constructors[0]?.name}
                  </td>
                  <td className="px-4 py-2">{standing.points || "N/A"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverStandings;
