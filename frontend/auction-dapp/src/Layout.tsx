
import Footer from "./components/Footer";
import { Navigation } from "./components/Navigation";

const Layout = ({
  children,
}: {
  children: React.ReactComponentElement<never> | React.ReactElement;
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
