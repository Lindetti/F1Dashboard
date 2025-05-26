import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
//import { TooltipItem } from "chart.js";
import { ChartOptions } from "chart.js";
import { Race } from "../../Types/Type";
import { teamColors } from "../../TeamColors";
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Hantera responsivitet med en resize-lyssnare
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!selectedRaceData) return;

    const fetchPitstopData = async () => {
      try {
        const year = new Date().getFullYear(); // Dynamiskt år
        const response = await fetch(
          `https://api.jolpi.ca/ergast/f1/${year}/${selectedRaceData.round}/pitstops.json`
        );
        const data = await response.json();

        const driverPitstops: Pitstop[] =
          data.MRData?.RaceTable?.Races?.[0]?.PitStops?.map(
            (pitstop: Pitstop) => ({
              lap: pitstop.lap,
              time: pitstop.time,
              duration: pitstop.duration,
              driverId: pitstop.driverId,
              driverName: pitstop.driverId,
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
      const color = teamColors[team] || "white";
      return color;
    }),
    fill: false,
    pointRadius: windowWidth < 768 ? 3 : 5, // Mindre punkter på mobil
    yAxisID: "y",
  };

  const chartData = {
    labels: pitstops.map((pit) => pit.time),
    datasets: [dataset],
  };

  // Konfigurera y-axlar för tid och varv
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false, // Tillåter att höjden anpassas baserat på container
    scales: {
      x: {
        type: "category",
        title: {
          display: false,
          padding: 10,
        },
        ticks: {
          color: "rgb(209 213 219)", // text-gray-300 equivalent
          font: {
            size: windowWidth < 768 ? 8 : 12, // Mindre text på mobil
          },
          maxRotation: 45, // Rotera etiketter för att spara utrymme
          minRotation: 45,
        },
        grid: {
          color: "rgb(209 213 219 / 0.1)", // Subtle grid lines
          display: windowWidth >= 768, // Dölj rutnät på mobil för renare utseende
        },
      },
      y: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Lap",
          font: {
            size: windowWidth < 768 ? 14 : 16,
            family: "'Arial', sans-serif",
            weight: "bold",
          },
          color: "rgb(209 213 219)", // text-gray-300 equivalent
        },
        ticks: {
          callback: (value) => value,
          padding: windowWidth < 768 ? 5 : 30, // Mindre padding på mobil
          font: {
            size: windowWidth < 768 ? 12 : 15,
            family: "'Arial', sans-serif",
            weight: "normal",
          },
          color: "rgb(209 213 219)", // text-gray-300 equivalent
        },
        grid: {
          color: "rgb(209 213 219 / 0.1)", // Subtle grid lines
          display: windowWidth >= 768, // Dölj rutnät på mobil för renare utseende
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        mode: "nearest",
        intersect: true,
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
      <div className="flex items-center justify-center">
        <p>Awaiting official pit stop data…</p>
      </div>
    );
  }
  return (
    <div className="pitstop-chart h-[300px] md:h-[440px] bg-[#1A1A24] text-gray-300 p-2 md:p-4 rounded-lg">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PitstopChart;
