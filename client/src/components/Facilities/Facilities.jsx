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

const Facilities = ({
  prevStep,
  propertyDetails,
  setPropertyDetails,
  setOpened,
  setActiveStep,
}) => {
  const [isLoading, setIsLoading] = useState(true);
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
      bedrooms: (value) => (value < 1 ? "Must have at least one room" : null),
      bathrooms: (value) =>
        value < 1 ? "Must have at least one bathroom" : null,
    },
  });

  const { bedrooms, parkings, bathrooms, furnished, parking, offer } = form.values;

  // Access Auth0 and UserDetailContext
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);

  // Check if token is present, if not, retrieve it
  useEffect(() => {
    const getTokenAndSetContext = async () => {
      try {
        if (!userDetails.token && isAuthenticated) {
          const res = await getAccessTokenSilently({
            authorizationParams: {
              audience: "http://localhost:3000", // Adjust if needed
              scope: "openid profile email",
            },
          });
          console.log("Access Token:", res);
          localStorage.setItem("access_token", res);
          setUserDetails((prev) => ({
            ...prev,
            token: res,
            email: user.email,
          }));
        }
      } catch (error) {
        console.error("Error during token retrieval:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getTokenAndSetContext();
  }, [getAccessTokenSilently, isAuthenticated, userDetails.token, setUserDetails, user]);

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      setPropertyDetails((prev) => ({
        ...prev,
        facilities: { bedrooms, parkings, bathrooms, furnished, parking, offer },
        userEmail: userDetails.email || user?.email,
      }));
      mutate();
    }
  };

  // Refetch properties after mutation
  const { refetch: refetchProperties } = useProperties();

  const { mutate } = useMutation({
    mutationFn: () => createResidency({
      ...propertyDetails, 
      facilities: { bedrooms, parkings, bathrooms, furnished, parking, offer },
    }, userDetails.token),
    onError: ({ response }) => toast.error(response.data.message, { position: "bottom-right" }),
    onSettled: () => {
      toast.success("Added Successfully", { position: "bottom-right" });
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
    return <div>Loading...</div>; // Show loading while token is being set
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
          label="No of Bedrooms"
          min={0}
          {...form.getInputProps("bedrooms")}
        />
        <NumberInput
          label="No of Parkings"
          min={0}
          {...form.getInputProps("parkings")}
        />
        <NumberInput
          withAsterisk
          label="No of Bathrooms"
          min={0}
          {...form.getInputProps("bathrooms")}
        />
        <Switch
          label="Furnished"
          checked={form.values.furnished}
          {...form.getInputProps("furnished", { type: 'checkbox' })}
        />
        <Switch
          label="Parking"
          checked={form.values.parking}
          {...form.getInputProps("parking", { type: 'checkbox' })}
        />
        <Switch
          label="Offer"
          checked={form.getInputProps("offer", { type: 'checkbox' }).value}
        />
        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit" color="green" disabled={isLoading}>
            {isLoading ? "Submitting" : "Add Property"}
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
