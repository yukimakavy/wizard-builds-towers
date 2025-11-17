import { TopBar } from './components/layout/TopBar';
import { BottomTabs } from './components/layout/BottomTabs';
import { TowerScreen } from './components/towers/TowerScreen';
import { useGameStore } from './state/towerStore';

function App() {
  const activeTab = useGameStore((state) => state.activeTab);

  const renderMainContent = () => {
    switch (activeTab) {
      case 'tower':
        return <TowerScreen />;
      case 'upgrades':
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-600 text-xl">Upgrades coming soon...</p>
          </div>
        );
      case 'meta':
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-600 text-xl">Meta progression coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-600 text-xl">Settings coming soon...</p>
          </div>
        );
      default:
        return <TowerScreen />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <TopBar />
      <main className="flex-1 overflow-y-auto">{renderMainContent()}</main>
      <BottomTabs />
    </div>
  );
}

export default App;
