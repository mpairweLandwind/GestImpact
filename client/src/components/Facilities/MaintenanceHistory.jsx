import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Group, NumberInput, TextInput, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import UserDetailContext from "../../context/UserDetailContext";
import useProperties from "../../hooks/useProperties.jsx";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { createMaintenance } from "../../utils/api.js";
import { useTranslation } from 'react-i18next';

const MaintenanceHistory = ({ prevStep, propertyDetails, setPropertyDetails, setOpened, setActiveStep }) => {
  const { t } = useTranslation("Hform");
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    initialValues: {
      description: propertyDetails.maintenanceHistory?.[0]?.description || "",
      date: propertyDetails.maintenanceHistory?.[0]?.date || new Date(),
      cost: propertyDetails.maintenanceHistory?.[0]?.cost || 0,
    },
    validate: {
      description: (value) => (value.trim() === "" ? t('form.descriptionRequired') : null),
      date: (value) => (value === null ? t('form.dateRequired') : null),
      cost: (value) => (value < 0 ? t('form.costNegative') : null),
    },
  });

  // Logging and refetching if token or email is undefined
  useEffect(() => {
    const logAndFetchToken = async () => {
      try {
        console.log("Current Token:", userDetails.token);
        console.log("Current Email:", userDetails.email);

        if (!userDetails.token || !userDetails.email) {
          if (isAuthenticated) {
            const token = await getAccessTokenSilently({
              authorizationParams: {
                audience: "http://localhost:3000", // Adjust if needed
                scope: "openid profile email",
              },
            });
            console.log("Fetched Token:", token);
            setUserDetails({ ...userDetails, token, email: user.email });
            console.log("Fetched Email:", user.email);
          }
        }
      } catch (error) {
        console.error("Error during token retrieval:", error);
      } finally {
        setIsLoading(false);
      }
    };

    logAndFetchToken();
  }, [isAuthenticated, getAccessTokenSilently, userDetails, setUserDetails, user]);

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
  
    if (!userDetails.email && !user?.email) {
      toast.error("You must be logged in to submit maintenance history.", { position: "bottom-right" });
      return;
    }
  
    if (!hasErrors) {
      const { description, date, cost } = form.values;
  
      setPropertyDetails((prev) => ({
        ...prev,
        maintenanceHistory: [{ description, date, cost }],
        userEmail: userDetails.email || user?.email,
      }));
      
      mutate();
    }
  };
  
  

  const { refetch: refetchProperties } = useProperties();

  const { mutate } = useMutation({
    mutationFn: () => createMaintenance({
      ...propertyDetails,
      maintenanceHistory: [{ description: form.values.description, date: form.values.date, cost: form.values.cost }],
    }, userDetails.token),
    onError: ({ response }) => toast.error(response.data.message, { position: "bottom-right" }),
    onSettled: () => {
      toast.success("Added Successfully", { position: "bottom-right" });
      setPropertyDetails({
        name: "",
        description: "",
        type: "",
        property: "",
        state: "",
        size: 0,
        maintenanceCharge: "",
        estimatedValue: "",
        yearBuilt: "",
        lastRenovationDate: "",
        materialsUsed: "",
        condition: "",
        maintenanceSchedule: "",
        country: "",
        city: "",
        address: "",
        image: null,
        maintenanceHistory: [{ description: "", date: new Date(), cost: 0 }],
        userEmail: userDetails.email || user?.email,
      });
      setOpened(false);
      setActiveStep(0);
      refetchProperties();
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box maw="30%" mx="auto" my="sm">
      <Title order={2} align="center" mb="lg">{t('titles.maintenanceHistory')}</Title>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextInput withAsterisk label={t('Hform.description')} placeholder={t('Hform.descriptionPlaceholder')} {...form.getInputProps("description")} />
        <DateInput withAsterisk label={t('Hform.date')} placeholder={t('Hform.datePlaceholder')} {...form.getInputProps("date")} />
        <NumberInput withAsterisk label={t('Hform.cost')} placeholder={t('Hform.costPlaceholder')} min={0} {...form.getInputProps("cost")} />
        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>{t('buttons.back')}</Button>
          <Button type="submit" color="green" disabled={isLoading}>{isLoading ? t('buttons.submitting') : t('buttons.submit')}</Button>
        </Group>
      </form>
    </Box>
  );
};

MaintenanceHistory.propTypes = {
  prevStep: PropTypes.func.isRequired,
  propertyDetails: PropTypes.shape({
    maintenanceHistory: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string,
        date: PropTypes.instanceOf(Date),
        cost: PropTypes.number,
      })
    ),
  }).isRequired,
  setPropertyDetails: PropTypes.func.isRequired,
  setOpened: PropTypes.func.isRequired,
  setActiveStep: PropTypes.func.isRequired,
};

export default MaintenanceHistory;
