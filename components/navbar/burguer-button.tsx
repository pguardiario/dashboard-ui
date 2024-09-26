import React from "react";
import { useSidebarContext } from "../layout/layout-context";
import { StyledBurgerButton } from "./navbar.styles";
import { ChevronDownIcon } from "../icons/sidebar/chevron-down-icon";

export const BurguerButton = () => {
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <ChevronDownIcon onClick={setCollapsed} className={collapsed ? "" : "-rotate-90"}/>
  );
};
