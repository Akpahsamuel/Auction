import { lazy } from "react";
import { RouteProps } from "../types";

// initialization of routes >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const Home = lazy(() => import("../pages/main/Home"));
const ViewAuctions = lazy(() => import("../pages/main/auctions"));
const ViewSingleAuction = lazy(() => import("../pages/main/auctions/view"));
const CreateAuction = lazy(() => import("../pages/main/createnft"));
const NotFound = lazy(() => import("../components/not-found"));

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
    path: "/auctions/:id",
    label: "View a single auction",
    component: <ViewSingleAuction />,
  },

  {
    path: "/create",
    label: "Creae NFT",
    component: <CreateAuction />,
  },

  {
    path: "*",
    label: "Page not found",
    component: <NotFound />,
  },
];
