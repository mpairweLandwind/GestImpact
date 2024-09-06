import { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from './OAuth';
import user_icon from "../../assets/person.png";
import user_password from "../../assets/password.png";
import user_email from '../../assets/email.png';
import { signUpUser } from '../../utils/api.js';  // Import the API utility
import './signUp.scss';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';

// Importing react-toastify components
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: '', // Ensure email field is initialized
    password: '',
    image: '',  // Default image value
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
        toast.error('Error uploading image!');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            image: downloadURL,  // Change from 'avatar' to 'image'
          }));
          toast.success('Image uploaded successfully!');
        });
      }
    );
  }, []);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file, handleFileUpload]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value, // Update the state with the input value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Only send email, image, and password to the API
      const { email, image, password } = formData;
  
      if (!email || !password) {
        setError('Email and password are required');
        setLoading(false);
        return;
      }
  
      const result = await signUpUser({ email, image, password });
  
      if (result.success) {
        toast.success("Sign up successful! Redirecting to sign-in...");
           // Store in localStorage
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userImage', image);
        // Delay navigation by 7 seconds
        setTimeout(() => {
          navigate('/sign-in');
        }, 7000); // 7000 milliseconds = 7 seconds
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className='signup-container'>
      <ToastContainer /> {/* This is where the toast will appear */}
      <div className="title">
        <h1 className='signup-title'>Sign Up</h1>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSubmit} className='signup-form'>
        
        <div className="signup-input">
          <img src={user_email} alt="email icon" />
          <input
            type='email'
            placeholder='Email'
            id='email'
            value={formData.email} // Ensure email is controlled
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
              src={formData.image || user_icon} // Use 'image' or default icon
              alt='profile'
              onClick={() => fileRef.current.click()}
              className='profile-image'
            />
            <span className='text-slate-700 cursor-pointer' onClick={() => fileRef.current.click()}>
              Upload Photo
            </span>
          </div>
          <p className='text-sm self-center'>
            {fileUploadError ? (
              <span className='text-red-700'>Error Image upload (image must be less than 2 MB)</span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-green-200'> image uploaded</span>
            ) : (
              ''
            )}
          </p>
        </div>        
        
        <div className="signup-input">
          <img src={user_password} alt="password icon" />
          <input
            type='password'
            placeholder='Password'
            id='password'
            value={formData.password} // Ensure password is controlled
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="buttons">
          <button
            disabled={loading}
            className='signup-button'
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </div>
        <OAuth />
      </form>
      <div className='account-info'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='signin-link'>Sign in</span>
        </Link>
      </div>
      {error && <p className='signup-error'>{error}</p>}
    </div>
  );
}
