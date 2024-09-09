import { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from './OAuth';
import user_icon from "../../assets/person.png";
import user_password from "../../assets/password.png";
import user_email from '../../assets/email.png';
import { signUpUser } from '../../utils/api.js'; 
import './signUp.scss';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next'; // Import useTranslation

export default function SignUp() {
  const { t } = useTranslation('signUp'); // Initialize translation for signUp namespace
  const [formData, setFormData] = useState({
    email: '', 
    password: '',
    image: '', 
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const handleFileUpload = useCallback((file) => {
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      () => {
        setFileUploadError(true);
        toast.error(t('signUp.file_upload_error'));
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            image: downloadURL,
          }));
          toast.success(t('signUp.file_upload_success'));
        });
      }
    );
  }, [t]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file, handleFileUpload]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value, 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const { email, image, password } = formData;
  
      if (!email || !password) {
        setError(t('signUp.error_missing_fields'));
        setLoading(false);
        return;
      }
  
      const result = await signUpUser({ email, image, password });
  
      if (result.success) {
        toast.success(t('signUp.success'));
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userImage', image);
        setTimeout(() => {
          navigate('/sign-in');
        }, 7000); 
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(t('signUp.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='signup-container'>
      <ToastContainer />
      <div className="title">
        <h1 className='signup-title'>{t('signUp.title')}</h1>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSubmit} className='signup-form'>
        
        <div className="signup-input">
          <img src={user_email} alt="email icon" />
          <input
            type='email'
            placeholder={t('signUp.email_placeholder')}
            id='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="signup-input">
          <div className="avatar-upload-container">
            <input
              type='file'
              ref={fileRef}
              hidden
              accept='image/*'
              onChange={(e) => setFile(e.target.files[0])}
            />
            <img
              src={formData.image || user_icon}
              alt='profile'
              onClick={() => fileRef.current.click()}
              className='profile-image'
            />
            <span onClick={() => fileRef.current.click()}>
              {t('signUp.upload_photo')}
            </span>
          </div>
          <p>
            {fileUploadError ? (
              <span>{t('signUp.error_file_upload')}</span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span>{`${t('signUp.uploading')} ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span>{t('signUp.file_upload_done')}</span>
            ) : (
              ''
            )}
          </p>
        </div>        
        
        <div className="signup-input">
          <img src={user_password} alt="password icon" />
          <input
            type='password'
            placeholder={t('signUp.password_placeholder')}
            id='password'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="buttons">
          <button
            disabled={loading}
            className='signup-button'
          >
            {loading ? t('signUp.loading') : t('signUp.button')}
          </button>
        </div>
        <OAuth />
      </form>
      <div className='account-info'>
        <p>{t('signUp.account_info')}</p>
        <Link to={'/sign-in'} className='signin-link'>
          <span>{t('signUp.signin_link')}</span>
        </Link>
      </div>
      {error && <p className='signup-error'>{error}</p>}
    </div>
  );
}
