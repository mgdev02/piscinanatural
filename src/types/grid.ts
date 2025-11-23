export interface GridConfig {
  columns: number;
  rows: number;
}

export const GRID_PRESETS: Record<string, GridConfig> = {
  '2x1': { columns: 2, rows: 1 },
  '4x2': { columns: 4, rows: 2 },
  '6x3': { columns: 6, rows: 3 }
};

