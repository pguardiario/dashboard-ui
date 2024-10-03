"use client"
import { useSidebarContext } from "@/components/layout/layout-context";

export default function Wrapper({children}) {
  const { collapsed, setCollapsed } = useSidebarContext();

  return <div className={`${collapsed ? "" : "ml-[250px]"} p-6 space-y-3`}>
    {children}
  </div>
};
