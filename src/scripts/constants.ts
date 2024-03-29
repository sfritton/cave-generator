export const CANVAS_WIDTH = 2048;
export const CANVAS_HEIGHT = 1536;
export const TILE_SIZE = 64;

export const TILE_IMAGE_COORDINATES = {
  TOP_LEFT: { x: 0, y: 0 },
  TOP: { x: 1, y: 0 },
  TOP_RIGHT: { x: 2, y: 0 },
  PILLAR_BOTTOM_RIGHT: { x: 3, y: 0 },
  PILLAR_BOTTOM_LEFT: { x: 5, y: 0 },
  LEFT: { x: 0, y: 1 },
  FLOOR: { x: 1, y: 1 },
  RIGHT: { x: 2, y: 1 },
  PILLAR_TOP_RIGHT: { x: 3, y: 2 },
  PILLAR_TOP_LEFT: { x: 5, y: 2 },
  BOTTOM_LEFT: { x: 0, y: 2 },
  BOTTOM: { x: 1, y: 2 },
  BOTTOM_RIGHT: { x: 2, y: 2 },
  WALL: { x: 4, y: 1 },
  WALL_TWO: { x: 6, y: 2 },
  DIAGONAL_BL_TO_TR: { x: 6, y: 0 },
  DIAGONAL_BR_TO_TL: { x: 6, y: 1 },
} as const;

export type TileName = keyof typeof TILE_IMAGE_COORDINATES;
