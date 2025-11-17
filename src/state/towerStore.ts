import { create } from 'zustand';
import { TOWER_CONSTANTS } from '../config/uiConstants';

export type BrickState = 'forming' | 'dropping' | 'placed';

export interface Brick {
  id: string;
  rowIndex: number;
  brickIndex: number;
  state: BrickState;
}

export interface RowCombo {
  rowIndex: number;
  multiplier: number;
}

export interface TowerState {
  currentTowerId: number;
  gold: number;
  mana: number;
  bricks: Brick[];
  rowCombos: RowCombo[];
  totalRowsBuilt: number;
  currentBrickIndex: number;
  currentRowIndex: number;
  isBuilding: boolean;
  cameraOffset: number;
  towerHeight: number;
  totalBricksPlaced: number;
  speedMultiplier: number; // Compounds by 2% per brick (starts at 1.0)
}

export interface UIState {
  activeTab: 'tower' | 'upgrades' | 'meta' | 'settings';
}

interface GameStore extends TowerState, UIState {
  setCurrentTower: (id: number) => void;
  setActiveTab: (tab: UIState['activeTab']) => void;
  addBrick: (brick: Brick) => void;
  updateBrickState: (brickId: string, state: BrickState) => void;
  advanceToNextBrick: () => void;
  panCameraUp: () => void;
  startBuilding: () => void;
  stopBuilding: () => void;
  generateRowCombo: (rowIndex: number) => void;
  sellTower: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  // Tower state
  currentTowerId: 1,
  gold: 0,
  mana: 0,
  bricks: [],
  rowCombos: [],
  totalRowsBuilt: 0,
  currentBrickIndex: 0,
  currentRowIndex: 0,
  isBuilding: false,
  cameraOffset: 0,
  towerHeight: 0,
  totalBricksPlaced: 0,
  speedMultiplier: 1.0,

  // UI state
  activeTab: 'tower',

  // Actions
  setCurrentTower: (id) => set({ currentTowerId: id }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  addBrick: (brick) =>
    set((state) => ({
      bricks: [...state.bricks, brick],
    })),

  updateBrickState: (brickId, newState) =>
    set((state) => {
      const updatedBricks = state.bricks.map((brick) =>
        brick.id === brickId ? { ...brick, state: newState } : brick
      );

      // Count placed bricks
      const placedCount = updatedBricks.filter((b) => b.state === 'placed').length;

      // Increase speed by 2% per brick placed (compounding)
      const newSpeedMultiplier = newState === 'placed' && placedCount > state.totalBricksPlaced
        ? state.speedMultiplier * 1.02
        : state.speedMultiplier;

      return {
        bricks: updatedBricks,
        totalBricksPlaced: placedCount,
        speedMultiplier: newSpeedMultiplier,
      };
    }),

  advanceToNextBrick: () =>
    set((state) => {
      const nextBrickIndex = state.currentBrickIndex + 1;
      const nextRowIndex =
        nextBrickIndex >= TOWER_CONSTANTS.bricksPerRow
          ? state.currentRowIndex + 1
          : state.currentRowIndex;
      const resetBrickIndex =
        nextBrickIndex >= TOWER_CONSTANTS.bricksPerRow ? 0 : nextBrickIndex;

      const newTotalRowsBuilt =
        nextBrickIndex >= TOWER_CONSTANTS.bricksPerRow
          ? state.totalRowsBuilt + 1
          : state.totalRowsBuilt;

      return {
        currentBrickIndex: resetBrickIndex,
        currentRowIndex: nextRowIndex,
        totalRowsBuilt: newTotalRowsBuilt,
        towerHeight: newTotalRowsBuilt,
      };
    }),

  panCameraUp: () =>
    set((state) => ({
      cameraOffset: state.cameraOffset + TOWER_CONSTANTS.brickHeight + TOWER_CONSTANTS.brickGap,
    })),

  generateRowCombo: (rowIndex) =>
    set((state) => {
      // Generate random multiplier between 1.2x and 3.0x
      const multiplier = Math.round((Math.random() * 1.8 + 1.2) * 10) / 10;
      return {
        rowCombos: [...state.rowCombos, { rowIndex, multiplier }],
      };
    }),

  startBuilding: () => set({ isBuilding: true }),
  stopBuilding: () => set({ isBuilding: false }),

  sellTower: () =>
    set((state) => {
      // Calculate tower value (combo starts at 1x base)
      const totalCombo = state.rowCombos.reduce((sum, combo) => sum + combo.multiplier, 1);
      const towerValue = state.totalBricksPlaced * totalCombo;

      // Reset tower state and add gold
      return {
        bricks: [],
        rowCombos: [],
        totalRowsBuilt: 0,
        currentBrickIndex: 0,
        currentRowIndex: 0,
        cameraOffset: 0,
        towerHeight: 0,
        totalBricksPlaced: 0,
        speedMultiplier: 1.0,
        gold: state.gold + towerValue,
      };
    }),
}));
