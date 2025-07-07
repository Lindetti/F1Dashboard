import { useAPI } from "../Context/useAPI";
import { flagData } from "../flagData";
interface NavbarProps {
  setView?: (view: string) => void;
}

const Navbar = ({ setView }: NavbarProps) => {
  const { races } = useAPI();

  const getNextRace = () => {
    const currentDate = new Date();
    const sortedRaces = [...races].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sortedRaces.find((race) => new Date(race.date) > currentDate);
  };

  const nextRace = getNextRace();

  const getFlagKey = (country: string): string => {
    const mapping: { [key: string]: string } = {
      "United Kingdom": "British",
      Netherlands: "Dutch",
      Australia: "Australian",
      Italy: "Italian",
      Thailand: "Thai",
      France: "French",
      Canada: "Canadian",
      Monaco: "Monegasque",
      Japan: "Japanese",
      Spain: "Spanish",
      Germany: "German",
      Brazil: "Brazilian",
      "New Zealand": "New Zealander",
      Denmark: "Danish",
      Mexico: "Mexican",
      China: "Chinese",
      "United States": "American",
      Argentina: "Argentine",
      Finland: "Finnish",
      Sweden: "Swedish",
      Poland: "Polish",
      Indonesia: "Indonesian",
      Belgium: "Belgian",
      Hungary: "Hungary",
    };
    return mapping[country] || "";
  };

  return (
    <nav className="bg-[#15151E] w-full flex items-center justify-center md:h-[100px] h-auto md:p-4 lg:p-0 ">
      <div className="w-full lg:w-4/6 flex flex-col md:flex-row justify-center md:justify-between items-center h-[200px]">
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-all"
          onClick={() => setView && setView("home")}
        >
          <div className="bg-[#8B0000] p-1 flex items-center justify-center rounded-md h-[35px] w-[35px]">
            <h1 className="text-white font-bold text-2xl">F1</h1>
          </div>
          <h1 className="text-3xl font-bold text-gray-300">RaceView</h1>
        </div>{" "}
        <div className="flex gap-4 items-center">
          <div className="items-center gap-2 hidden md:flex">
            <span className="text-gray-400">Latest race:</span>
            <span className="text-gray-300 font-semibold flex items-center gap-2">
              {(() => {
                const currentDate = new Date();

                const pastRaces = races.filter(
                  (race) => new Date(race.date) <= currentDate
                );
                const sortedPastRaces = [...pastRaces].sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                const latestRace = sortedPastRaces[0];

                if (latestRace) {
                  const flagKey = getFlagKey(
                    latestRace.Circuit.Location.country
                  );
                  const flag = flagData[flagKey] || "";
                  return (
                    <>
                      {flag && (
                        <img
                          src={flag}
                          alt={latestRace.Circuit.Location.country}
                          className="w-6 h-4 rounded"
                        />
                      )}
                      {latestRace.raceName}
                    </>
                  );
                }

                return "No latest race";
              })()}
            </span>
          </div>
          <div className="text-gray-300 hidden md:flex">|</div>
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mt-5 md:mt-0">
            {nextRace ? (
              <>
                <span className="text-gray-400">Next race:</span>
                <span className="text-gray-300 font-semibold flex items-center gap-2">
                  {(() => {
                    const flagKey = getFlagKey(
                      nextRace.Circuit.Location.country
                    );
                    const flag = flagData[flagKey] || "";
                    return (
                      <>
                        {flag && (
                          <img
                            src={flag}
                            alt={nextRace.Circuit.Location.country}
                            className="w-6 h-4 rounded"
                          />
                        )}
                        {nextRace.raceName}
                      </>
                    );
                  })()}
                </span>
                <span className="bg-[#20202D] text-blue-200 px-3 py-1 rounded-lg font-semibold border border-gray-700">
                  {new Date(nextRace.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </>
            ) : (
              <span className="text-gray-400">No upcoming races</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
