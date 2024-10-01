import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/authReducer";
import { loadingSelector } from "../../redux/loadingReducer";
import ClipLoader from "react-spinners/ClipLoader";
import { useLocation } from "react-router-dom";

export default function AdminProtectRoute({ children }) {
  const { isLoggedIn, user } = useSelector(authSelector); // Access user details
  const { loading } = useSelector(loadingSelector);
  const location = useLocation()

  // If loading is true, show a loading spinner
  if (loading) {
    return <ClipLoader size={50} color={"#123abc"} loading={true} className="loader" />;
  }

  // If the user is not logged in, navigate to the login page
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }}  replace />;
  }

  // If the user is logged in but not an admin, navigate to a "Not Authorized" page or homepage
  if (user.role !== "admin") {
    return <Navigate to="/not-authorized" replace />;
  }

  // If the user is logged in and is an admin, render the children
  return children;
}
