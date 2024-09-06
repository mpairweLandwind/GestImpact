import { useContext } from 'react'; // Import useContext from React
import UserDetailContext from '../context/UserDetailContext';
import { toast } from 'react-toastify';

const useAuthCheck = () => {
  const { userDetails } = useContext(UserDetailContext); // Correctly use useContext to get userDetails
  const { token } = userDetails;

  const validateLogin = () => {
    if (!token) {
      // If the token is not present (user not logged in)
      toast.error('You must be logged in', { position: 'bottom-right' });
      return false;
    } else {
      return true;
    }
  };

  return { validateLogin };
};

export default useAuthCheck;
