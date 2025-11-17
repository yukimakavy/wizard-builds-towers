import { motion } from 'framer-motion';
import { useGameStore } from '../../state/towerStore';

type TabType = 'tower' | 'upgrades' | 'meta' | 'settings';

const tabs: { id: TabType; label: string }[] = [
  { id: 'tower', label: 'Tower' },
  { id: 'upgrades', label: 'Upgrades' },
  { id: 'meta', label: 'Meta' },
  { id: 'settings', label: 'Settings' },
];

export const BottomTabs = () => {
  const activeTab = useGameStore((state) => state.activeTab);
  const setActiveTab = useGameStore((state) => state.setActiveTab);

  return (
    <div className="bg-slate-800 border-t border-slate-700 px-2 py-2">
      <div className="flex justify-around items-center max-w-2xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative px-6 py-3 text-sm font-medium text-white transition-colors"
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-slate-700 rounded-lg"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
