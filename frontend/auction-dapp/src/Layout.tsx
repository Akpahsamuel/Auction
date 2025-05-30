import Header from "./components/Header";

const Layout = ({
  children,
}: {
  children: React.ReactComponentElement<never> | React.ReactElement;
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default Layout;
