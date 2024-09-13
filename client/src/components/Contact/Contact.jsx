import "./Contact.css";
import { MdCall, MdEmail } from "react-icons/md"; // Import email icon
import { BsFillChatDotsFill } from "react-icons/bs";
import { HiChatBubbleBottomCenter } from 'react-icons/hi2';
import PropTypes from "prop-types";

const Contact = ({ t, contactRef }) => {

  // WhatsApp Business API link format
  const phoneNumber = "+25779935796"; // Example phone number without spaces
  const whatsappBaseUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}`;

  return (
    <div id="contact-us" className="c-wrapper " ref={contactRef}>
      <div className="paddings innerWidth flexCenter c-container">
        {/* left side */}
        <div className="flexColStart c-left">
          <span className="orangeText">{t('home.contact.our_contact_us')}</span>
          <span className="primaryText">{t('home.contact.easy_to_contact_us')}</span>
          <span className="secondaryText">
            {t('home.contact.ready_to_help')}<br />
            {t('home.contact.good_place_better_life')}
          </span>

          <div className="flexColStart contactModes">
            {/* first row */}
            <div className="flexStart row">
              <div className="flexColCenter mode">
                <div className="flexStart">
                  <div className="flexCenter icon">
                    <MdCall size={25} />
                  </div>
                  <div className="flexColStart detail">
                    <span className="primaryText">{t('home.contact.call')}</span>

                    <span className="secondaryText"> {phoneNumber}</span>
                  </div>
                </div>
                <a href={`${whatsappBaseUrl}&text=${t('home.contact.call_now')}`} className="flexCenter button">
                  {t('home.contact.call_now')}
                </a>
              </div>

              <div className="flexColCenter mode">
                <div className="flexStart">
                  <div className="flexCenter icon">
                    <BsFillChatDotsFill size={25} />
                  </div>
                  <div className="flexColStart detail">
                    <span className="primaryText">{t('home.contact.chat')}</span>
                    <span className="secondaryText">{phoneNumber}</span>
                  </div>
                </div>
                <a href={`${whatsappBaseUrl}&text=${t('home.contact.chat_now')}`} className="flexCenter button">
                  {t('home.contact.chat_now')}
                </a>
              </div>
            </div>

            {/* second row */}
            <div className="flexStart row">
              <div className="flexColCenter mode">
                <div className="flexStart">
                  <div className="flexCenter icon">
                    <BsFillChatDotsFill size={25} />
                  </div>
                  <div className="flexColStart detail">
                    <span className="primaryText">{t('home.contact.video_call')}</span>
                    <span className="secondaryText">{phoneNumber}</span>
                  </div>
                </div>
                <a href={`${whatsappBaseUrl}&text=${t('home.contact.video_call_now')}`} className="flexCenter button">
                  {t('home.contact.video_call_now')}
                </a>
              </div>

              <div className="flexColCenter mode">
                <div className="flexStart">
                  <div className="flexCenter icon">
                    <HiChatBubbleBottomCenter size={25} />
                  </div>
                  <div className="flexColStart detail">
                    <span className="primaryText">{t('home.contact.message')}</span>
                    <span className="secondaryText">{phoneNumber}</span>
                  </div>
                </div>
                <a href={`${whatsappBaseUrl}&text=${t('home.contact.message_now')}`} className="flexCenter button">
                  {t('home.contact.message_now')}
                </a>
              </div>
            </div>
          </div>

          {/* Email Section */}
          <div className="flexColCenter mode email-section">
            <div className="flexStart">
              <div className="flexCenter icon">
                <MdEmail size={25} />
              </div>
              <div className="flexColStart detail">
                <span className="primaryText">{t('home.contact.email')}</span>
                <span className="secondaryText">bgbs@hotmail.fr</span>
              </div>
            </div>
            <span className="flexCenter button">
              {t('home.contact.email_now')}
            </span>
          </div>

        </div>

        {/* right side */}
        <div className="flexEnd c-right">
          <div className="image-container">
            <img src="./contact.jpg" alt="Contact us" />
          </div>
        </div>
      </div>
    </div>
  );
};

Contact.propTypes = {
  t: PropTypes.func.isRequired,
};

export default Contact;
