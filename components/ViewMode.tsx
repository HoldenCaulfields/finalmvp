"use client";

import { AnimatePresence, motion } from "framer-motion";
import ServicesView from "@/components/views/ServicesView";
import DriversView from "@/components/views/DriversView";
import JobsView from "@/components/views/JobsView";
import GroupsView from "@/components/views/GroupsView";
import ProfileView from "@/components/views/ProfileView";
import dynamic from "next/dynamic";
import Loading from "./Loading";

const MapView = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <Loading />,
});

type Props = {
  activeRoute: string;
};

export default function ViewMode({ activeRoute }: Props) {
  return (
    <AnimatePresence mode="wait">
      {activeRoute === "map" && (
        <motion.div key="map" className="h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <MapView />
        </motion.div>
      )}

      {activeRoute === "teams" && (
        <motion.div key="teams"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
        >
          <ServicesView />
        </motion.div>
      )}

      {activeRoute === "launched" && (
        <motion.div key="launched"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
        >
          <DriversView />
        </motion.div>
      )}

      {activeRoute === "developer" && (
        <motion.div key="developer"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
        >
          <JobsView />
        </motion.div>
      )}

      {activeRoute === "home" && (
        <motion.div key="home"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
        >
          <GroupsView />
        </motion.div>
      )}

      {activeRoute === "profile" && (
        <motion.div key="profile"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
        >
          <ProfileView />
        </motion.div>
      )}
    </AnimatePresence>
  );
}