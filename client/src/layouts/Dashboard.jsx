import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar";

const Dashboard = () => {
  return (
    <div className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text min-h-screen ">
      <Navbar/>
      <Outlet/>
    </div>
  );
};

export default Dashboard;