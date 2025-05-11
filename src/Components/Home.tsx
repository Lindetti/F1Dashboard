import { useAPI } from "../Context/useAPI";
import { teamColors } from "../TeamColors";
import { countrysData } from "../countrysData";
import CustomMap from "./CustomMap/CustomMap";
import PitstopChart from "./Pitstopchart/PitstopChart";
import { useEffect, useState, useRef } from "react";
import homeDriver2 from "../Images/homeDriver.png";
import Standings from "./Standings";
import Drivers from "./Drivers/Drivers";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("home");
  const dropdownRef = useRef<HTMLDivElement>(null);
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedRaceData) {
      const lat = parseFloat(selectedRaceData.Circuit.Location.lat);
      const long = parseFloat(selectedRaceData.Circuit.Location.long);
      setRaceLocation({ lat, long });
    }
  }, [selectedRace, selectedRaceData]);

  return (
    <div className="w-full md:w-4/6 min-h-screen flex flex-col gap-2 md:gap-8 mb-5 justify-center p-4 md:p-0">
      <div className="flex flex-col md:flex-row justify-between gap-4 h-auto md:h-[50px] p-4 md:p-0">
        {" "}
        <div
          onClick={() => setView("standings")}
          className="flex flex-1 cursor-pointer"
        >
          <div
            className={`border border-gray-700 text-gray-300 flex-1 rounded-md pl-4 flex gap-2 items-center cursor-pointer transition-all duration-300 ${
              view === "standings"
                ? "bg-[#8B0000] text-white"
                : "hover:bg-[#20202D] hover:text-white"
            }`}
          >
            <p className="font-semibold">View Standings</p>
            <span
              style={{ fontSize: "30px", fontWeight: "bold", color: "white" }}
            >
              &#8594;
            </span>
          </div>
        </div>
        <div
          onClick={() => setView("driver")}
          className="flex flex-1 cursor-pointer"
        >
          <div
            className={`border border-gray-700 text-gray-300 flex-1 rounded-md pl-4 flex gap-2 items-center cursor-pointer transition-all duration-300 ${
              view === "driver"
                ? "bg-[#8B0000] text-white"
                : "hover:bg-[#20202D] hover:text-white"
            }`}
          >
            <p className="font-bold">View Drivers</p>
            <span
              style={{ fontSize: "30px", fontWeight: "bold", color: "white" }}
            >
              &#8594;
            </span>
          </div>
        </div>{" "}
        {view !== "home" && (
          <div
            className="flex flex-1 cursor-pointer"
            onClick={() => setView("home")}
          >
            <div className="border border-gray-700 text-gray-300 flex-1 rounded-md pl-4 flex gap-2 items-center cursor-pointer transition-all duration-300 hover:bg-[#20202D] hover:text-white">
              <p className="font-bold">Back to Dashboard</p>
              <span
                style={{ fontSize: "30px", fontWeight: "bold", color: "white" }}
              >
                &#8594;
              </span>
            </div>
          </div>
        )}
        {view === "home" && (
          <div className="relative h-full flex-1 rounded-md" ref={dropdownRef}>
            {" "}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="border border-gray-700 text-gray-300 h-[50px] rounded-md w-full pl-4 font-semibold flex items-center justify-between cursor-pointer hover:bg-[#20202D] hover:text-white transition-all duration-300"
            >
              <p className="font-semibold">
                {races.find((race) => race.Circuit.circuitId === selectedRace)
                  ?.raceName || "No race found"}
              </p>
              <span className="text-white text-sm font-semibold pr-4">▼</span>
            </button>
            {isOpen && (
              <ul className="absolute w-full bg-[#1A1A24] text-gray-300 mt-2 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto border border-gray-700">
                {races.map((race) => {
                  const raceDate = new Date(race.date);
                  const today = new Date();
                  const isFutureRace = raceDate > today;

                  return (
                    <li
                      key={race.Circuit.circuitId}
                      className={`px-4 py-2 ${
                        isFutureRace
                          ? "text-gray-500 cursor-default"
                          : "cursor-pointer"
                      } ${
                        selectedRace === race.Circuit.circuitId
                          ? "bg-[#8B0000] text-gray-300 font-semibold"
                          : "hover:bg-[#20202D]"
                      }`}
                      onClick={() => {
                        if (!isFutureRace) {
                          setSelectedRace(race.Circuit.circuitId);
                          setIsOpen(false);
                        }
                      }}
                    >
                      <span className="font-bold">{race.round}</span> -{" "}
                      {race.raceName}{" "}
                      {isFutureRace && (
                        <span className="text-sm text-gray-400">
                          ({new Date(race.date).toLocaleDateString()})
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {view === "home" ? (
        <div className="h-auto flex flex-col md:flex-row gap-7 flex-1 text-white mt-5 md:mt-0 p-4 md:p-0">
          <div className="h-auto flex flex-col gap-3 flex-1">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex gap-2 items-center justify-center mb-2 md:hidden">
                <img
                  src={
                    countrysData[
                      selectedRaceData?.Circuit?.Location?.country || "Unknown"
                    ]
                  }
                  alt={selectedRaceData?.Circuit.Location.country}
                  className="w-10 h-8 rounded-lg"
                />
                <p className="text-2xl">
                  {selectedRaceData?.raceName || "No circuit name available"}
                </p>
              </div>
              {results.length === 0 ? (
                <p className="text-center w-full">No results yet</p>
              ) : (
                results.slice(0, 3).map((driver, index) => {
                  const teamName = driver.Constructor.name;
                  const teamColor = teamColors[teamName] || "bg-gray-500";

                  return (
                    <div
                      key={index}
                      style={{ backgroundColor: teamColor }}
                      className="font-sans relative min-h-[170px] md:h-[150px] flex-1 rounded-2xl flex flex-col justify-start items-center p-7 text-white shadow-md"
                    >
                      <p className="text-lg font-semibold">
                        {driver.Driver.givenName} {driver.Driver.familyName}
                      </p>
                      <p className="font-semibold text-2xl">
                        {driver.Constructor.name}
                      </p>
                      <div className="absolute bg-[#27272A]/50 backdrop-blur-lg w-[99%] bottom-0.5 h-[45px] rounded-2xl border border-gray-500 flex flex-col justify-center">
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
            <div className="h-auto text-white font-mono w-full p-2 rounded-2xl md:h-[40px] flex items-center mt-2 border border-gray-700 shadow-lg">
              {fastestLap ? (
                <div className="w-full flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between">
                  <h1 className="font-bold text-2xl uppercase pl-2">
                    Fastest Lap
                  </h1>
                  <div className="flex flex-col md:flex-row md:gap-10 justify-between mx-2">
                    <div className="flex gap-2 items-center">
                      <p className="text-lg text-yellow-500">
                        {fastestLap.time}
                      </p>
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

            <div className="block md:hidden mt-2">
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr className="bg-[#15151E] border border-gray-700 text-gray-300 rounded-3xl">
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
                            driver.position === "1"
                              ? "text-yellow-500"
                              : "text-gray-300"
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
                              <div className="cursor-default">
                                {driver.Driver.code}
                              </div>
                              <div className="absolute w-32 border border-gray-700 left-full top-1/2 transform -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                                {driver.Driver.givenName}{" "}
                                {driver.Driver.familyName}
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
            </div>

            <div className="mt-2 text-gray-300">
              {selectedRaceData ? (
                <div className="h-[580px[ md:h-[600px] w-full bg-[#1A1A24] flex flex-col gap-0 md:gap-4 p-0 md:p-4 rounded-lg border border-gray-700">
                  <div className="flex gap-2 items-center p-4 md:p-0 md:pl-2">
                    {countrysData[selectedRaceData.Circuit.Location.country] ? (
                      <img
                        src={
                          countrysData[
                            selectedRaceData.Circuit.Location.country
                          ]
                        }
                        alt={selectedRaceData.Circuit.Location.country}
                        className="w-10 h-7 rounded-sm hidden md:flex items-center"
                      />
                    ) : null}
                    <div className="w-full flex justify-center md:justify-start">
                      <p className="font-semibold text-lg md:text-3xl">
                        {selectedRaceData.raceName} {selectedRaceData.season}
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-[525px] flex flex-col gap-4">
                    <div className="flex w-full flex-col md:flex-row justify-start gap-2 mb-2">
                      <p className="p-1 px-3 rounded-2xl text-lg text-center">
                        | {selectedRaceData.Circuit.circuitName} |
                      </p>
                      <div className="flex justify-center">
                        <p className="bg-[#3F3F46] p-1 px-3 rounded-2xl text-lg text-white">
                          {selectedRaceData.Circuit.Location.locality},{" "}
                          {selectedRaceData.Circuit.Location.country}
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <p className="bg-[#3F3F46] font-semibold text-lg uppercase px-3 rounded-2xl text-white flex items-center">
                          {new Date(selectedRaceData.date).toLocaleDateString(
                            "en-GB",
                            { month: "long", day: "numeric" }
                          )}
                        </p>
                      </div>
                    </div>

                    {raceLocation?.lat && raceLocation?.long ? (
                      <div className="flex-1 p-2">
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
                  </div>
                </div>
              ) : (
                <p>No race selected</p>
              )}
            </div>
            <div className="flex flex-col gap-5 bg-[#1A1A24] p-4 rounded-lg border text-gray-300 border-gray-700">
              <h2 className="font-semibold text-2xl">Pitstops</h2>
              <PitstopChart selectedRaceData={selectedRaceData} />
            </div>
          </div>{" "}
          <div className="h-auto w-full md:w-[320px] flex flex-col gap-5 mb-5 md:mb-0 hidden md:flex">
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr className="bg-[#15151E] border border-gray-700 text-gray-300 rounded-3xl">
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
                          driver.position === "1"
                            ? "text-yellow-500"
                            : "text-gray-300"
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
                            <div className="cursor-default">
                              {driver.Driver.code}
                            </div>
                            <div className="absolute w-32 border border-gray-700 left-full top-1/2 transform -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                              {driver.Driver.givenName}{" "}
                              {driver.Driver.familyName}
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
            <div className="h-[320px] relative">
              <img
                className="rounded-tr-2xl rounded-br-3xl relative brightness-75"
                src={homeDriver2}
                alt="driverAI"
              />
              <div className="absolute inset-0 rounded-br-3xl bg-gradient-to-r from-transparent to-blue-500 opacity-40"></div>
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-10 text-center py-4 rounded-br-3xl">
                <div className="flex justify-center items-center gap-1">
                  <div className="bg-[#8B0000] p-1 flex items-center justify-center rounded-md h-[35px] w-[35px]">
                    <h1 className="text-white font-bold text-2xl">F1</h1>
                  </div>
                  <h1 className="text-2xl font-bold"> RaceView</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : view === "standings" ? (
        <div className="w-full p-4 md:p-0">
          <Standings />
        </div>
      ) : view === "driver" ? (
        <div className="w-full p-4 md:p-0">
          <Drivers />
        </div>
      ) : null}
    </div>
  );
};

export default Home;
