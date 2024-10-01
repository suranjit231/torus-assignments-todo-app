import { Navigate } from "react-router-dom";
import { authSelector } from "../../redux/authReducer";
import { loadingSelector } from "../../redux/loadingReducer";
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { useLocation } from "react-router-dom";

export default function ProtectUsersRoute({ children }) {
  const { isLoggedIn } = useSelector(authSelector);
  const { loading } = useSelector(loadingSelector);
  const location = useLocation()

  // If loading is true, show a loading spinner
  if (loading) {
    return <ClipLoader size={50} color={"#123abc"} loading={true} className="loader"/>;
  }

  // If user is not logged in, navigate to the login page
  return isLoggedIn ? children : <Navigate to="/login" state={{ from: location }} replace />;
}
