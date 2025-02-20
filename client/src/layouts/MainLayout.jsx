import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar";

const MainLayout = () => {
  return (
    <div className="dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text ">
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <p>Footer</p>
    </div>
  );
};

export default MainLayout;
