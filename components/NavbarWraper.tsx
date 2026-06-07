"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  const hideRoutes = ["/cimanet"];

  if (hideRoutes.includes(pathname)) return null;

  return <Navbar />;
}