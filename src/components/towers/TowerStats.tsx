import { useGameStore } from '../../state/towerStore';

export const TowerStats = () => {
  const { towerHeight, totalBricksPlaced, rowCombos, sellTower } = useGameStore();

  // Calculate total combo (sum of all multipliers, starting at 1x base)
  const totalCombo = rowCombos.reduce((sum, combo) => sum + combo.multiplier, 1);

  // Calculate tower value (bricks × total combo)
  const towerValue = Math.floor(totalBricksPlaced * totalCombo);

  return (
    <div className="w-full bg-slate-800 text-white p-3 border-b-2 border-slate-700">
      {/* Horizontal stats display */}
      <div className="flex items-center justify-between gap-4 text-sm mb-2">
        <div className="flex items-center gap-1">
          <span className="text-slate-400">Height:</span>
          <span className="font-bold">{towerHeight}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-slate-400">Bricks:</span>
          <span className="font-bold">{totalBricksPlaced}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-slate-400">Total Combo:</span>
          <span className="font-bold text-amber-400">{totalCombo.toFixed(1)}x</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-slate-300 font-semibold">Value:</span>
          <span className="font-bold text-green-400">{towerValue.toLocaleString()}</span>
        </div>
      </div>

      {/* Sell tower button */}
      <button
        onClick={sellTower}
        disabled={towerValue === 0}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Sell Tower for {towerValue.toLocaleString()} Gold
      </button>
    </div>
  );
};
