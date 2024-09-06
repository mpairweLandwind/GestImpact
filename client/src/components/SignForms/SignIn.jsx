import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import user_password from "../assets/password.png";
import user_email from "../assets/email.png";
import OAuth from '../components/OAuth';
import { useUserDetailContext } from '../context/UserDetailContext';
import { signInUser } from '../../utils/api';
import './signIn.scss';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { setUserEmail, setToken } = useUserDetailContext();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use the signInUser function from api.util.js
      const data = await signInUser(formData);

      if (data.success && data.token) {
        setToken(data.token);
        setUserEmail(data.user.email);

        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', data.user.email);

        navigate('/');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (error) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='signin-container'>
      <div className="title">
        <h1 className='signin-title'>Sign In</h1>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSubmit} className='signin-form' action='#' method='POST'>
        <div className="signin-input">
          <img src={user_email} alt="" />
          <input
            type='email'
            placeholder='Email'
            id='email'
            onChange={handleChange}
            required
          />
        </div>
        <div className="signin-input">
          <img src={user_password} alt="" />
          <input
            type='password'
            placeholder='Password'
            id='password'
            onChange={handleChange}
            required
          />
        </div>
        <div className="buttons">
          <button  
            type='submit'
            disabled={loading}
            className='signin-button'
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <Link to='/sign-up'>
            <button className="signin-button">
              Sign Up
            </button>
          </Link>
        </div>
        <OAuth />
      </form>
      <div className='signin-footer'>
        <p>Forgot your password?</p>
        <Link to='/sign-up'>
          <span className='signup-link'>Reset Password</span>
        </Link>
      </div>
      {error && <p className='signin-error'>{error}</p>}
    </div>
  );
}
