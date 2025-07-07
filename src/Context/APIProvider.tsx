import { useEffect, useState } from "react";
import { APIContext } from "./APIcontext";
import { Result, RaceResponse, Race } from "../Types/Type";

// Cache duration in milliseconds (6 hours)
const CACHE_DURATION = 6 * 60 * 60 * 1000;

const getFromCache = <T,>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const { data, timestamp } = JSON.parse(item);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error reading from cache:", error);
    return null;
  }
};

const setInCache = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error("Error writing to cache:", error);
  }
};

export const APIProvider = ({ children }: { children: React.ReactNode }) => {
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRace, setSelectedRace] = useState<string>("");
  const [results, setResults] = useState<Result[]>([]);
  const [fastestLap, setFastestLap] = useState<{
    lap: string;
    time: string;
    driverCode: string;
    position: string;
    speed: string;
  } | null>(null);
  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const year = new Date().getFullYear();
        const cacheKey = `races-list-${year}`;

        // Check cache first
        const cachedRaces = getFromCache<Race[]>(cacheKey);
        if (cachedRaces) {
          setRaces(cachedRaces);

          // Set latest race from cache
          const currentDate = new Date();
          const latestRace = cachedRaces.find(
            (race) => new Date(race.date) <= currentDate
          );
          if (latestRace && !selectedRace) {
            setSelectedRace(latestRace.Circuit.circuitId);
          }
          return;
        }

        const response = await fetch(
          `https://api.jolpi.ca/ergast/f1/${year}/races.json`
        );
        const data: RaceResponse = await response.json();

        if (data.MRData.RaceTable.Races.length > 0) {
          const sortedRaces = data.MRData.RaceTable.Races.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB.getTime() - dateA.getTime();
          });

          // Cache the sorted races
          setInCache(cacheKey, sortedRaces);

          const currentDate = new Date();
          const latestRace = sortedRaces.find(
            (race) => new Date(race.date) <= currentDate
          );

          if (latestRace && !selectedRace) {
            setSelectedRace(latestRace.Circuit.circuitId);
          }

          setRaces(sortedRaces);
        }
      } catch (error) {
        console.error("Error fetching races:", error);
      }
    };

    fetchRaces();
  }, [selectedRace]); 

  useEffect(() => {
    if (!selectedRace) return;
    const fetchRaceResults = async () => {
      try {
        const year = new Date().getFullYear();
        const cacheKey = `race-results-${year}-${selectedRace}`;

        // Check cache first
        const cachedResults = getFromCache<{
          results: Result[];
          fastestLap: {
            lap: string;
            time: string;
            driverCode: string;
            position: string;
            speed: string;
          } | null;
        }>(cacheKey);

        if (cachedResults) {
          setResults(cachedResults.results);
          setFastestLap(cachedResults.fastestLap);
          return;
        }

        const response = await fetch(
          `https://api.jolpi.ca/ergast/f1/${year}/circuits/${selectedRace}/results.json`
        );
        const data: RaceResponse = await response.json();

        if (
          data.MRData.RaceTable.Races &&
          data.MRData.RaceTable.Races.length > 0
        ) {
          const selectedRaceData = data.MRData.RaceTable.Races[0];

          if (selectedRaceData?.Results) {
            const raceResults = selectedRaceData.Results;
            setResults(raceResults);

            // Extrahera fastestLap
            const fastestLapData = raceResults.find(
              (result) => result.FastestLap
            );

            const newFastestLap = fastestLapData?.FastestLap
              ? {
                  lap: fastestLapData.FastestLap.lap,
                  time: fastestLapData.FastestLap.Time.time,
                  driverCode: fastestLapData.Driver.code,
                  position: fastestLapData.position,
                  speed: fastestLapData.FastestLap.AverageSpeed?.speed || "N/A",
                }
              : null;

            setFastestLap(newFastestLap);

            // Cache both results and fastest lap
            setInCache(cacheKey, {
              results: raceResults,
              fastestLap: newFastestLap,
            });
          } else {
            setResults([]);
            setFastestLap(null);
          }
        }
      } catch (error) {
        console.error("Error fetching race results:", error);
      }
    };

    fetchRaceResults();
  }, [selectedRace]);

  return (
    <APIContext.Provider
      value={{ races, selectedRace, setSelectedRace, results, fastestLap }}
    >
      {children}
    </APIContext.Provider>
  );
};
