export const UI_CONSTANTS = {
  topBarHeight: '60px',
  bottomTabsHeight: '70px',
  tabNames: ['Tower', 'Upgrades', 'Meta', 'Settings'] as const,
};

export type TabName = (typeof UI_CONSTANTS.tabNames)[number];

export const TOWER_CONSTANTS = {
  bricksPerRow: 13,
  visibleRows: 3,
  brickWidth: 60,
  brickHeight: 40,
  brickGap: 4,

  // Animation timings (ms)
  pixelFormationDuration: 200,
  brickDropDuration: 100,
  cameraPanDuration: 300,
  delayBetweenBricks: 75,
};
