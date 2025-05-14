import { teamColors } from "../../TeamColors";

interface RaceResultsProps {
  results: Array<{
    position: string;
    Driver: {
      code: string;
      givenName: string;
      familyName: string;
    };
    Constructor: {
      name: string;
    };
    Time?: {
      time: string;
    };
    status?: string;
  }>;
}

const RaceResults: React.FC<RaceResultsProps> = ({ results }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-[#15151E] border border-gray-700 text-gray-300">
            <th className="rounded-l-md px-4 py-2">Position</th>
            <th className="px-4 py-2">Driver</th>
            <th className="rounded-r-md px-4 py-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {results.map((driver, index) => {
            const teamName = driver.Constructor.name;
            const teamColor = teamColors[teamName] || "bg-gray-500";

            return (
              <tr
                key={index}
                className={`text-center font-semibold ${
                  index % 2 !== 0 ? "bg-[#1A1A24]" : "bg-[#20202D]"
                } ${
                  driver.position === "1" ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                <td
                  className={`border-l border-b border-gray-700 px-4 py-2 ${
                    index % 2 !== 0 ? "rounded-l-lg" : ""
                  }`}
                >
                  {driver.position}
                </td>
                <td
                  className={`flex items-center gap-2 px-4 py-2 relative border-b border-gray-700`}
                >
                  <div
                    style={{ backgroundColor: teamColor }}
                    className="w-[5px] h-[15px]"
                  ></div>
                  <div className="relative group">
                    <div className="cursor-default">{driver.Driver.code}</div>
                    <div className="absolute w-32 border border-gray-700 left-full top-1/2 transform -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                      {driver.Driver.givenName} {driver.Driver.familyName}
                    </div>
                  </div>
                </td>
                <td
                  className={`border-r border-b border-gray-700 px-4 py-2 ${
                    index % 2 !== 0 ? "rounded-r-lg" : ""
                  }`}
                >
                  {driver.Time
                    ? driver.Time.time
                    : driver.status &&
                      (driver.status.includes("Water pressure") ||
                        driver.status.includes("Gearbox") ||
                        driver.status.includes("Engine") ||
                        driver.status.includes("Collision") ||
                        driver.status.includes("Spun off") ||
                        driver.status.includes("Accident") ||
                        driver.status.includes("Withdrew") ||
                        driver.status.includes("Disqualified") ||
                        driver.status.includes("Overheating") ||
                        driver.status.includes("Brakes") ||
                        driver.status.includes("Power Unit") ||
                        driver.status.includes("Retired") ||
                        driver.status.includes("Radiator"))
                    ? "DNF"
                    : driver.status}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RaceResults;
