"use client"
import { useSidebarContext } from "@/components/layout/layout-context";
import JobsTable from "./JobsTable";

export default function Jobs({ initData }) {
  const { collapsed } = useSidebarContext();

  return <div className={`${collapsed ? "" : "ml-[250px]"} p-6 space-y-3`}>
    <h1>Jobs</h1>
    <hr />
    <JobsTable initData={initData}/>
  </div>
};
