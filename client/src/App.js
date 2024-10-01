import Navbar from "./components/navbar/Navbar";
import LoginForm from "./pages/auth/LoginForm";
import SignupForm from "./pages/auth/SignupForm";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TaskPage from "./pages/tasks/TaskPage";
import ProtectUsersRoute from "./components/protectRoute/ProtectUserRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { checkIsLoginAsync } from "./redux/authReducer";
import { useEffect } from "react";
import AddTaskForm from "./pages/taskForm/AddTask";
import AdminProtectRoute from "./components/protectRoute/AdminProtectRoute";
import EditTask from "./pages/taskForm/EditTask";
import LandingPage from "./pages/landing/LandingPage";


function App() {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(checkIsLoginAsync());

  },[dispatch]);



  const router = createBrowserRouter([
    {path:"/", element:<Navbar />, children:[

      {index:true, element:<LandingPage />},
      

      {path:"login", element:<LoginForm />},
      {path:"signup", element:<SignupForm />},

      {path:"tasks/:userId", element:<ProtectUsersRoute><TaskPage /></ProtectUsersRoute>},
      {path:"tasks/add-task", element:<AdminProtectRoute><AddTaskForm /> </AdminProtectRoute>},
      {path:"tasks/edit-task/:taskId", element:<AdminProtectRoute><EditTask /> </AdminProtectRoute>}

    ]}
  ])



  return (
    <div className="App">
        <ToastContainer className="custom-toast-container"/>
       <RouterProvider router={router} />
     
    </div>
  );
}

export default App;
