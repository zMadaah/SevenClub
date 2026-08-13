export interface WeeklyDistancePoint {
  weekStart: string;
  label: string;
  distanceKm: number;
}

export interface TerritoryPoint {
  month: string;
  territoryM2: number;
}

export interface ActivityHistory {
  weeklyDistance: WeeklyDistancePoint[];
  territoryOverTime: TerritoryPoint[];
  totals: {
    totalDistanceKm: number;
    totalActivities: number;
    totalCapturedM2: number;
    cellsOwned: number;
  };
  memberSince: string;
}