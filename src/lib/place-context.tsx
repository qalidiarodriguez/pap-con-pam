import { createContext, useContext, useState, type ReactNode } from "react";
import { DEFAULT_PLACE, type Place } from "./resources";

interface PlaceState {
  place: Place;
  setPlace: (p: Place) => void;
}

const PlaceContext = createContext<PlaceState | null>(null);

export function PlaceProvider({ children }: { children: ReactNode }) {
  const [place, setPlace] = useState<Place>(DEFAULT_PLACE);
  return <PlaceContext.Provider value={{ place, setPlace }}>{children}</PlaceContext.Provider>;
}

export function usePlace(): PlaceState {
  const ctx = useContext(PlaceContext);
  if (!ctx) throw new Error("usePlace debe usarse dentro de PlaceProvider");
  return ctx;
}
