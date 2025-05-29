import { lazy } from "react";
import { RouteProps } from "../types";
import CreateNFTPage from "../pages/main/createnft/CreateNFTPage";

// initialization of routes >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const Home = lazy(() => import("../pages/main/Home"));
const ViewAuctions = lazy(() => import("../pages/main/auctions"));

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
    path: "/createnft",
    label: "Creae NFT",
    component: <CreateNFTPage />,
  },
];
