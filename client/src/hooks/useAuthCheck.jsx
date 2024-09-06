
import UserDetailContext from '../context/UserDetailContext';
import { toast } from 'react-toastify';

const useAuthCheck = () => {
  const { token } = UserDetailContext(); // Get token or authentication status from UserDetailContext

  const validateLogin = () => {
    if (!token) {
      // Check if the token is not present (user not logged in)
      toast.error('You must be logged in', { position: 'bottom-right' });
      return false;
    } else {
      return true;
    }
  };

  return { validateLogin };
};

export default useAuthCheck;
