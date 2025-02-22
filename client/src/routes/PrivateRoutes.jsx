import { Route, Routes } from "react-router";
import Dashboard from "../layouts/Dashboard";
import Todo from "../pages/To-Do/Todo";

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard/>}>
        <Route path="to-do" element={<Todo/>} />
      </Route>
    </Routes>
  );
};

export default PrivateRoutes;
