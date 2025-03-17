export interface APIContextType {
  races: Race[];
  selectedRace: string;
  setSelectedRace: (circuitId: string) => void;
  results: Result[];
  fastestLap: {
    lap: string;
    time: string;
    driverCode: string;
    position: string;
    speed: string;
  } | null;
}

interface FastestLap {
  lap: string;
  Time: {
    time: string;
  };
}

export type Driver = {
  givenName: string;
  familyName: string;
  nationality: string;
  code: string;
  FastestLap?: FastestLap;
};

export type Result = {
  position: string;
  Driver: Driver;
  status: string;
  raceName: string;
  nationality: string;
  Circuit: {
    circuitId: string;
    Location: {
      country: string;
      locality: string;
      long: string;
      lat: string;
    };
    url: string;
  };
  FastestLap: {
    AverageSpeed: {
      speed: string;
    };
    lap: string;
    Time: {
      time: string;
    };
  };
  Constructor: {
    name: string;
  };
  Time: {
    time: string;
  };
};

export type Race = {
  season: string;
  round: string;
  raceName: string;
  date: string;
  raceId: string;
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location: {
      country: string;
      locality: string;
      long: string;
      lat: string;
    };
    url: string;
  };
  Results: Result[];
};

export type RaceResponse = {
  MRData: {
    RaceTable: {
      Races: Race[];
    };
  };
};
