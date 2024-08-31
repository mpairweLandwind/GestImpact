import PropTypes from 'prop-types';
import { TextInput, Box, Textarea, Group, Button, NumberInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { validateString } from "../../utils/common";
import { useTranslation } from "react-i18next";

const BasicDetails = ({ prevStep, nextStep, propertyDetails, setPropertyDetails }) => {
  const { t } = useTranslation("Bform");

  const form = useForm({
    initialValues: {
      name: propertyDetails.name || "",
      description: propertyDetails.description || "",
      regularPrice: propertyDetails.regularPrice || 0,
      discountPrice: propertyDetails.discountPrice || 0,
      type: propertyDetails.type || "",
      property: propertyDetails.property || "",
      status: propertyDetails.status || "",
    },
    validate: {
      name: (value) => validateString(value),
      description: (value) => validateString(value),
      regularPrice: (value) =>
        value < 1 ? t('validation.priceGreaterThanOne') : null,
      discountPrice: (value) =>
        value >= form.values.regularPrice
          ? t('validation.discountPriceLessThanRegular')
          : null,
      type: (value) => validateString(value),
      property: (value) => validateString(value),
      status: (value) => validateString(value),
    },
  });

  const { name, description, regularPrice, discountPrice, type, property, status } = form.values;

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      setPropertyDetails((prev) => ({
        ...prev,
        name,
        description,
        regularPrice,
        discountPrice,
        type,
        property,
        status,
      }));
      nextStep();
    }
  };

  const typeOptions = [
    { value: 'sale', label: t('options.sale') },
    { value: 'buy', label: t('options.buy') },
    { value: 'rent', label: t('options.rent') }
  ];

  const propertyOptions = [
    { value: 'land', label: t('options.land') },
    { value: 'apartment', label: t('options.apartment') },
    { value: 'condo', label: t('options.condo') },
    { value: 'house', label: t('options.house') }
  ];

  const statusOptions = [
    { value: 'available', label: t('options.available') },
    { value: 'occupied', label: t('options.occupied') },
    { value: 'under_contract', label: t('options.under_contract') },
    { value: 'for_sale', label: t('options.for_sale') },
    { value: 'under_renovation', label: t('options.under_renovation') },
    { value: 'pending_approval', label: t('options.pending_approval') },
    { value: 'sold', label: t('options.sold') },
    { value: 'terminated', label: t('options.terminated') },
    { value: 'pending_availability', label: t('options.pending_availability') },
    { value: 'inactive', label: t('options.inactive') }
  ];

  return (
    <Box maw="50%" mx="auto" my="md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextInput
          withAsterisk
          label={t('Bform.name')}
          placeholder={t('Bform.namePlaceholder')}
          {...form.getInputProps("name")}
        />
        <Textarea
          placeholder={t('Bform.descriptionPlaceholder')}
          label={t('Bform.description')}
          withAsterisk
          {...form.getInputProps("description")}
        />
        <NumberInput
          withAsterisk
          label={t('Bform.regularPrice')}
          placeholder={t('Bform.pricePlaceholder')}
          min={0}
          {...form.getInputProps("regularPrice")}
        />
        <NumberInput
          label={t('Bform.discountPrice')}
          placeholder={t('Bform.pricePlaceholder')}
          min={0}
          {...form.getInputProps("discountPrice")}
        />
        <Select
          withAsterisk
          label={t('Bform.type')}
          placeholder={t('Bform.selectType')}
          data={typeOptions}
          {...form.getInputProps("type")}
        />
        <Select
          withAsterisk
          label={t('Bform.property')}
          placeholder={t('Bform.selectProperty')}
          data={propertyOptions}
          {...form.getInputProps("property")}
        />
        <Select
          withAsterisk
          label={t('Bform.status')}
          placeholder={t('Bform.selectStatus')}
          data={statusOptions}
          {...form.getInputProps("status")}
        />
        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            {t('buttons.back')}
          </Button>
          <Button type="submit">{t('buttons.nextStep')}</Button>
        </Group>
      </form>
    </Box>
  );
};

BasicDetails.propTypes = {
  prevStep: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  propertyDetails: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    regularPrice: PropTypes.number,
    discountPrice: PropTypes.number,
    type: PropTypes.string,
    property: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  setPropertyDetails: PropTypes.func.isRequired,
};

export default BasicDetails;
