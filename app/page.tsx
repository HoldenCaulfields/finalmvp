'use client';

import FilterBar from "@/components/FilterBar";
import BottomBar from "@/components/BottomBar";
import MarkerOverlay from "@/components/uioverlay/MarkerOverlay";
import Navbar from "@/components/Navbar";
import CreateMarkerModal from "@/components/map/CreateMarkerModal";
import TipLocationBar from "@/components/map/TipLocationBar";
import ViewMode from "@/components/ViewMode";
import { useViewStore } from "@/stores/useViewStore";


export default function App() {
  const activeRoute = useViewStore(s => s.activeRoute);

  return (
    <main className="relative h-dvh flex flex-col bg-zinc-50 overflow-hidden font-sans">
      <Navbar />
      <FilterBar />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="flex-1 relative overflow-y-auto h-full">
          <ViewMode activeRoute={activeRoute} />
        </div>
        <BottomBar />
        <MarkerOverlay />
        <CreateMarkerModal />
        <TipLocationBar />
      </div>
    </main>
  );
}