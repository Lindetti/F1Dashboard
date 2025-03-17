import { useAPI } from "../Context/useAPI";
import { teamColors } from "../TeamColors";
import CustomMap from "./CustomMap";
import PitstopChart from "./PitstopChart";
import { useEffect, useState } from "react";

const Home = () => {
  const { races, selectedRace, setSelectedRace, results, fastestLap } =
    useAPI();
  const [raceLocation, setRaceLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);

  const selectedRaceData = races.find(
    (race) => race.Circuit.circuitId === selectedRace
  );

  useEffect(() => {
    if (selectedRaceData) {
      const lat = parseFloat(selectedRaceData.Circuit.Location.lat);
      const long = parseFloat(selectedRaceData.Circuit.Location.long);
      setRaceLocation({ lat, long });
    }
  }, [selectedRace, selectedRaceData]); // Uppdatera när selectedRace eller selectedRaceData ändras

  return (
    <div className=" md:w-4/6 min-h-screen flex flex-col gap-8 mb-5">
      <div className="flex justify-between gap-4 h-[50px]">
        <div className="bg-[#27272A] flex-1 rounded-md pl-4 flex items-center text-white">
          <p className="font-bold">Standings</p>
        </div>
        <div className="relative bg-[#27272A] flex-1 rounded-md flex items-center text-white">
          <select
            className="bg-[#333] text-white h-full rounded-md w-full px-3 pr-10 font-bold cursor-pointer appearance-none"
            onChange={(e) => setSelectedRace(e.target.value)}
            value={selectedRace}
          >
            {races.map((race) => {
              const raceDate = new Date(race.date);
              const today = new Date();
              const isFutureRace = raceDate > today; // Om race-datumet är efter dagens datum

              return (
                <option
                  className={`bg-white rounded-2xl font-mono ${
                    isFutureRace ? "text-gray-500" : "text-black"
                  }`}
                  key={race.Circuit.circuitId}
                  value={race.Circuit.circuitId}
                  disabled={isFutureRace} // Inaktiverar framtida race
                >
                  {race.raceName}
                </option>
              );
            })}
          </select>

          {/* Anpassad pil-ikon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
            ▼
          </div>
        </div>
        <div className="bg-[#27272A] flex-1 rounded-md pl-4 flex items-center text-white">
          <p className="font-bold">Select session</p>
        </div>
      </div>

      <div className="flex gap-7 flex-1 text-white">
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex gap-4">
            {results.length === 0 ? (
              <p className="text-center w-full">No results yet</p>
            ) : (
              results.slice(0, 3).map((driver, index) => {
                const teamName = driver.Constructor.name;
                const teamColor = teamColors[teamName] || "bg-gray-500"; // Standardfärg om teamet saknas

                return (
                  <div
                    key={index}
                    style={{ backgroundColor: teamColor }}
                    className="font-sans relative h-[150px] w-[300px] rounded-2xl flex flex-col gap-2 justify-start items-center p-7 text-white shadow-md"
                  >
                    <p className="text-lg font-semibold">
                      {driver.Driver.givenName} {driver.Driver.familyName}
                    </p>
                    <p className="font-semibold text-2xl">
                      {driver.Constructor.name}
                    </p>
                    <div className="absolute bg-[#27272A]/50  backdrop-blur-lg w-[98%] bottom-1 h-[40px] rounded-2xl border border-gray-500 flex flex-col justify-center">
                      <div className="p-2 px-4 flex justify-between items-center text-white font-bold">
                        <p className="bg-[#27272A] backdrop-blur px-5 py-[2px] rounded-lg text-white">
                          {driver.Driver.code}
                        </p>
                        <p>P{driver.position}</p>
                        <p>{driver.Time.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 text-white font-mono w-full p-4 rounded-2xl h-[40px] flex items-center mt-2 border border-gray-400 shadow-lg">
            {fastestLap ? (
              <div className="w-full flex gap-4 items-center">
                <h1 className="font-bold text-2xl uppercase">Fastest Lap</h1>
                <div className="flex gap-5 justify-between mx-2">
                  <div className="flex gap-2 items-center">
                    <p className="text-lg">{fastestLap.time}</p>
                    <p>-</p>
                    <p className="font-bold text-lg">
                      {fastestLap.driverCode}{" "}
                    </p>
                  </div>
                  <p className="text-lg">{`Lap ${fastestLap.lap}`}</p>
                  <p className="text-lg">{`Pos: ${fastestLap.position}`}</p>
                </div>
              </div>
            ) : (
              <p>No fastest lap data</p>
            )}
          </div>

          <div className="mt-2">
            {selectedRaceData ? (
              <div className="w-full bg-gray-800 flex flex-col gap-4 p-4 rounded-lg shadow-lg">
                <div className="flex justify-between">
                  <p className="font-bold text-3xl">
                    {selectedRaceData.raceName} {selectedRaceData.season}
                  </p>
                </div>

                <div className="w-full h-[525px] flex gap-4">
                  {raceLocation?.lat && raceLocation?.long ? (
                    <div className="flex-1">
                      <CustomMap
                        key={`${raceLocation.lat}-${raceLocation.long}`}
                        lat={raceLocation.lat}
                        long={raceLocation.long}
                        zoom={14.5}
                        raceName={selectedRaceData.raceName}
                      />
                    </div>
                  ) : (
                    <p>No location available</p>
                  )}

                  <div className="flex-shrink-0 w-[300px] flex flex-col justify-start gap-4">
                    <div className="flex justify-center">
                      <p className="bg-[#3F3F46] p-1 px-3 rounded-2xl text-lg">
                        {selectedRaceData.Circuit.Location.locality},{" "}
                        {selectedRaceData.Circuit.Location.country}{" "}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <p className="bg-[#3F3F46] font-bold text-lg uppercase font-mono p-0.5 px-3 rounded-2xl">
                        {new Date(selectedRaceData.date).toLocaleDateString(
                          "en-GB",
                          { month: "long", day: "numeric" }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>No race selected</p>
            )}
          </div>
          <div className="flex flex-col gap-5 bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="font-bold text-2xl">Pitstops</h2>
            <PitstopChart selectedRaceData={selectedRaceData} />
          </div>
        </div>

        <div className=" w-[320px]">
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-[#27272A] text-gray-400 rounded-3xl">
                  <th className="rounded-l-md px-4 py-2">Position</th>
                  <th className="px-4 py-2">Driver</th>
                  <th className="rounded-r-md px-4 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {results.map((driver, index) => {
                  const teamName = driver.Constructor.name; // Får teamets namn
                  const teamColor = teamColors[teamName] || "bg-gray-500"; // Använder teamfärg eller en defaultfärg

                  return (
                    <tr
                      key={index}
                      className={`text-center font-bold ${
                        index % 2 !== 0 ? "bg-[#27272A]" : ""
                      } ${
                        driver.position === "1"
                          ? "text-yellow-500"
                          : "text-white"
                      }`}
                    >
                      <td
                        className={`px-4 py-2 ${
                          index % 2 !== 0 ? "rounded-l-lg" : ""
                        }`}
                      >
                        {driver.position}
                      </td>
                      <td
                        className={`flex items-center gap-2 px-4 py-2 ${
                          index % 2 !== 0 ? "" : ""
                        }`}
                      >
                        <div
                          style={{ backgroundColor: teamColor }}
                          className="w-[5px] h-[15px]"
                        ></div>
                        <div>{driver.Driver.code}</div>
                      </td>
                      <td
                        className={`px-4 py-2 ${
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
        </div>
      </div>
    </div>
  );
};

export default Home;
