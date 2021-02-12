type FighterInfo = {
  _id: string,
  name: string,
  health: number,
  attack: number,
  defense: number,
  source: string
};

type ExtendedFighterInfo = FighterInfo & {
  block: boolean;
  indicatorId: string;
  currentHealth: number;
  lastComboHit: number;
  position: string;
};

type ReducedFighterInfo = {
  _id: string,
  name: string,
  source: string
};
