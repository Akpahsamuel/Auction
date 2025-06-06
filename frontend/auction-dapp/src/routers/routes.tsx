import { lazy } from "react";
import { RouteProps } from "../types";

// initialization of routes >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const Home = lazy(() => import("../pages/main/Home"));
const ViewAuctions = lazy(() => import("../pages/main/auctions"));
const CreateAuction = lazy(() => import("../pages/main/createnft"));

// declaration of all routes >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const routes: RouteProps[] = [
  {
    path: "/",
    label: "Home",
    component: <Home />,
    description: "Welcome to our Auction Website",
  },
  {
    path: "/auctions",
    label: "View all Auctions",
    component: <ViewAuctions />,
  },

  {
    path: "/create",
    label: "Creae NFT",
    component: <CreateAuction />,
  },
];
