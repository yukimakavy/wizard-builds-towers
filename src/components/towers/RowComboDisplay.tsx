import { motion } from 'framer-motion';
import { TOWER_CONSTANTS } from '../../config/uiConstants';

interface RowComboDisplayProps {
  rowIndex: number;
  multiplier: number;
}

export const RowComboDisplay = ({ rowIndex, multiplier }: RowComboDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute right-0 flex items-center justify-center"
      style={{
        bottom: rowIndex * (TOWER_CONSTANTS.brickHeight + TOWER_CONSTANTS.brickGap),
        height: TOWER_CONSTANTS.brickHeight,
        right: -60,
      }}
    >
      <div className="bg-amber-500 text-white font-bold px-3 py-1 rounded-md shadow-lg border-2 border-amber-700">
        {multiplier}x
      </div>
    </motion.div>
  );
};
