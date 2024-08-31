import { Container, Modal, Stepper } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next"; // Importing the translation hook
import AddLocation from "../AddLocation/AddLocation";
import { useAuth0 } from "@auth0/auth0-react";
import UploadImage from "../UploadImage/UploadImage";
import BasicDetails from "../BasicDetails/BasicDetails";
import Facilities from "../Facilities/Facilities";
import PropTypes from 'prop-types';

const AddPropertyModal = ({ opened, setOpened }) => {
  const { t } = useTranslation("steps"); // Initializing the translation hook
  const [active, setActive] = useState(0);
  const { user } = useAuth0();

  const [propertyDetails, setPropertyDetails] = useState({
    name: "",
    description: "",
    regularPrice: 0,
    discountPrice: 0,
    type: "",
    property: "",
    status: "",    
    country: "",
    city: "",
    address: "",
    image: null,
    facilities: {
      bedrooms: 0,
      parkings: 0,
      bathrooms: 0,
      furnished: false,
      parking: false,
      offer: false,
    },
    userEmail: user?.email,
  });

  const nextStep = () => {
    setActive((current) => (current < 3 ? current + 1 : current)); // Adjusted step limit
  };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      closeOnClickOutside
      size={"90rem"}
    >
      <Container h={"40rem"} w={"100%"}>
        <Stepper
          active={active}
          onStepClick={setActive}
          breakpoint="sm"
          allowNextStepsSelect={false}
        >
          <Stepper.Step 
            label={t("steps.location.label")} 
            description={t("steps.location.description")}
          >
            <AddLocation
              nextStep={nextStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
            />
          </Stepper.Step>
          <Stepper.Step 
            label={t("steps.images.label")} 
            description={t("steps.images.description")}
          >
            <UploadImage
              prevStep={prevStep}
              nextStep={nextStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
            />
          </Stepper.Step>
          <Stepper.Step 
            label={t("steps.basics.label")} 
            description={t("steps.basics.description")}
          >
            <BasicDetails
              prevStep={prevStep}
              nextStep={nextStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
            />
          </Stepper.Step>

          <Stepper.Step>
            <Facilities
              prevStep={prevStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
              setOpened={setOpened}
              setActiveStep={setActive}
            />
          </Stepper.Step>
          
          <Stepper.Completed>
            {t("steps.completed")}
          </Stepper.Completed>
        </Stepper>
      </Container>
    </Modal>
  );
};

// Prop validation
AddPropertyModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  setOpened: PropTypes.func.isRequired,
};

export default AddPropertyModal;
