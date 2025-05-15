import { countrysData } from "../../countrysData";
import CustomMap from "../CustomMap/CustomMap";

interface RaceInfoProps {
  selectedRaceData:
    | {
        raceName: string;
        season: string;
        date: string;
        Circuit: {
          circuitName: string;
          Location: {
            country: string;
            locality: string;
            lat: string;
            long: string;
          };
        };
      }
    | undefined;
}

const RaceInfo = ({ selectedRaceData }: RaceInfoProps) => {
  const raceLocation = selectedRaceData
    ? {
        lat: parseFloat(selectedRaceData.Circuit.Location.lat),
        long: parseFloat(selectedRaceData.Circuit.Location.long),
      }
    : null;

  if (!selectedRaceData) {
    return <p>No race selected</p>;
  }

  return (
    <div className="h-[590px] md:h-[600px] w-full bg-[#1A1A24] flex flex-col gap-0 md:gap-4 p-0 md:p-4 rounded-lg border border-gray-700">
      <div className="flex gap-2 items-center p-4 md:p-0 md:pl-2">
        {countrysData[selectedRaceData.Circuit.Location.country] ? (
          <img
            src={countrysData[selectedRaceData.Circuit.Location.country]}
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
              {new Date(selectedRaceData.date).toLocaleDateString("en-GB", {
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {raceLocation ? (
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
  );
};

export default RaceInfo;
