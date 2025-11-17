import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useGameStore } from '../../state/towerStore';
import { TOWER_CONSTANTS } from '../../config/uiConstants';
import { Brick } from './Brick';
import { RowComboDisplay } from './RowComboDisplay';
import { TowerStats } from './TowerStats';
import { RowCompletionIndicator } from './RowCompletionIndicator';

export const TowerViewport = () => {
  const {
    bricks,
    rowCombos,
    currentBrickIndex,
    currentRowIndex,
    totalRowsBuilt,
    cameraOffset,
    isBuilding,
    addBrick,
    updateBrickState,
    advanceToNextBrick,
    panCameraUp,
    startBuilding,
    generateRowCombo,
  } = useGameStore();

  // Auto-start building when component mounts
  useEffect(() => {
    if (!isBuilding && bricks.length === 0) {
      startBuilding();
    }
  }, [isBuilding, bricks.length, startBuilding]);

  // Main building loop
  useEffect(() => {
    if (!isBuilding) return;

    const brickId = `brick-${currentRowIndex}-${currentBrickIndex}`;

    // Check if this brick already exists
    const existingBrick = bricks.find((b) => b.id === brickId);
    if (existingBrick) return;

    // When we're at the start of a new row after 3 rows, wait for pan to complete
    if (currentBrickIndex === 0 && currentRowIndex > 0 && totalRowsBuilt >= TOWER_CONSTANTS.visibleRows) {
      const previousRowIndex = currentRowIndex - 1;
      const previousRowBricks = bricks.filter((b) => b.rowIndex === previousRowIndex);

      // If previous row is complete, wait a bit longer for the pan animation
      if (
        previousRowBricks.length === TOWER_CONSTANTS.bricksPerRow &&
        previousRowBricks.every((b) => b.state === 'placed')
      ) {
        const timer = setTimeout(() => {
          addBrick({
            id: brickId,
            rowIndex: currentRowIndex,
            brickIndex: currentBrickIndex,
            state: 'forming',
          });
        }, TOWER_CONSTANTS.cameraPanDuration + 100); // Wait for pan to complete

        return () => clearTimeout(timer);
      }
    }

    // Add new brick in forming state
    const timer = setTimeout(() => {
      addBrick({
        id: brickId,
        rowIndex: currentRowIndex,
        brickIndex: currentBrickIndex,
        state: 'forming',
      });
    }, TOWER_CONSTANTS.delayBetweenBricks);

    return () => clearTimeout(timer);
  }, [isBuilding, currentRowIndex, currentBrickIndex, bricks, addBrick, totalRowsBuilt]);

  // Handle tower shift down after completing each row once we have 3 rows
  useEffect(() => {
    // Only trigger when we just finished placing the last brick of a row
    if (currentBrickIndex === 0 && currentRowIndex > 0 && totalRowsBuilt >= TOWER_CONSTANTS.visibleRows) {
      // The previous row just completed
      const justCompletedRowIndex = currentRowIndex - 1;
      const completedRowBricks = bricks.filter((b) => b.rowIndex === justCompletedRowIndex);

      // Check if all bricks in that row are placed
      if (
        completedRowBricks.length === TOWER_CONSTANTS.bricksPerRow &&
        completedRowBricks.every((b) => b.state === 'placed')
      ) {
        // Shift the tower down by one row
        const timer = setTimeout(() => {
          panCameraUp();
        }, 200);

        return () => clearTimeout(timer);
      }
    }
  }, [currentBrickIndex, currentRowIndex, totalRowsBuilt, bricks, panCameraUp]);

  const handleFormationComplete = (brickId: string) => {
    updateBrickState(brickId, 'dropping');
  };

  const handleDropComplete = (brickId: string) => {
    updateBrickState(brickId, 'placed');

    // When last brick of row is placed, generate combo for that row
    const brick = bricks.find((b) => b.id === brickId);
    if (brick && brick.brickIndex === TOWER_CONSTANTS.bricksPerRow - 1) {
      const comboExists = rowCombos.find((c) => c.rowIndex === brick.rowIndex);
      if (!comboExists) {
        generateRowCombo(brick.rowIndex);
      }
    }

    advanceToNextBrick();
  };

  const viewportWidth =
    TOWER_CONSTANTS.bricksPerRow * TOWER_CONSTANTS.brickWidth +
    (TOWER_CONSTANTS.bricksPerRow - 1) * TOWER_CONSTANTS.brickGap;

  const viewportHeight =
    TOWER_CONSTANTS.visibleRows * TOWER_CONSTANTS.brickHeight +
    (TOWER_CONSTANTS.visibleRows - 1) * TOWER_CONSTANTS.brickGap;

  return (
    <div className="flex flex-col items-center h-full w-full">
      {/* Visible container extending to top of page */}
      <div className="flex-1 flex flex-col justify-end items-center w-full">
        <div
          className="relative border-4 border-slate-700 bg-slate-100/50 flex flex-col"
          style={{
            width: viewportWidth + 8,
            height: '100%',
            maxHeight: '90vh',
          }}
        >
          {/* Tower Stats display at top of container */}
          <TowerStats />
          {/* Inner viewport - clips to exactly 3 rows at bottom */}
          <div
            className="absolute bottom-0 left-1 overflow-hidden"
            style={{
              width: viewportWidth,
              height: viewportHeight,
            }}
          >
            {/* Animated container that shifts down */}
            <motion.div
              className="absolute bottom-0 left-0"
              animate={{
                y: cameraOffset,
              }}
              transition={{
                duration: TOWER_CONSTANTS.cameraPanDuration / 1000,
                ease: 'easeInOut',
              }}
              style={{
                width: viewportWidth,
                height: 2000,
              }}
            >
              {/* Render all bricks - positioned from bottom */}
              {bricks.map((brick) => (
                <Brick
                  key={brick.id}
                  brickId={brick.id}
                  rowIndex={brick.rowIndex}
                  brickIndex={brick.brickIndex}
                  state={brick.state}
                  onFormationComplete={() => handleFormationComplete(brick.id)}
                  onDropComplete={() => handleDropComplete(brick.id)}
                />
              ))}

              {/* Render combo multipliers for each row */}
              {rowCombos.map((combo) => (
                <RowComboDisplay
                  key={`combo-${combo.rowIndex}`}
                  rowIndex={combo.rowIndex}
                  multiplier={combo.multiplier}
                />
              ))}

              {/* Render row completion indicators */}
              {rowCombos.map((combo) => {
                const rowBricks = bricks.filter((b) => b.rowIndex === combo.rowIndex);
                const isRowComplete =
                  rowBricks.length === TOWER_CONSTANTS.bricksPerRow &&
                  rowBricks.every((b) => b.state === 'placed');

                if (!isRowComplete) return null;

                return (
                  <RowCompletionIndicator
                    key={`completion-${combo.rowIndex}`}
                    rowIndex={combo.rowIndex}
                    multiplier={combo.multiplier}
                  />
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
