import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
//import { TooltipItem } from "chart.js";
import { ChartOptions } from "chart.js";
import { Race } from "../Types/Type";
import { teamColors } from "../TeamColors";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

// Registrera de nödvändiga delarna för chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

// Typ för pitstop-data
interface Pitstop {
  lap: number;
  time: string; // Format: "hh:mm:ss"
  duration: string; // Durationen för pitstoppen (t.ex. "24.878")
  driverId: string;
  driverName: string;
  constructorName?: string;
}

interface DriverStandings {
  Driver: {
    driverId: string;
  };
  Constructors: {
    name: string;
  }[];
}

const PitstopChart: React.FC<{ selectedRaceData: Race | undefined }> = ({
  selectedRaceData,
}) => {
  const [pitstops, setPitstops] = useState<Pitstop[]>([]);
  const [drivers, setDrivers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!selectedRaceData) return;

    const fetchPitstopData = async () => {
      try {
        const year = new Date().getFullYear(); // Dynamiskt år
        const response = await fetch(
          `https://api.jolpi.ca/ergast/f1/${year}/${selectedRaceData.round}/pitstops.json`
        );
        const data = await response.json();
        console.log(data);

        const driverPitstops: Pitstop[] =
          data.MRData?.RaceTable?.Races?.[0]?.PitStops?.map(
            (pitstop: Pitstop) => ({
              lap: pitstop.lap,
              time: pitstop.time,
              duration: pitstop.duration,
              driverId: pitstop.driverId,
              driverName: pitstop.driverId, // Placeholder, vi uppdaterar senare
            })
          ) || [];

        setPitstops(driverPitstops);
      } catch (error) {
        console.error("Error fetching pitstop data:", error);
      }
    };

    const fetchDriverStandingsData = async () => {
      try {
        const year = new Date().getFullYear(); // Dynamiskt år
        const response = await fetch(
          `https://api.jolpi.ca/ergast/f1/${year}/${selectedRaceData.round}/driverstandings.json`
        );
        const data = await response.json();

        const driverTeamMap: { [key: string]: string } = {};

        data.MRData.StandingsTable.StandingsLists?.[0]?.DriverStandings?.forEach(
          (driverStanding: DriverStandings) => {
            const driverId = driverStanding.Driver.driverId;
            const teamName = driverStanding.Constructors[0]?.name || "Unknown";
            driverTeamMap[driverId] = teamName;
          }
        );

        setDrivers(driverTeamMap);
      } catch (error) {
        console.error("Error fetching driver standings data:", error);
      }
    };

    fetchPitstopData();
    fetchDriverStandingsData();
  }, [selectedRaceData]);

  const dataset = {
    label: "Pitstops",
    data: pitstops.map((pitstop) => ({ x: pitstop.time, y: pitstop.lap })),
    borderColor: "gray", // Linjen är neutral (grå)
    backgroundColor: pitstops.map((pitstop) => {
      const team = drivers[pitstop.driverId] || "Unknown";
      const color = teamColors[team] || "black"; // Om team inte finns i teamColors, sätt till svart
      return color;
    }),
    fill: false,
    pointRadius: 5,
    yAxisID: "y",
  };

  // Förbered data för diagrammet
  const chartData = {
    labels: pitstops.map((pit) => pit.time),
    datasets: [dataset],
  };

  // Konfigurera y-axlar för tid och varv
  const options: ChartOptions<"line"> = {
    responsive: true,
    scales: {
      x: {
        type: "category",
        title: {
          display: false,
          padding: 10,
        },
      },
      y: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Lap", // Etiketten på vänstra y-axeln
          font: {
            size: 16, // Ändra storlek på texten
            family: "'Arial', sans-serif", // Sätt en specifik fontfamilj
            weight: "bold", // Ställ in fontvikt (t.ex. "bold", "normal")
          },
          color: "white", // Ändra färg på texten
        },
        ticks: {
          callback: (value) => value,
          padding: 30,
          font: {
            size: 15, // Ändra fontstorlek på Lap-ticksen här
            family: "'Arial', sans-serif", // Sätt en specifik fontfamilj
            weight: "normal", // Sätt fontvikt
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const rawData = context.raw as { x: string; y: number } | undefined;
            if (!rawData) return "";

            const pitstop = pitstops.find((p) => p.time === rawData.x);
            return pitstop
              ? `${pitstop.driverId} - Lap: ${pitstop.lap} (Duration: ${pitstop.duration}s)`
              : "";
          },
        },
      },
      legend: { display: false },
    },
  };
  if (pitstops.length === 0) {
    return (
      <div>
        <h2>Pitstops Chart</h2>
        <p>No pitstop data available for this race.</p>
      </div>
    );
  }

  return (
    <div className="pitstop-chart">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PitstopChart;
