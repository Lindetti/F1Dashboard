import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { TooltipItem } from "chart.js";
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
      const response = await fetch(
        `https://api.jolpi.ca/ergast/f1/2025/${selectedRaceData.round}/pitstops.json`
      );
      const data = await response.json();

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
    };

    const fetchDriverStandingsData = async () => {
      const response = await fetch(
        `https://api.jolpi.ca/ergast/f1/2025/${selectedRaceData.round}/driverstandings.json`
      );
      const data = await response.json();

      const driverTeamMap: { [key: string]: string } = {};

      data.MRData.StandingsTable.StandingsLists[0].DriverStandings.forEach(
        (driverStanding: DriverStandings) => {
          const driverId = driverStanding.Driver.driverId;
          const teamName = driverStanding.Constructors[0]?.name;
          driverTeamMap[driverId] = teamName;
        }
      );

      setDrivers(driverTeamMap);
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
    yAxisID: "y1",
  };

  // Förbered data för diagrammet
  const chartData = {
    labels: pitstops.map((pit) => pit.time),
    datasets: [dataset],
  };

  // Konfigurera y-axlar för tid och varv
  const options = {
    scales: {
      x: {
        type: "category", // Här använder vi kategorisk typ för x-axeln (tid)
        title: {
          display: true,
          text: "Time", // Tid på x-axeln
        },
      },
      y1: {
        type: "linear",
        position: "left",
        ticks: {
          beginAtZero: true,
        },
        title: {
          display: true,
          text: "Lap", // Varv på vänster y-axel
        },
      },
    },
    // Tooltip options för att visa duration på hover
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            const rawData = context.raw as { x: string; y: number } | undefined;

            if (!rawData) return "";

            const pitstop = pitstops.find((p) => p.time === rawData.x);
            return pitstop
              ? `${pitstop.driverId} - Lap: ${pitstop.lap} (Duration: ${pitstop.duration}s)`
              : "";
          },
        },
      },
      legend: { display: false }, // Ingen legend
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
