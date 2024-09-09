import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Group, NumberInput, Switch } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import UserDetailContext from "../../context/UserDetailContext";
import useProperties from "../../hooks/useProperties.jsx";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { createResidency } from "../../utils/api.js";
import { useTranslation } from 'react-i18next';

const Facilities = ({
  prevStep,
  propertyDetails,
  setPropertyDetails,
  setOpened,
  setActiveStep,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation("Fform");

  const form = useForm({
    initialValues: {
      bedrooms: propertyDetails.facilities?.bedrooms || 1,
      parkings: propertyDetails.facilities?.parkings || 0,
      bathrooms: propertyDetails.facilities?.bathrooms || 1,
      furnished: propertyDetails.facilities?.furnished || false,
      parking: propertyDetails.facilities?.parking || false,
      offer: propertyDetails.facilities?.offer || false,
    },
    validate: {
      bedrooms: (value) => (value < 1 ? t('validation.mustHaveAtLeastOneRoom') : null),
      bathrooms: (value) => value < 1 ? t('validation.mustHaveAtLeastOneBathroom') : null,
    },
  });

  const { bedrooms, parkings, bathrooms, furnished, parking, offer } = form.values;
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);


  // Logging and refetching if token or email is undefined
  useEffect(() => {
    const logAndFetchToken = async () => {
      try {
        console.log("Current Token:", userDetails.token);
        console.log("Current Email:", userDetails.email);

        if (!userDetails.token || !userDetails.email) {
          if (isAuthenticated) {
            const res = await getAccessTokenSilently({
              authorizationParams: {
                audience: "http://localhost:3000", // Adjust if needed
                scope: "openid profile email",
              },
            });
            console.log("Fetched Token:", res);
            setUserDetails((prev) => ({
              ...prev,
              token: res,
              email: user.email,
            }));
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
  }, [getAccessTokenSilently, isAuthenticated, userDetails, setUserDetails, user]);

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!userDetails.email && !user?.email) {
      toast.error("You must be logged in to submit facilities.", { position: "bottom-right" });
      return;
    }
    if (!hasErrors) {
      setPropertyDetails((prev) => ({
        ...prev,
        facilities: { bedrooms, parkings, bathrooms, furnished, parking, offer },
        userEmail: userDetails.email || user?.email,
      }));
      mutate();
    }
  };

  const { refetch: refetchProperties } = useProperties();

  const { mutate } = useMutation({
    mutationFn: () => createResidency({
      ...propertyDetails,
      facilities: { bedrooms, parkings, bathrooms, furnished, parking, offer },
    }, userDetails.token),
    onError: ({ response }) => toast.error(response.data.message, { position: "bottom-right" }),
    onSettled: () => {
      toast.success(t('messages.success'), { position: "bottom-right" });
      setPropertyDetails({
        name: "",
        description: "",
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
        userEmail: userDetails.email || user?.email,
      });
      setOpened(false);
      setActiveStep(0);
      refetchProperties();
    }
  });

  if (isLoading) {
    return <div>{t('messages.loading')}</div>;
  }

  return (
    <Box maw="30%" mx="auto" my="sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <NumberInput
          withAsterisk
          label={t('Fform.bedrooms')}
          placeholder={t('Fform.bedroomsPlaceholder')}
          min={0}
          {...form.getInputProps("bedrooms")}
        />
        <NumberInput
          label={t('Fform.parkings')}
          placeholder={t('Fform.parkingsPlaceholder')}
          min={0}
          {...form.getInputProps("parkings")}
        />
        <NumberInput
          withAsterisk
          label={t('Fform.bathrooms')}
          placeholder={t('Fform.bathroomsPlaceholder')}
          min={0}
          {...form.getInputProps("bathrooms")}
        />
        <br/>
        <Switch
          label={t('Fform.furnished')}
          checked={form.values.furnished}
          {...form.getInputProps("furnished", { type: 'checkbox' })}
        />
        <br />
        <Switch
          label={t('Fform.parking')}
          checked={form.values.parking}
          {...form.getInputProps("parking", { type: 'checkbox' })}
        />
        <br />
        <Switch
          label={t('Fform.offer')}
          checked={form.getInputProps("offer", { type: 'checkbox' }).value}
        />
        <br />
        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            {t('buttons.back')}
          </Button>
          <Button type="submit" color="green" disabled={isLoading}>
            {isLoading ? t('buttons.submitting') : t('buttons.submit')}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

Facilities.propTypes = {
  prevStep: PropTypes.func.isRequired,
  propertyDetails: PropTypes.shape({
    facilities: PropTypes.shape({
      bedrooms: PropTypes.number,
      parkings: PropTypes.number,
      bathrooms: PropTypes.number,
      furnished: PropTypes.bool,
      parking: PropTypes.bool,
      offer: PropTypes.bool,
    }),
  }).isRequired,
  setPropertyDetails: PropTypes.func.isRequired,
  setOpened: PropTypes.func.isRequired,
  setActiveStep: PropTypes.func.isRequired,
};

export default Facilities;
