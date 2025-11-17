import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TOWER_CONSTANTS } from '../../config/uiConstants';
import type { BrickState } from '../../state/towerStore';

interface BrickProps {
  brickId?: string;
  rowIndex: number;
  brickIndex: number;
  state: BrickState;
  speedMultiplier: number;
  cameraOffset: number;
  brickScale: number;
  onFormationComplete: () => void;
  onDropComplete: () => void;
}

export const Brick = ({
  rowIndex,
  brickIndex,
  state,
  speedMultiplier,
  cameraOffset,
  brickScale,
  onFormationComplete,
  onDropComplete,
}: BrickProps) => {
  const [formationProgress, setFormationProgress] = useState(0);

  // Pixel-by-pixel formation animation (with speed multiplier)
  useEffect(() => {
    if (state === 'forming') {
      const startTime = Date.now();
      const duration = TOWER_CONSTANTS.pixelFormationDuration * speedMultiplier;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setFormationProgress(progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          onFormationComplete();
        }
      };

      requestAnimationFrame(animate);
    }
  }, [state, speedMultiplier, onFormationComplete]);

  // Calculate which row is at the bottom of the viewport based on camera offset
  const unscaledRowHeight = TOWER_CONSTANTS.brickHeight + TOWER_CONSTANTS.brickGap;
  const visibleBottomRow = Math.round(cameraOffset / unscaledRowHeight);

  // Always form at the 5th row position in the viewport (4 rows above visible bottom)
  const formationRowIndex = visibleBottomRow + 4;
  const dropDistance = (formationRowIndex - rowIndex) * unscaledRowHeight * brickScale;

  // Colors for visual variety
  const brickColors = [
    'bg-amber-600',
    'bg-amber-700',
    'bg-orange-700',
    'bg-red-800',
    'bg-amber-800',
  ];
  const colorIndex = (rowIndex + brickIndex) % brickColors.length;
  const brickColor = brickColors[colorIndex];

  return (
    <div
      className="absolute"
      style={{
        width: TOWER_CONSTANTS.brickWidth * brickScale,
        height: TOWER_CONSTANTS.brickHeight * brickScale,
        left: brickIndex * (TOWER_CONSTANTS.brickWidth + TOWER_CONSTANTS.brickGap) * brickScale,
        bottom: rowIndex * (TOWER_CONSTANTS.brickHeight + TOWER_CONSTANTS.brickGap) * brickScale,
      }}
    >
      {/* Forming state: pixel-by-pixel reveal */}
      {state === 'forming' && (
        <div
          className={`${brickColor} border-2 border-amber-900 rounded-sm`}
          style={{
            width: '100%',
            height: '100%',
            clipPath: `inset(${100 - formationProgress * 100}% 0 0 0)`,
            transform: `translateY(-${dropDistance}px)`,
          }}
        />
      )}

      {/* Dropping state: animated fall (constant speed) */}
      {state === 'dropping' && (
        <motion.div
          className={`${brickColor} border-2 border-amber-900 rounded-sm`}
          style={{
            width: '100%',
            height: '100%',
          }}
          initial={{ y: -dropDistance }}
          animate={{ y: 0 }}
          transition={{
            duration: TOWER_CONSTANTS.brickDropDuration / 1000,
            ease: 'easeOut',
          }}
          onAnimationComplete={onDropComplete}
        />
      )}

      {/* Placed state: static brick */}
      {state === 'placed' && (
        <div
          className={`${brickColor} border-2 border-amber-900 rounded-sm`}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      )}
    </div>
  );
};
