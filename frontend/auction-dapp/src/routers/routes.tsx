import { lazy } from "react";
import { RouteProps } from "../types";

// initialization of routes >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const Home = lazy(() => import("../pages/main/Home"));
const ViewAuctions = lazy(() => import("../pages/main/auctions"));
const ViewSingleAuction = lazy(() => import("../pages/main/auctions/view"));
const CreateAuction = lazy(() => import("../pages/main/createnft"));
const CollectionPage = lazy(() => import("../pages/main/collection"));
const AdminPage = lazy(() => import("../pages/main/admin"));
const AuctionHistoryPage = lazy(() => import("../pages/main/auction-history"));
const AuctionHistoryDetailPage = lazy(() => import("../pages/main/auction-history/[id]"));
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
    path: "/auction-history",
    label: "Auction History",
    component: <AuctionHistoryPage />,
  },
  {
    path: "/auction-history/:id",
    label: "Auction History Details",
    component: <AuctionHistoryDetailPage />,
  },
  {
    path: "/create",
    label: "Create Auction",
    component: <CreateAuction />,
  },
  {
    path: "/collection",
    label: "My Collection",
    component: <CollectionPage />,
  },
  {
    path: "/admin",
    label: "Admin Panel",
    component: <AdminPage />,
  },
  {
    path: "*",
    label: "Page not found",
    component: <NotFound />,
  },
];
