import { Suspense } from "react";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import Loading from "../components/Loading";
import { routes } from "./routes";
import { RouteProps } from "../types";
import Layout from "../Layout";
const CustomRouter = () => {
  return (
    <Layout>
      <Routes>
        {routes.map(({ path, component }: RouteProps) => {
          return (
            <Route
              key={path}
              path={path}
              element={<Suspense fallback={<Loading />}>{component}</Suspense>}
            />
          );
        })}
      </Routes>
    </Layout>
  );
};

export default CustomRouter;
