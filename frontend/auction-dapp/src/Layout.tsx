import { Navigation } from "./components/Navigation";

const Layout = ({
  children,
}: {
  children: React.ReactComponentElement<never> | React.ReactElement;
}) => {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  );
};

export default Layout;
