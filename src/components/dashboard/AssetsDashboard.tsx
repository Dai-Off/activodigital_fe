import { Fragment } from "react";
import { Outlet } from "react-router-dom";

export function AssetsDashboard() {
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
}
