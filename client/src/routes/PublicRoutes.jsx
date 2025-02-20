import { Route, Routes } from "react-router";
import MainLayout from "../layouts/MainLayout";


const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout/>} >
        <Route index element={<h1>Home</h1>} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;