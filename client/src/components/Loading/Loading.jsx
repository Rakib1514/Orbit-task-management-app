import Navbar from "../Navbar/Navbar";


const Loading = () => {
  return (
    <div className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text min-h-screen">
    <Navbar />
    <div className="flex justify-center items-center ">
      <p className="text-3xl font-semibold">Loading</p>
    </div>
</div>
  );
};

export default Loading;