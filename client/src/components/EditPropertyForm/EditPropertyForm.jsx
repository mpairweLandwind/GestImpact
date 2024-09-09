import React, { useState, useContext } from 'react';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
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
import UserDetailContext from "../../context/UserDetailContext";
import useStyles from './EditPropertyFormStyles'; // Importing styles

const EditPropertyForm = ({ propertyData, onCancel }) => {
  const { t } = useTranslation("edit_property");
  const { classes } = useStyles();  // Apply styles
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState(propertyData?.images || []);
  
  const { userDetails } = useContext(UserDetailContext);

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

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (!userDetails.token) {
        throw new Error(t('error.not_authenticated'));
      }

      const dataToSubmit = {
        ...values,
        facilities: { ...values.facilities },
        images: uploadedImages,
      };

      await updateProperty(propertyData.id, dataToSubmit, userDetails.token);
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
    <Card shadow="sm" padding="lg" radius="md" withBorder className={classes.card}>
      <Title order={3} align="center" mb="md">{t('edit_property.title')}</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <SimpleGrid
          cols={2}  // 2 columns on medium and large screens
          spacing="md"
          breakpoints={[{ maxWidth: 'sm', cols: 1 }]}  // 1 column on small screens
        >
          <TextInput label={t('edit_property.name')} {...form.getInputProps('name')} required />
          <Textarea label={t('edit_property.description')} {...form.getInputProps('description')} required />
          <TextInput label={t('edit_property.country')} {...form.getInputProps('country')} required />
          <TextInput label={t('edit_property.city')} {...form.getInputProps('city')} required />
          <TextInput label={t('edit_property.address')} {...form.getInputProps('address')} required />
          <NumberInput label={t('edit_property.bathrooms')} {...form.getInputProps('facilities.bathrooms')} required />
          <NumberInput label={t('edit_property.bedrooms')} {...form.getInputProps('facilities.bedrooms')} />
          <NumberInput label={t('edit_property.parkings')} {...form.getInputProps('facilities.parkings')} />

          {isStatusDefined && (
            <>
              <NumberInput label={t('edit_property.regular_price')} {...form.getInputProps('regularPrice')} required />
              <NumberInput label={t('edit_property.discount_price')} {...form.getInputProps('discountPrice')} />
              <Select
                label={t('edit_property.status')}
                data={[
                  { value: 'available', label: t('status.available') },
                  { value: 'occupied', label: t('status.occupied') },
                  { value: 'under_contract', label: t('status.under_contract') },
                  { value: 'for_sale', label: t('status.for_sale') },
                ]}
                {...form.getInputProps('status')}
                required
              />
            </>
          )}

          {isStateDefined && (
            <>
              <NumberInput label={t('edit_property.maintenance_charge')} {...form.getInputProps('maintenanceCharge')} />
              <NumberInput label={t('edit_property.size')} {...form.getInputProps('size')} required />
              <Select
                label={t('edit_property.type')}
                data={[
                  { value: 'residential', label: t('property_type.residential') },
                  { value: 'commercial', label: t('property_type.commercial') },
                ]}
                {...form.getInputProps('type')}
                required
              />
              <Select
                label={t('edit_property.state')}
                data={[
                  { value: 'UNOCCUPIED', label: t('state.unoccupied') },
                  { value: 'RENTED', label: t('state.rented') },
                  { value: 'UNDER_MAINTENANCE', label: t('state.under_maintenance') },
                  { value: 'UNDER_SALE', label: t('state.under_sale') },
                ]}
                {...form.getInputProps('state')}
              />
            </>
          )}

          <Checkbox label={t('edit_property.furnished')} {...form.getInputProps('facilities.furnished', { type: 'checkbox' })} />
          <Checkbox label={t('edit_property.parking')} {...form.getInputProps('facilities.parking', { type: 'checkbox' })} />
          <Checkbox label={t('edit_property.offer')} {...form.getInputProps('facilities.offer', { type: 'checkbox' })} />

          <UploadImage1 uploadedImages={uploadedImages} setUploadedImages={setUploadedImages} />
        </SimpleGrid>
        <Group position="center" mt="md">
          <Button type="submit" variant="filled" color="blue" loading={loading}>
            {t('edit_property.save_changes')}
          </Button>
          <Button variant="outline" color="red" onClick={onCancel}>
            {t('edit_property.cancel')}
          </Button>
        </Group>
      </form>
    </Card>
  );
};

export default EditPropertyForm;
