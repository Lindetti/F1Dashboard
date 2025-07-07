import { useEffect, useState } from "react";
import { teamColors } from "../../TeamColors";
import DriverInfoDriverImage from "../../Images/driverInfoDriver.png";
import { flagData } from "../../flagData";

interface DriverInfo {
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    nationality: string;
    permanentNumber: string;
    code: string;
    url: string;
    dateOfBirth: string;
  };
  Constructors: {
    name: string;
  }[];
  position: string;
  points: string;
  wins: string;
}

interface SeasonData {
  season: string;
}

interface DriverInfoProps {
  driverId: string;
  selectedYear: number;
}

const DriverInfo = ({ driverId, selectedYear }: DriverInfoProps) => {
  const [activeSeasons, setActiveSeasons] = useState<SeasonData[]>([]);
  const [driverData, setDriverData] = useState<DriverInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    if (!driverId) return;

    const fetchDriverInfo = async () => {
      try {
        setLoading(true);
        const now = Date.now();
        const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        const cachedDriverData = localStorage.getItem(
          `driverStandings_${driverId}_${selectedYear}`
        );
        let driver = null;

        if (cachedDriverData) {
          const { data, timestamp } = JSON.parse(cachedDriverData);
          if (now - timestamp < CACHE_DURATION) {
            driver = data;
          }
        }

        if (!driver) {
          const driverResponse = await fetch(
            `https://api.jolpi.ca/ergast/f1/${selectedYear}/driverstandings.json`
          );
          const driverData = await driverResponse.json();
          driver =
            driverData.MRData.StandingsTable.StandingsLists[0].DriverStandings.find(
              (driver: DriverInfo) => driver.Driver.driverId === driverId
            );

          // Cache the driver data
          if (driver) {
            localStorage.setItem(
              `driverStandings_${driverId}_${selectedYear}`,
              JSON.stringify({ data: driver, timestamp: now })
            );
          }
        }

        if (driver) {
          setDriverData(driver);
        } else {
          setError("No data found for this driver.");
        }

        // Check cache for seasons data
        const cachedSeasonData = localStorage.getItem(
          `driverSeasons_${driverId}`
        );
        let seasonsData = null;

        if (cachedSeasonData) {
          const { data, timestamp } = JSON.parse(cachedSeasonData);
          if (now - timestamp < CACHE_DURATION) {
            seasonsData = data;
          }
        }

        if (!seasonsData) {
          const seasonResponse = await fetch(
            `https://api.jolpi.ca/ergast/f1/drivers/${driverId}/seasons.json`
          );
          const seasonData = await seasonResponse.json();
          seasonsData = seasonData.MRData.SeasonTable.Seasons;

          // Cache the seasons data
          if (seasonsData) {
            localStorage.setItem(
              `driverSeasons_${driverId}`,
              JSON.stringify({ data: seasonsData, timestamp: now })
            );
          }
        }

        if (seasonsData) {
          setActiveSeasons(seasonsData);
        } else {
          setError("No seasons data found.");
        }
      } catch (error) {
        console.error("Error fetching driver info:", error);
        setError("An error occurred while fetching the data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDriverInfo();
  }, [driverId, selectedYear]);

  if (loading) {
    return <div className="text-white p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-white p-8">{error}</div>;
  }

  if (!driverData) {
    return (
      <div className="text-white p-8">No driver information available.</div>
    );
  }

  const formatSeasons = (seasons: string[]) => {
    if (seasons.length === 0) return "No active seasons available.";

    const sortedSeasons = seasons
      .map((season) => parseInt(season, 10))
      .sort((a, b) => a - b);

    return `${sortedSeasons[0]}-${sortedSeasons[sortedSeasons.length - 1]}`;
  };

  const seasonYears = activeSeasons.map((seasonObj) => seasonObj.season);

  const teamName = driverData.Constructors[0]?.name;
  const bgColor = teamColors[teamName] || "bg-gray-500";

  return (
    <div className="w-full">
      <div className="relative shadow-lg rounded-lg rounded-bl-2xl flex justify-between h-auto md:min-h-[700px]">
        <div className="flex flex-col gap-8 flex-1 p-8 ">
          <div>
            <h1 className="font-semibold text-lg italic text-gray-300">
              Season: {selectedYear}
            </h1>
          </div>
          <div className="flex flex-col gap-5 w-full">
            {" "}
            <div
              className={`flex gap-2 items-center px-2 py-3 text-white justify-center md:justify-start rounded-lg w-full truncate`}
              style={{ backgroundColor: bgColor }}
            >
              <h1 className="font-semibold text-2xl md:text-3xl">
                {driverData.Driver.givenName} {driverData.Driver.familyName}
              </h1>
              <p className="font-bold">({driverData.Driver.code})</p>
            </div>
            <p className="font-bold text-xl md:text-2xl text-center md:text-left text-gray-400">
              {driverData.Constructors[0]?.name}
            </p>
          </div>{" "}
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            <div className="hidden md:block bg-gray-500 w-[2px]"></div>
            <div className="flex flex-col gap-1 flex-1 text-gray-400">
              <p className="text-gray-300 font-semibold">Personal info</p>{" "}
              <div className="flex justify-between items-start gap-1 md:gap-0">
                <p>Number </p>
                <p className="font-semibold">
                  {driverData.Driver.permanentNumber}
                </p>
              </div>
              <div className="flex justify-between items-start gap-1 md:gap-0">
                <p>Nationality</p>
                <div className="flex items-center">
                  {flagData[driverData.Driver.nationality] ? (
                    <img
                      src={flagData[driverData.Driver.nationality]}
                      alt={driverData.Driver.nationality}
                      className="w-5 h-3 mr-2"
                    />
                  ) : null}
                  <p className="text-gray-400 font-semibold">
                    {driverData.Driver.nationality}
                  </p>
                </div>
              </div>{" "}
              <div className="flex justify-between items-start gap-1 md:gap-0">
                <p>Age</p>
                <p className="font-semibold">
                  {driverData.Driver.dateOfBirth
                    ? calculateAge(driverData.Driver.dateOfBirth)
                    : "N/A"}
                </p>
              </div>
              <div className="flex justify-between items-start gap-1 md:gap-0">
                <p>Date of birth </p>
                <p className="font-semibold">{driverData.Driver.dateOfBirth}</p>
              </div>
            </div>
            <div className="bg-gray-500 w-[2px]"></div>
            <div className="flex flex-col gap-1 flex-1 text-gray-400">
              <p className=" font-semibold text-gray-300 ">Season stats</p>
              <div className="flex justify-between">
                <p>Championship </p>
                <p className="font-semibold text-gray-200">
                  P{driverData.position}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Points </p>
                <p className="font-semibold text-yellow-500">
                  {driverData.points}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Wins </p>
                <p className="font-semibold text-gray-200">{driverData.wins}</p>
              </div>
              <div className="flex justify-between">
                <p>Seasons active </p>
                <p className="font-semibold">
                  {seasonYears.length > 0
                    ? formatSeasons(seasonYears)
                    : "No active seasons available."}
                </p>
              </div>
            </div>{" "}
            <div className="bg-gray-500 w-[2px]"></div>
            <div className="flex flex-1 items-center w-full md:justify-center">
              <div className="flex md:flex-col w-full md:w-auto gap-2 justify-between md:justify-center items-center">
                <p className="font-semibold text-gray-300">Career</p>
                <a
                  className="underline text-blue-200"
                  href={driverData.Driver.url}
                  target="_blank"
                >
                  Wikipedia
                </a>
              </div>
            </div>
            <div className="bg-gray-500 w-[2px]"></div>
          </div>
          <div className="hidden md:block absolute left-0 bottom-0 w-[280px] h-[220px] z-0">
            <img
              className="w-full h-full object-cover rounded-tr-2xl rounded-bl-2xl relative brightness-75"
              src={DriverInfoDriverImage}
              alt="driverImage"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-500 opacity-40 rounded-tr-2xl"></div>

            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-10 text-center py-4 rounded-bl-2xl">
              <div className="flex justify-center items-center gap-1">
                <div className="bg-[#E10600] p-1 flex items-center justify-center rounded-md h-[35px]">
                  <h1 className="text-white font-bold text-2xl">F1</h1>
                </div>
                <h1 className="text-2xl font-bold text-white"> RaceView</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverInfo;
