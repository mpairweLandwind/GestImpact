import { useContext } from "react";
import { Navigate } from "react-router-dom"
import UserDetailContext from "../context/UserDetailContext";

const PrivateRoute = ({ element, ...rest }) => {
  const { userDetails } = useContext(UserDetailContext);

  const allowedEmail = "mpairwelauben375@gmail.com"; // Replace with the specific email you want to allow

  if (userDetails?.token && userDetails.email === allowedEmail) {
    return element;
  } else {
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;
