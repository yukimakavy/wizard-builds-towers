import { useGameStore } from '../../state/towerStore';

export const TopBar = () => {
  const gold = useGameStore((state) => state.gold);
  const mana = useGameStore((state) => state.mana);

  return (
    <div className="bg-slate-800 text-white px-4 py-3 flex justify-between items-center shadow-md">
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-semibold">Gold:</span>
          <span>{gold}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-semibold">Mana:</span>
          <span>{mana}</span>
        </div>
      </div>
    </div>
  );
};
