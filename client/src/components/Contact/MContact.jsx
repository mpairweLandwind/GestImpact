import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Textarea, Button, Tooltip } from '@mantine/core';
import { MdEmail } from 'react-icons/md'; // Importing email icon
import UserDetailContext from '../../context/UserDetailContext';
import useAuthCheck from '../../hooks/useAuthCheck';
import { sendEmail } from '../../utils/api';

function MContact({ maintenance }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const adminEmail = "bgbs@hotmail.fr";

  const { userDetails } = useContext(UserDetailContext);
  const { validateLogin } = useAuthCheck();

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendEmail = async () => {
    setLoading(true);
    const emailData = {
      senderEmail: userDetails.email,
      senderName: userDetails.email,
      recipientEmail: adminEmail,
      subject: `Regarding ${maintenance.name}`,
      message,
    };

    try {
      await sendEmail(emailData, userDetails.token);
      setMessage(''); // Clear the textarea input after successful submission
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <p>Loading...</p>}
      {/* {error && <p>Could not send the email. Please try again later.</p>} */}
      {adminEmail && (
        <div className="flex flex-col gap-2 w-1/2">
          <p className="primaryText text-md">
             Send Email  to GestImpact{' '}
            {/* <span className="primaryText">{maintenance.name.toLowerCase()}</span> */}
          </p>
          <Textarea
            name="message"
            id="message"
            rows="3"
            value={message}
            onChange={onChange}
            placeholder="Enter your email message here..."
            className="w-full border p-3 rounded-lg"
          />
          <br />
          <Tooltip label="Click to send email to gestimpact" withArrow>
            <Button
              onClick={handleSendEmail}
              leftIcon={<MdEmail size={20} />} // Adding email icon to the button
              className="bg-slate-700 text-white text-center p-3 uppercase rounded-md hover:opacity-95"
            >
              Send Mail Message
            </Button>
          </Tooltip>
        </div>
      )}
    </>
  );
}

MContact.propTypes = {
  maintenance: PropTypes.shape({  
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default MContact;
