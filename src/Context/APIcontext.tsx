import { createContext } from "react";
import { APIContextType } from "../Types/Type";

export const APIContext = createContext<APIContextType | undefined>(undefined);
