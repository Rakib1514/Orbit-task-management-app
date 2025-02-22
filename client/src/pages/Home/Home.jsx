import { Link } from "react-router";

const Home = () => {
  return (
    <div>
      <p>Home component</p>
      <Link to={'/dashboard/to-do'}><button className="py-2 px-4 border border-gray-600 cursor-pointer hover:scale-[1.02] active:scale-100">Get Started</button></Link>
    </div>
  );
};

export default Home;