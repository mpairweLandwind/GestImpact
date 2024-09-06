import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useContext } from 'react';
import UserDetailContext from '../../context/UserDetailContext';
import { useNavigate } from 'react-router-dom';
import './OAuth.scss';

export default function OAuth() {
  const { setUserDetails } = useContext(UserDetailContext);
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      
      // Update user details in context
      setUserDetails({
        token: data.token,
        email: result.user.email,
        name: result.user.displayName,
        photo: result.user.photoURL,
        // You can add more details here as needed
      });

      navigate('/');
    } catch (error) {
      console.log('Could not sign in with Google', error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='google-signin-btn'
    >
      <img src="./google_logo.png" alt="Google logo" className='logo' />
      <p className='text'>Continue with Google</p>
    </button>
  );
}
