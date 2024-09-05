import React, { useState, useEffect, useContext } from 'react';
import { useForm } from '@mantine/form';
import UploadImage1 from '../UploadImage/UploadImage1';
import {
  TextInput,
  NumberInput,
  Textarea,
  Button,
  Group,
  Select,
  SimpleGrid,
  Checkbox,
  Card,
  Title,
} from '@mantine/core';
import { updateProperty } from '../../utils/api';
import { useAuth0 } from "@auth0/auth0-react";
import UserDetailContext from "../../context/UserDetailContext";

const EditPropertyForm = ({ propertyData, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState(propertyData?.images || []);
  
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

  const form = useForm({
    initialValues: {
      name: propertyData?.name || '',
      description: propertyData?.description || '',
      regularPrice: propertyData?.regularPrice || 0,
      discountPrice: propertyData?.discountPrice || 0,
      maintenanceCharge: propertyData?.maintenanceCharge || 0,
      size: propertyData?.size || 0,
      address: propertyData?.address || '',
      city: propertyData?.city || '',
      country: propertyData?.country || '',
      // Facilities fields grouped under facilities object
      facilities: {
        bathrooms: propertyData?.facilities?.bathrooms || 0,
        bedrooms: propertyData?.facilities?.bedrooms || 0,
        parkings: propertyData?.facilities?.parkings || 0,
        furnished: propertyData?.facilities?.furnished || false,
        parking: propertyData?.facilities?.parking || false,
        offer: propertyData?.facilities?.offer || false,
      },
      status: propertyData?.status || '',
      state: propertyData?.state || '',
      type: propertyData?.type || 'residential',
      images: propertyData?.images || [],
    },
  });

  useEffect(() => {
    const fetchToken = async () => {
      if (!userDetails.token || !userDetails.email) {
        if (isAuthenticated) {
          try {
            const token = await getAccessTokenSilently({
              authorizationParams: {
                audience: "http://localhost:3000", // Adjust if needed
                scope: "openid profile email",
              },
            });
            setUserDetails({
              token,
              email: user.email,
            });
          } catch (error) {
            console.error("Error fetching token:", error);
          }
        }
      }
    };

    fetchToken();
  }, [isAuthenticated, getAccessTokenSilently, userDetails, setUserDetails, user]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (!userDetails.token) {
        throw new Error('User is not authenticated.');
      }

      const dataToSubmit = {
        ...values,
        facilities: { ...values.facilities },  // Pass facilities as a JSON object
        images: uploadedImages,
      };

      await updateProperty(propertyData.id, dataToSubmit, userDetails.token); // Pass token here
      onCancel();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isStateDefined = !!form.values.state;
  const isStatusDefined = !!form.values.status;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} align="center" mb="md">Edit Property</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <SimpleGrid cols={2} spacing="md">
          <TextInput label="Property Name" {...form.getInputProps('name')} required />
          <Textarea label="Description" {...form.getInputProps('description')} required />
          <TextInput label="Country" {...form.getInputProps('country')} required />
          <TextInput label="City" {...form.getInputProps('city')} required />
          <TextInput label="Address" {...form.getInputProps('address')} required />
          <NumberInput label="Bathrooms" {...form.getInputProps('facilities.bathrooms')} required />
          <NumberInput label="Bedrooms" {...form.getInputProps('facilities.bedrooms')} />
          <NumberInput label="Parking Spaces" {...form.getInputProps('facilities.parkings')} />

          {isStatusDefined && (
            <>
              <NumberInput label="Regular Price ($)" {...form.getInputProps('regularPrice')} required />
              <NumberInput label="Discount Price ($)" {...form.getInputProps('discountPrice')} />
              <Select
                label="Status"
                data={[
                  { value: 'available', label: 'Available' },
                  { value: 'occupied', label: 'Occupied' },
                  { value: 'under_contract', label: 'Under Contract' },
                  { value: 'for_sale', label: 'For Sale' },
                ]}
                {...form.getInputProps('status')}
                required
              />
            </>
          )}

          {isStateDefined && (
            <>
              <NumberInput label="Maintenance Charge ($)" {...form.getInputProps('maintenanceCharge')} />
              <NumberInput label="Size (sqft)" {...form.getInputProps('size')} required />
              <Select
                label="Property Type"
                data={[
                  { value: 'residential', label: 'Residential' },
                  { value: 'commercial', label: 'Commercial' },
                ]}
                {...form.getInputProps('type')}
                required
              />
              <Select
                label="State"
                data={[
                  { value: 'UNOCCUPIED', label: 'Unoccupied' },
                  { value: 'RENTED', label: 'Rented' },
                  { value: 'UNDER_MAINTENANCE', label: 'Under Maintenance' },
                  { value: 'UNDER_SALE', label: 'Under Sale' },
                ]}
                {...form.getInputProps('state')}
              />
            </>
          )}

          {/* Facilities checkboxes */}
          <Checkbox label="Furnished" {...form.getInputProps('facilities.furnished', { type: 'checkbox' })} />
          <Checkbox label="Parking Available" {...form.getInputProps('facilities.parking', { type: 'checkbox' })} />
          <Checkbox label="Special Offer" {...form.getInputProps('facilities.offer', { type: 'checkbox' })} />

          <UploadImage1 uploadedImages={uploadedImages} setUploadedImages={setUploadedImages} />
        </SimpleGrid>
        <Group position="center" mt="md">
          <Button type="submit" variant="filled" color="blue" loading={loading}>
            Save Changes
          </Button>
          <Button variant="outline" color="red" onClick={onCancel}>
            Cancel
          </Button>
        </Group>
      </form>
    </Card>
  );
};

export default EditPropertyForm;
