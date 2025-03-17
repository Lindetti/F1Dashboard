import { useContext } from "react";
import { APIContext } from "./APIcontext";

export const useAPI = () => {
  const context = useContext(APIContext);
  if (!context) {
    throw new Error("useAPI must be used within an APIProvider");
  }
  return context;
};
