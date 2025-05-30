import { lazy } from "react";
import { RouteProps } from "../types";

// initialization of routes >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const Home = lazy(() => import("../pages/main/Home"));
const ViewAuctions = lazy(() => import("../pages/main/auctions"));
const MyBids = lazy(() => import("../pages/my-bids"));
const Profile = lazy(() => import("../pages/profile"));
const CreateNFTPage = lazy(()=> import("../pages/main/createnft/CreateNFTPage"))

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
    path: "/my-bids",
    label: "My Bids",
    component: <MyBids />,
    description: "View your active and completed bids",
  },
  {
    path: "/profile",
    label: "Profile",
    component: <Profile />,
    description: "View and manage your profile",
  },
  {
    path: "/createnft",
    label: "Creae NFT",
    component: <CreateNFTPage />,

  },
];
