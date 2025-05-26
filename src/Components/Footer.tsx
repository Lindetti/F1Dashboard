interface FooterProps {
  setView?: (view: string) => void;
}

const Footer = ({ setView }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (view: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (setView) {
      setView(view);
    }
  };

  return (
    <footer className="min-h-[280px] bg-[#15151E] w-full flex flex-col gap-4 border-t border-gray-700 text-gray-300">
      <div className="py-8 md:py-0 md:h-[200px] flex flex-col md:flex-row items-center justify-evenly px-4 md:px-16 gap-8 md:gap-0">
        <div className="flex flex-col items-center md:items-start gap-3">
          {" "}
          <div
            className="flex items-center gap-2 hover:opacity-80 cursor-pointer transition-all"
            onClick={() => handleNavClick("home")}
          >
            <div className="bg-[#8B0000] p-1 flex items-center justify-center rounded-md h-[35px] w-[35px]">
              <h1 className="text-white font-bold text-2xl">F1</h1>
            </div>
            <h1 className="text-2xl font-bold text-gray-200">RaceView</h1>
          </div>
          <p className="text-gray-400 max-w-[250px] text-sm text-center md:text-left">
            F1 racing dashboard. Powered by{" "}
            <span className="text-blue-200 font-semibold">
              <a href="https://github.com/jolpica/jolpica-f1" target="_blank">
                jolpica-f1 API
              </a>
            </span>
            . Not affiliated with Formula 1.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex flex-col md:flex-row gap-8 md:gap-20">
            <div className="flex flex-col gap-4 items-center md:items-start">
              <h2 className="font-semibold text-gray-200 text-lg">
                Navigation
              </h2>
              <div className="flex flex-col gap-2 items-center md:items-start">
                <button
                  onClick={() => handleNavClick("home")}
                  className="hover:text-[#8B0000] transition-colors duration-200"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavClick("standings")}
                  className="hover:text-[#8B0000] transition-colors duration-200"
                >
                  Standings
                </button>
                <button
                  onClick={() => handleNavClick("driver")}
                  className="hover:text-[#8B0000] transition-colors duration-200"
                >
                  Drivers
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4 items-center md:items-start">
              <h2 className="font-semibold text-gray-200 text-lg">Resources</h2>
              <div className="flex flex-col gap-2 items-center md:items-start">
                <a
                  href="https://github.com/jolpica/jolpica-f1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#8B0000] transition-colors duration-200"
                >
                  jolpica-f1 API
                </a>
                <a
                  href="https://www.formula1.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#8B0000] transition-colors duration-200"
                >
                  Official F1
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-center md:items-start">
          <h2 className="font-semibold text-gray-200 text-lg">Social</h2>
          <div className="flex gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8B0000] transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
              </svg>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8B0000] transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48C19.137 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 w-full flex flex-col md:flex-row gap-2 items-center justify-center h-[70px] px-4 md:px-0">
        <p className="text-gray-500 text-sm text-center">
          © {currentYear} F1 RaceView. All rights reserved
        </p>
        <p className="text-gray-500 text-sm text-center hidden md:block">-</p>
        <p className="text-gray-500 text-sm text-center">
          Coded by <span className="text-blue-200">Alexander Lind</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
