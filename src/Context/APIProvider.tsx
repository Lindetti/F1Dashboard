import { useEffect, useState } from "react";
import { APIContext } from "./APIcontext";
import { Result, RaceResponse, Race } from "../Types/Type";

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
        const response = await fetch(
          "https://api.jolpi.ca/ergast/f1/2025/races.json"
        );
        const data: RaceResponse = await response.json();

        if (data.MRData.RaceTable.Races.length > 0) {
          // Sortera racen efter datum i fallande ordning (nyaste först)
          const sortedRaces = data.MRData.RaceTable.Races.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB.getTime() - dateA.getTime(); // så att senaste datumet hamnar först
          });

          // Hitta det senaste genomförda racet baserat på datumet (om det är idag eller i framtiden)
          const currentDate = new Date();
          const latestRace = sortedRaces.find(
            (race) => new Date(race.date) <= currentDate
          ); // hittar senaste race innan dagens datum

          if (latestRace) {
            // Sätt det senaste genomförda racet som förvalt om selectedRace inte redan är satt
            if (!selectedRace) {
              setSelectedRace(latestRace.Circuit.circuitId); // Sätt det senaste racet
            }
          }

          // Sätt alla racen i state (för att kunna använda listan i select)
          setRaces(sortedRaces);
        }
      } catch (error) {
        console.error("Error fetching races:", error);
      }
    };

    fetchRaces();
  }, [selectedRace]); // Kör endast när selectedRace ändras// Lägg till selectedRace så att vi säkerställer att förvalda uppdateras korrekt

  useEffect(() => {
    if (!selectedRace) return;

    const fetchRaceResults = async () => {
      try {
        const response = await fetch(
          `https://api.jolpi.ca/ergast/f1/2025/circuits/${selectedRace}/results.json`
        );
        const data: RaceResponse = await response.json();

        if (
          data.MRData.RaceTable.Races &&
          data.MRData.RaceTable.Races.length > 0
        ) {
          const selectedRaceData = data.MRData.RaceTable.Races[0];

          if (selectedRaceData?.Results) {
            setResults(selectedRaceData.Results);

            // Extrahera fastestLap
            const fastestLapData = selectedRaceData.Results.find(
              (result) => result.FastestLap
            );

            if (fastestLapData?.FastestLap) {
              setFastestLap({
                lap: fastestLapData.FastestLap.lap,
                time: fastestLapData.FastestLap.Time.time,
                driverCode: fastestLapData.Driver.code,
                position: fastestLapData.position,
                speed: fastestLapData.FastestLap.AverageSpeed?.speed || "N/A",
              });
            } else {
              setFastestLap(null);
            }
          } else {
            setResults([]);
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
