import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer";
import { Navigation } from "./components/Navigation";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Layout = ({
  children,
}: {
  children: React.ReactComponentElement<never> | React.ReactElement;
}) => {
  const pathname = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return (
    <div>
      <Navigation />
      {children}
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Layout;
