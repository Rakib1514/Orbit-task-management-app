import { Link } from "react-router";

const Home = () => {
  return (
    <div className="h-screen container mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-4">
    {/* Left Section: Text */}
    <div className="md:w-1/2">
      <h1 className="text-4xl font-bold mb-4">
        Orbit Task Management System
      </h1>
      <p className="text-lg mb-6">
        Organize, manage, and track your tasks with ease. Stay on top of your
        workload and achieve your goals.
      </p>
      <Link to={'/dashboard/to-do'}><button className="btn transition-scale flex cursor-pointer items-center gap-2 rounded-sm border border-gray-400 px-4 py-2 duration-200 hover:scale-[1.02] active:scale-100 dark:border-gray-600">
        Get Started
      </button></Link>
    </div>

    {/* Right Section: Image */}
    <div className="md:w-1/2 mt-6 md:mt-0">
      <img
        src="https://i.ibb.co.com/KjrZrV5y/475.jpg"
        alt="Orbit Task Management"
        className="w-full h-auto rounded-md shadow-lg object-cover"
      />
    </div>
  </div>
  );
};

export default Home;