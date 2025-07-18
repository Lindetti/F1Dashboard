import { useAPI } from "../Context/useAPI";
import { teamColors } from "../TeamColors";
import "react-calendar/dist/Calendar.css";
import PitstopChart from "./Pitstopchart/PitstopChart";
import { useEffect, useState, useRef } from "react";
import { countrysData } from "../countrysData";
import Standings from "./Standings";
import Drivers from "./Drivers/Drivers";
import RaceInfo from "./RaceInfo/RaceInfo";
import RaceResults from "./RaceResults/RaceResults";
import StandingsBtnIcon2 from "../assets/icons/trophy2.png";
import DriversBtnIcon from "../assets/icons/drivers.png";
import RacesBtn from "../assets/icons/race.png";
import BackToDashboardBtnIcon from "../assets/icons/dashboard.png";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { LeftWave, RightWave } from "./DecorativeWaves";

interface HomeProps {
  view: string;
  setView: (view: string) => void;
}

const Home = ({ view, setView }: HomeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { races, selectedRace, setSelectedRace, results, fastestLap } =
    useAPI();

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
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [view]);

  return (
    <div className="w-full lg:w-4/6 min-h-screen flex flex-col gap-2 md:gap-8 mb-5 justify-center p-4 lg:p-0 relative">
      <LeftWave />
      <RightWave />
      <div className="flex flex-col md:flex-row justify-between gap-4 h-auto md:h-[50px] p-4 md:p-0 md:border-0 border-t border-gray-700 border-b z-10">
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
            <img src={StandingsBtnIcon2} alt="Standings" className="w-5 h-5" />
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
            <img src={DriversBtnIcon} alt="Standings" className="w-6 h-7" />
            <p className="font-semibold">View Drivers</p>
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
              <img
                src={BackToDashboardBtnIcon}
                alt="Standings"
                className="w-5 h-5"
              />
              <p className="font-semibold">Back to Dashboard</p>
              <span
                style={{
                  fontSize: "30px",
                  fontWeight: "bold",
                  color: "white",
                }}
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
              <div className="flex items-center gap-2">
                <img src={RacesBtn} alt="Standings" className="w-8 h-12" />
                <p className="font-semibold">
                  {races.find((race) => race.Circuit.circuitId === selectedRace)
                    ?.raceName || "No race found"}
                </p>
              </div>
              <span className="text-white text-sm font-semibold pr-4">▼</span>
            </button>
            {isOpen && (
              <ul className="absolute w-full bg-[#1A1A24] text-gray-300 mt-2 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto border border-gray-700">
                {races
                  .sort(
                    (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                  )
                  .map((race) => {
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
      </div>{" "}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="h-[600px] flex flex-col gap-4 items-center">
            <div className="relative flex flex-col gap-4 items-center w-full">
              <ClipLoader color="#8B0000" size={100} className="z-10" />
              <p className="text-gray-300 text-2xl font-semibold z-10">
                {view === "home"
                  ? "Preparing race insights..."
                  : view === "standings"
                  ? "Loading standings..."
                  : "Loading drivers..."}
              </p>
            </div>
          </div>
        </div>
      ) : view === "home" ? (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="h-auto flex flex-col md:flex-row gap-7 flex-1 text-white mt-5 md:mt-0 p-4 md:p-0"
        >
          <div className="h-auto flex flex-col gap-3 flex-1">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col gap-2 md:hidden items-center">
                <p className="text-gray-400">
                  {(() => {
                    const raceDate = new Date(
                      selectedRaceData?.date || Date.now()
                    );
                    const today = new Date();

                    const pastRaces = races.filter(
                      (race) => new Date(race.date) <= today
                    );

                    const sortedPastRaces = [...pastRaces].sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    );

                    const latestRace = sortedPastRaces[0];

                    const formattedDate = raceDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    });

                    if (
                      latestRace &&
                      selectedRaceData &&
                      latestRace.Circuit.circuitId ===
                        selectedRaceData.Circuit.circuitId
                    ) {
                      return `Latest race: ${formattedDate}`;
                    }

                    return raceDate < today
                      ? `Previous race: ${formattedDate}`
                      : `Upcoming race: ${formattedDate}`;
                  })()}
                </p>
                <div className="flex gap-2 items-center justify-center mb-2">
                  <img
                    src={
                      countrysData[
                        selectedRaceData?.Circuit?.Location?.country ||
                          "Unknown"
                      ]
                    }
                    alt={selectedRaceData?.Circuit.Location.country}
                    className="w-8 h-5 rounded"
                  />
                  <p className="text-lg text-gray-300 font-semibold">
                    {selectedRaceData?.raceName || "No circuit name available"}
                  </p>
                </div>
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
                      className="bg-[#1A1A24] font-sans relative min-h-[170px] md:h-[150px] flex-1 rounded-2xl flex flex-col justify-center items-center p-7 text-white shadow-md overflow-hidden border border-gray-700"
                    >
                      <div className="mb-5 flex flex-col gap-1 items-center text-gray-300">
                        <p className="text-lg font-semibold">
                          {driver.Driver.givenName} {driver.Driver.familyName}
                        </p>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-1 h-6"
                            style={{ backgroundColor: teamColor }}
                          ></div>
                          <p className="font-semibold text-2xl text-gray-300">
                            {driver.Constructor.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 absolute top-3 right-2 font-semibold bg-[#20202D] px-2 py-0.5 rounded-lg text-yellow-400 border border-gray-700">
                        <p>{driver.points}</p>
                        <p>PTS</p>
                      </div>
                      <div className="absolute top-3 left-2 flex font-bold text-lg bg-[#20202D] px-2 rounded-lg text-gray-300 border border-gray-700">
                        <p>P{driver.position}</p>
                      </div>
                      <div className="absolute bg-[#20202D] backdrop-blur-lg bottom-0 h-[45px] rounded-bl-2xl rounded-br-2xl border border-gray-700  w-[99%] flex flex-col justify-center">
                        <div className="px-2 md:px-3 flex justify-between items-center text-gray-200 font-bold">
                          <p
                            className="py-[2px] rounded-lg text-gray-700 font-bold w-[50px] text-center"
                            style={{ backgroundColor: teamColor }}
                          >
                            {driver.Driver.code}
                          </p>
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
                  </div>
                </div>
              ) : (
                <p>Fastest lap data will be available after the race</p>
              )}
            </div>{" "}
            <div className="block lg:hidden mt-2">
              <RaceResults results={results} />
            </div>
            <div className="mt-2 text-gray-300">
              <RaceInfo selectedRaceData={selectedRaceData} />
            </div>
            <div className="flex flex-col gap-5 bg-[#1A1A24] p-5 rounded-lg border text-gray-300 border-gray-700 mb-2 md:mb-5 mt-2">
              <h2 className="font-semibold text-2xl pl-1">Pitstops</h2>
              <PitstopChart selectedRaceData={selectedRaceData} />
            </div>
            <div className="bg-[#1A1A24] p-4 rounded-lg border border-gray-700 block lg:hidden">
              <h2 className="text-xl font-semibold text-gray-300 mb-4">
                Upcoming Races
              </h2>
              <div className="space-y-3">
                {races
                  .sort(
                    (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                  )
                  .filter((race) => new Date(race.date) > new Date())
                  .slice(0, 4)
                  .map((race) => (
                    <div
                      key={race.Circuit.circuitId}
                      className="flex flex-col p-3 border border-gray-700 rounded-lg hover:bg-[#20202D] transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-gray-300 font-semibold">
                          Round {race.round}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(race.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                      <p className="text-gray-300 mt-1">{race.raceName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={countrysData[race.Circuit.Location.country]}
                          alt={race.Circuit.Location.country}
                          className="w-6 h-4 rounded"
                        />
                        <p className="text-sm text-gray-400">
                          {race.Circuit.Location.country}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="h-auto w-full md:w-[320px] md:flex flex-col gap-5 mb-5 md:mb-0 hidden lg:flex">
            <RaceResults results={results} />{" "}
            <div className="bg-[#1A1A24] p-4 rounded-lg border border-gray-700 block">
              <h2 className="text-xl font-semibold text-gray-300 mb-4">
                Upcoming Races
              </h2>
              <div className="space-y-3">
                {races
                  .sort(
                    (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                  )
                  .filter((race) => new Date(race.date) > new Date())
                  .slice(0, 4)
                  .map((race) => (
                    <div
                      key={race.Circuit.circuitId}
                      className="flex flex-col p-3 border border-gray-700 rounded-lg hover:bg-[#20202D] transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-gray-300 font-semibold">
                          Round {race.round}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(race.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                      <p className="text-gray-300 mt-1">{race.raceName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={countrysData[race.Circuit.Location.country]}
                          alt={race.Circuit.Location.country}
                          className="w-6 h-4 rounded"
                        />
                        <p className="text-sm text-gray-400">
                          {race.Circuit.Location.country}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : view === "standings" ? (
        <motion.div
          key="standings"
          className="w-full p-4 md:p-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Standings />
        </motion.div>
      ) : view === "driver" ? (
        <motion.div
          key="driver"
          className="w-full p-4 md:p-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Drivers />
        </motion.div>
      ) : null}
    </div>
  );
};

export default Home;
