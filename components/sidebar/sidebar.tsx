import React from "react";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip } from "@nextui-org/react";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { DevIcon } from "../icons/sidebar/dev-icon";
import { ViewIcon } from "../icons/sidebar/view-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { useSidebarContext } from "../layout/layout-context";
import { ChangeLogIcon } from "../icons/sidebar/changelog-icon";
import { usePathname } from "next/navigation";
import { PiTireThin, PiUserCircleLight, PiKanbanThin, PiWrenchThin, PiWarehouseThin, PiInvoiceThin, PiCurrencyDollarThin } from "react-icons/pi";




export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {/* {collapsed ? "yes" : "no"} */}

      {/* {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null} */}
      <div
        className={Sidebar({
          collapsed: !collapsed,
        })}
      >
        {/* <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div> */}

        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Home"
              icon={<HomeIcon />}
              isActive={pathname === "/"}
              href="/"
            />
            <SidebarMenu title="Main Menu">
              <SidebarItem
                isActive={pathname === "/jobs"}
                title="Jobs"
                icon={<PiWrenchThin size={24}/>}
                href="/jobs"
              />

              <SidebarItem
                isActive={pathname === "/invoices"}
                title="Invoices"
                icon={<PiInvoiceThin size={24}/>}
                href="/invoices"
              />
              <SidebarItem
                isActive={pathname === "/invoices"}
                title="Customers"
                icon={<PiCurrencyDollarThin size={24}/>}
                href="/customers"
              />

              <SidebarItem
                isActive={pathname === "/diary"}
                title="Diary"
                icon={<PiKanbanThin size={24}/>}
                href="/diary"
              />
              <SidebarItem
                isActive={pathname === "/datire"}
                title="Datire"
                icon={<PaymentsIcon />}
                href="/datire"
              />
              <SidebarItem
                isActive={pathname === "reports/users"}
                title="Reports / Users"
                icon={<PiUserCircleLight size={24}/>}


                href="/reports/users"
              />
              <SidebarItem
                isActive={pathname === "reports/products"}
                title="Reports / Tyres"
                icon={<PiTireThin size={24}/>}
                href="/reports/products"
              />
              <CollapseItems
                icon={<BalanceIcon />}
                items={["Customers & Vehicles", "Invoices & Bills", "Inventory & Suppliers", "Service Schedules", "Reports", "Timesheets", "POS", "Settings", "Help"]}
                title="More"
              />
              {/* <SidebarItem
                isActive={pathname === "/customers"}
                title="Customers"
                icon={<CustomersIcon />}
              />
              <SidebarItem
                isActive={pathname === "/products"}
                title="Products"
                icon={<ProductsIcon />}
              />
              <SidebarItem
                isActive={pathname === "/reports"}
                title="Reports"
                icon={<ReportsIcon />}
              /> */}
            </SidebarMenu>

            <SidebarMenu title="General">
              <SidebarItem
                isActive={pathname === "/suppliers"}
                title="Suppliers"
                icon={<PiWarehouseThin size={24}/>}
                href="/suppliers"
              />
              {/* <SidebarItem
                isActive={pathname === "/view"}
                title="View Test Data"
                icon={<ViewIcon />}
              /> */}
              <SidebarItem
                isActive={pathname === "/settings"}
                title="Settings"
                icon={<SettingsIcon />}
              />
            </SidebarMenu>

            <SidebarMenu title="Updates">
              <SidebarItem
                isActive={pathname === "/changelog"}
                title="Changelog"
                icon={<ChangeLogIcon />}
              />
            </SidebarMenu>
          </div>
          <div className={Sidebar.Footer()}>
            <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            {/* <Tooltip content={"Adjustments"} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Profile"} color="primary">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
              />
            </Tooltip> */}
          </div>
        </div>
      </div>
    </aside>
  );
};
