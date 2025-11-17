import { motion } from 'framer-motion';
import { TOWER_CONSTANTS } from '../../config/uiConstants';

interface RowCompletionIndicatorProps {
  rowIndex: number;
  multiplier: number;
}

export const RowCompletionIndicator = ({ rowIndex, multiplier }: RowCompletionIndicatorProps) => {
  const rowY = rowIndex * (TOWER_CONSTANTS.brickHeight + TOWER_CONSTANTS.brickGap);

  // Calculate center brick position (brick 6 in 0-indexed array of 13 bricks)
  const centralBrickIndex = Math.floor(TOWER_CONSTANTS.bricksPerRow / 2);
  const brickLeft = centralBrickIndex * (TOWER_CONSTANTS.brickWidth + TOWER_CONSTANTS.brickGap);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, type: 'spring', bounce: 0.5 }}
      className="absolute pointer-events-none flex items-center justify-center"
      style={{
        bottom: rowY,
        left: brickLeft,
        width: TOWER_CONSTANTS.brickWidth,
        height: TOWER_CONSTANTS.brickHeight,
      }}
    >
      <div className="bg-yellow-400 text-slate-900 font-bold px-3 py-1 rounded-full shadow-lg border-2 border-yellow-600 text-sm">
        {multiplier.toFixed(1)}x
      </div>
    </motion.div>
  );
};
