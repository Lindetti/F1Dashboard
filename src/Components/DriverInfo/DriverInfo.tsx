import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { teamColors } from "../../TeamColors";
import DriverInfoDriverImage from "../../Images/driverInfoDriver.png";

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
  // Lägg till andra fält beroende på vad du vill visa
}

interface SeasonData {
  season: string;
}

const DriverInfo = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const location = useLocation();
  const selectedYear = location.state?.selectedYear || new Date().getFullYear(); // Få selectedYear från location.state eller använd nuvarande år
  const [activeSeasons, setActiveSeasons] = useState<SeasonData[]>([]);
  const [driverData, setDriverData] = useState<DriverInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();

    // Justera om födelsedagen inte har inträffat än i år
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

        // Första fetch: Hämta driver standings information
        const driverResponse = await fetch(
          `https://api.jolpi.ca/ergast/f1/${selectedYear}/driverstandings.json`
        );
        const driverData = await driverResponse.json();

        // Filtrera listan för att hitta den förare med rätt driverId
        const driver =
          driverData.MRData.StandingsTable.StandingsLists[0].DriverStandings.find(
            (driver: DriverInfo) => driver.Driver.driverId === driverId
          );

        if (driver) {
          setDriverData(driver);
        } else {
          setError("No data found for this driver.");
        }

        // Andra fetch: Hämta säsongsdata för föraren
        const seasonResponse = await fetch(
          `https://api.jolpi.ca/ergast/f1/drivers/${driverId}/seasons.json`
        );
        const seasonData = await seasonResponse.json();

        // Visa säsonger om de finns
        if (seasonData.MRData) {
          setActiveSeasons(seasonData.MRData.SeasonTable.Seasons);
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!driverData) {
    return <div>No driver information available.</div>;
  }
  const formatSeasons = (seasons: string[]) => {
    if (seasons.length === 0) return "No active seasons available.";

    // Konvertera strängar till siffror och sortera dem i stigande ordning
    const sortedSeasons = seasons
      .map((season) => parseInt(season, 10)) // Konvertera till nummer
      .sort((a, b) => a - b);

    // Returnera i formatet "första - sista"
    return `${sortedSeasons[0]}-${sortedSeasons[sortedSeasons.length - 1]}`;
  };

  // Extrahera endast säsongsåren som en sträng-array
  const seasonYears = activeSeasons.map((seasonObj) => seasonObj.season);

  const teamName = driverData.Constructors[0]?.name; // Hämta teamnamnet
  const bgColor = teamColors[teamName] || "bg-gray-500"; // Standardfärg om team saknas

  return (
    <div className="md:w-4/6 min-h-screen">
      <div className="relative bg-white h-[750px] shadow-lg rounded-lg rounded-bl-2xl flex justify-between border border-gray-200">
        <div className="flex flex-col gap-8 flex-1 p-8">
          <div>
            <h1 className="font-semibold text-lg italic text-gray-500">
              Season: {selectedYear}
            </h1>
          </div>
          <div className="flex flex-col gap-5">
            <div
              className={`flex gap-2 items-center px-2 py-3 text-white rounded-sm`}
              style={{ backgroundColor: bgColor }}
            >
              <h1 className="font-semibold text-4xl">
                {driverData.Driver.givenName} {driverData.Driver.familyName}
              </h1>
              <p className="font-bold">({driverData.Driver.code})</p>
            </div>

            <p className="font-semibold text-2xl">
              {driverData.Constructors[0]?.name}
            </p>
          </div>
          <div className="flex gap-10">
            <div className="flex flex-col gap-1 flex-1">
              <p className=" text-gray-500 font-semibold">Personal info</p>
              <div className="flex justify-between">
                <p>Number </p>
                <p className="font-semibold">
                  {driverData.Driver.permanentNumber}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Nationality</p>
                <p className="font-semibold">{driverData.Driver.nationality}</p>
              </div>
              <div className="flex justify-between">
                <p>Age</p>
                <p className="font-semibold">
                  {driverData.Driver.dateOfBirth
                    ? calculateAge(driverData.Driver.dateOfBirth)
                    : "N/A"}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Date of birth </p>
                <p className="font-semibold">{driverData.Driver.dateOfBirth}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <p className=" text-gray-500 font-semibold">Season stats</p>
              <div className="flex justify-between">
                <p>Championship </p>
                <p className="font-semibold">P{driverData.position}</p>
              </div>
              <div className="flex justify-between">
                <p>Points </p>
                <p className="font-semibold">{driverData.points}</p>
              </div>
              <div className="flex justify-between">
                <p>Wins </p>
                <p className="font-semibold">{driverData.wins}</p>
              </div>
              <div className="flex justify-between">
                <p>Seasons active </p>
                <p className="font-semibold">
                  {seasonYears.length > 0
                    ? formatSeasons(seasonYears)
                    : "No active seasons available."}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute left-0 bottom-0 w-[280px] h-[220px] z-0">
            {/* Bilden med rundade hörn */}
            <img
              className="w-full h-full object-cover rounded-tr-2xl rounded-bl-2xl relative brightness-75"
              src={DriverInfoDriverImage}
              alt="driverImage"
            />

            {/* Skuggan som ligger ovanpå */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-500 opacity-40 rounded-tr-2xl"></div>

            {/* Texten längst ner */}
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

        <div className="flex-1 flex items-center justify-center p-4">
          <iframe
            src={driverData.Driver.url}
            className="w-full h-full "
            title="Wikipedia"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default DriverInfo;
