import { Route, Routes } from "react-router-dom";
import { APIProvider } from "./Context/APIProvider";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import DriverStandings from "./Components/DriverStandings";
import DriverInfo from "./Components/DriverInfo";
import Footer from "./Components/Footer";

function App() {
  return (
    <APIProvider>
      <div className="bg-[#F9FAFB] min-h-screen flex flex-col gap-2 items-center">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/driverstandings" element={<DriverStandings />} />
          <Route path="/driver" element={<DriverInfo />} />
        </Routes>
        <Footer />
      </div>
    </APIProvider>
  );
}

export default App;
