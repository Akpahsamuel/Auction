import { lazy } from "react";
import { RouteProps } from "../types";
const Home = lazy(() => import("../pages/main/Home"));

// declaration of all routes >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const routes: RouteProps[] = [
  {
    path: "/",
    label: "Home",
    component: <Home />,
    description: "Welcome to our Auction Website",
  },
];
