import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import user_password from "../../assets/password.png";
import user_email from '../../assets/email.png';
import UserDetailContext from '../../context/UserDetailContext.js'; 
import { signInUser } from '../../utils/api.js';
import './signIn.scss';
import { useTranslation } from 'react-i18next'; // Import useTranslation

export default function SignIn() {
  const { t } = useTranslation('signIn'); // Initialize translation for signIn namespace
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUserDetails } = useContext(UserDetailContext); 

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
      const data = await signInUser(formData);

      if (data.success && data.token) {
        setUserDetails({
          token: data.token,
          email: data.user.email,
          image: data.user.image,
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userImage', data.user.image);
        navigate('/');
      } else {
        setError(data.message || t('signIn.error'));
      }
    } catch (error) {
      setError(error.message || t('signIn.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='signin-container'>
      <div className="title">
        <h1 className='signin-title'>{t('signIn.title')}</h1>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSubmit} className='signin-form' action='#' method='POST'>
        <div className="signin-input">
          <img src={user_email} alt="" />
          <input
            type='email'
            placeholder={t('signIn.email_placeholder')}
            id='email'
            onChange={handleChange}
            required
          />
        </div>
        <div className="signin-input">
          <img src={user_password} alt="" />
          <input
            type='password'
            placeholder={t('signIn.password_placeholder')}
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
            {loading ? t('signIn.loading') : t('signIn.button')}
          </button>
          <Link to='/sign-up'>
            <button className="signin-button">
              {t('signIn.signup_link')}
            </button>
          </Link>
        </div>
      </form>
      {error && <p className='signin-error'>{error}</p>}
    </div>
  );
}
