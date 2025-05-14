import { useAPI } from "../Context/useAPI";
interface NavbarProps {
  setView?: (view: string) => void;
}

const Navbar = ({ setView }: NavbarProps) => {
  const { races } = useAPI();

  const getNextRace = () => {
    const currentDate = new Date();
    // Sortera racen efter datum och hitta nästa race
    const sortedRaces = [...races].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sortedRaces.find((race) => new Date(race.date) > currentDate);
  };

  const nextRace = getNextRace();

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
        <div className="flex flex-col md:flex-row items-center gap-2 m:gap-3 mt-5 md:mt-0s">
          {nextRace ? (
            <>
              <span className="text-gray-400">Next race:</span>
              <span className="text-gray-300 font-semibold">
                {nextRace.raceName}
              </span>
              <span className="bg-[#20202D] text-gray-300 px-3 py-1 rounded-md font-semibold">
                {new Date(nextRace.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </>
          ) : (
            <span className="text-gray-400">No upcoming races</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
