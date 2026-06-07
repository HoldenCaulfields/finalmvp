'use client';

import FilterBar from "@/components/FilterBar";
import BottomBar from "@/components/BottomBar";
import Loading from "@/components/Loading";
import dynamic from "next/dynamic";
import MarkerOverlay from "@/components/uioverlay/MarkerOverlay";
import Navbar from "@/components/Navbar";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <Loading />,
});

export default function App() {
  return (
    <main className="relative h-dvh flex flex-col bg-zinc-50 overflow-hidden font-sans">
      <Navbar />
      <FilterBar />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="flex-1 relative">
          <Map />
        </div>
        <BottomBar />
        <MarkerOverlay />
      </div>
    </main>
  );
}