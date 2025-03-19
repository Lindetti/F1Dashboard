const Footer = () => {
  return (
    <footer className="h-[280px] bg-white w-full flex flex-col gap-4  border-t">
      <div className="h-[200px] flex items-center justify-evenly">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <div className="bg-[#E10600] p-1 flex items-center justify-center rounded-md h-[35px]">
              <h1 className="text-white font-bold text-2xl">F1</h1>
            </div>
            <h1 className="text-2xl font-bold"> RaceView</h1>
          </div>
          <p className="text-gray-500">
            Powered by Ergast API. Not affiliated with Formula 1.
          </p>
        </div>
        <div className="h-full flex gap-10">
          <div className="flex flex-col gap-2 justify-center ">
            <div>
              <h1 className="font-semibold">Navigation</h1>
            </div>
            <div>
              <p>Dashboard</p>
              <p>Standings</p>
              <p>Drivers</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-center ">
            <div>
              <h1 className="font-semibold">Resources</h1>
            </div>
            <div>
              <p>Ergast API</p>
              <p>Official F1</p>
            </div>
          </div>
        </div>

        <div>
          <p>Twitter</p>
          <p>Github</p>
        </div>
      </div>
      <div className="border-t w-full flex items-center justify-center h-[70px] ">
        <p className="text-gray-500">
          © 2025 F1 RaceView. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
