"use client";
import React from "react";
import dynamic from "next/dynamic";
import { TableWrapper } from "../table/table";
import CreateJobCard from "@/components/common/createJobCard";
import { CardBalance2 } from "./card-balance2";
import { CardBalance3 } from "./card-balance3";
import { CardAgents } from "./card-agents";
import { CardTransactions } from "./card-transactions";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { useSidebarContext } from "@/components/layout/layout-context";
import JobsTable from "@/components/jobs/JobsTable"
const Chart = dynamic(
  () => import("../charts/steam").then((mod) => mod.Steam),
  {
    ssr: false,
  }
);







export const Content = () => {
  const { collapsed, setCollapsed } = useSidebarContext();


  return (
    <div className={`${collapsed ? "" : "ml-[250px]" } p-6`}>
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        <div className="mt-6 gap-6 flex flex-col w-full">
          {/* Card Section Top */}
          <div className="flex flex-col gap-2">
            {/* <h3 className="text-xl font-semibold">Available Balance</h3> */}
            <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5  justify-center w-full">
              <CreateJobCard label="New Job" isBooking={false}/>
              {/* <CardBalance2 />
              <CardBalance3 /> */}
            </div>
          </div>

          {/* Chart */}
          <div className="h-full flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Statistics</h3>
            <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6 ">
              <Chart />
            </div>
          </div>
        </div>

        {/* Left Section */}
        {/* <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
          <h3 className="text-xl font-semibold">Section</h3>
          <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">
            <CardAgents />
            <CardTransactions />
          </div>
        </div> */}
      </div>

      {/* Table Latest Users */}
      <div className="grid grid-cols-2 gap-3 p-6">
        <div className="p-6">
          <h1 className="text-xl font-bold">Jobs</h1>
          <JobsTable initData={[]} isCompact={true}/>
        </div>
        <div className="p-6">
          <h1 className="text-xl font-bold">Invoices</h1>
          <p>Coming Soon</p>
        </div>
        <div className="p-6">
          <h1 className="text-xl font-bold">Bookings</h1>
          <p>Coming Soon</p>
        </div>
        <div className="p-6">
          <h1 className="text-xl font-bold">Jobs Again</h1>
          <JobsTable initData={[]} isCompact={true}/>
        </div>

      </div>


    </div>
  )
}
