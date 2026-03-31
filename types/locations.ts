
export type LocationType = 'planet' | 'space' | 'relay' | 'outpost';

export interface LocationDef {
  id: string;
  label: string;
  type: LocationType;
  description?: string;
}

export interface StarSystemDef {
  id: string;
  label: string;
  planets: LocationDef[];
  otherLocations: LocationDef[];
}
