import { Container, Modal, Stepper } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next"; // Importing the translation hook
import AddLocation from "../AddLocation/AddLocation";
import { useAuth0 } from "@auth0/auth0-react";
import UploadImage from "../UploadImage/UploadImage";
import MBasicDetails from "../BasicDetails/MBasicDetails";
import MaintenanceHistory from "../Facilities/MaintenanceHistory";
import PropTypes from 'prop-types';

const AddMaintenanceModal = ({ opened, setOpened }) => {
  const { t } = useTranslation("steps"); // Initializing the translation hook
  const [active, setActive] = useState(0);
  const { user } = useAuth0();

  const [propertyDetails, setPropertyDetails] = useState({
    name: "",
    description: "",
    type: "",
    property: "",
    status: "",
    size: 0,
    maintenanceCharge: 0,
    estimatedValue: 0,
    yearBuilt: "",
    lastRenovationDate: null,
    materialsUsed: "",
    condition: "",
    maintenanceSchedule: "",   
    country: "",
    city: "",
    address: "",
    image: null,
    MaintenanceHistory: {
      description: "",
      date: "",  
      cost: 0,           
    },
    userEmail: user?.email,
  });

  const nextStep = () => {
    setActive((current) => (current < 4 ? current + 1 : current));
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
            <MBasicDetails
              prevStep={prevStep}
              nextStep={nextStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
            />
          </Stepper.Step>

          <Stepper.Step>
            <MaintenanceHistory 
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
AddMaintenanceModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  setOpened: PropTypes.func.isRequired,
};

export default AddMaintenanceModal;
