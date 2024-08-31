import PropTypes from 'prop-types';
import { TextInput, Box, Textarea, Group, Button, NumberInput, Select, Grid, Col, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { validateString } from "../../utils/common";
import { useTranslation } from "react-i18next";

const MBasicDetails = ({ prevStep, nextStep, propertyDetails, setPropertyDetails }) => {
  const { t } = useTranslation("Mform");

  const form = useForm({
    initialValues: {
      name: propertyDetails.name || "",
      description: propertyDetails.description || "",
      type: propertyDetails.type || "",
      property: propertyDetails.property || "",
      state: propertyDetails.state || "",
      size: propertyDetails.size || 0,
      maintenanceCharge: propertyDetails.maintenanceCharge || 0,
      estimatedValue: propertyDetails.estimatedValue || 0,
      yearBuilt: propertyDetails.yearBuilt || "",
      lastRenovationDate: propertyDetails.lastRenovationDate ? new Date(propertyDetails.lastRenovationDate) : new Date(),
      materialsUsed: propertyDetails.materialsUsed || "",
      condition: propertyDetails.condition || "",
      maintenanceSchedule: propertyDetails.maintenanceSchedule || "",
    },
    validate: {
      name: (value) => validateString(value),
      description: (value) => validateString(value),
      type: (value) => validateString(value),
      property: (value) => validateString(value),
      state: (value) => validateString(value),
    },
  });

  const {
    name,
    description,
    type,
    property,
    state,
    size,
    maintenanceCharge,
    estimatedValue,
    yearBuilt,
    lastRenovationDate,
    materialsUsed,
    condition,
    maintenanceSchedule,
  } = form.values;

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      setPropertyDetails((prev) => ({
        ...prev,
        name,
        description,
        type,
        property,
        state,
        size,
        maintenanceCharge,
        estimatedValue,
        yearBuilt,
        lastRenovationDate: new Date(lastRenovationDate), // Ensure it's a Date object
        materialsUsed,
        condition,
        maintenanceSchedule,
      }));
      nextStep();
    }
  };

  const typeOptions = [
    { value: 'Routine', label: t('options.routine') },
    { value: 'Preventive', label: t('options.preventive') },
    { value: 'Corrective', label: t('options.corrective') },
    { value: 'Predictive', label: t('options.predictive') },
    { value: 'Emergency', label: t('options.emergency') },
    { value: 'Cosmetic', label: t('options.cosmetic') },
    { value: 'Seasonal', label: t('options.seasonal') },
    { value: 'Deferred', label: t('options.deferred') }
  ];

  const propertyOptions = [
    { value: 'RESIDENTIAL', label: t('options.residential') },
    { value: 'COMMERCIAL', label: t('options.commercial') },
    { value: 'INDUSTRIAL', label: t('options.industrial') },
    { value: 'LAND', label: t('options.land') }
  ];

  const stateOptions = [
    { value: 'UNOCCUPIED', label: t('options.unoccupied') },
    { value: 'RENTED', label: t('options.rented') },
    { value: 'UNDER_MAINTENANCE', label: t('options.under_maintenance') },
    { value: 'UNDER_SALE', label: t('options.under_sale') }
  ];

  const conditionOptions = [
    { value: 'NEW', label: t('options.new') },
    { value: 'GOOD', label: t('options.good') },
    { value: 'FAIR', label: t('options.fair') },
    { value: 'POOR', label: t('options.poor') }
  ];

  const maintenanceScheduleOptions = [
    { value: 'DAILY', label: t('options.daily') },
    { value: 'WEEKLY', label: t('options.weekly') },
    { value: 'MONTHLY', label: t('options.monthly') },
    { value: 'QUARTERLY', label: t('options.quarterly') },
    { value: 'HALF-YEARLY', label: t('options.half_yearly') },
    { value: 'YEARLY', label: t('options.yearly') }
  ];

  return (
    <Box maw="70%" mx="auto" my="md">
      <Title order={2} align="center" mb="lg">
        {t('titles.basicMaintenanceDetails')}
      </Title>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Grid>
          <Col span={6}>
            <TextInput
              withAsterisk
              label={t('Mform.name')}
              placeholder={t('Mform.namePlaceholder')}
              {...form.getInputProps("name")}
            />
          </Col>
          <Col span={6}>
            <Select
              withAsterisk
              label={t('Mform.type')}
              placeholder={t('Mform.selectType')}
              data={typeOptions}
              {...form.getInputProps("type")}
            />
          </Col>
          <Col span={6}>
            <Select
              withAsterisk
              label={t('Mform.propertyType')}
              placeholder={t('Mform.selectPropertyType')}
              data={propertyOptions}
              {...form.getInputProps("property")}
            />
          </Col>
          <Col span={6}>
            <Select
              withAsterisk
              label={t('Mform.state')}
              placeholder={t('Mform.selectState')}
              data={stateOptions}
              {...form.getInputProps("state")}
            />
          </Col>
          <Col span={12}>
            <Textarea
              placeholder={t('Mform.descriptionPlaceholder')}
              label={t('Mform.description')}
              withAsterisk
              {...form.getInputProps("description")}
            />
          </Col>
          <Col span={6}>
            <NumberInput
              label={t('Mform.size')}
              placeholder={t('Mform.sizePlaceholder')}
              {...form.getInputProps("size")}
            />
          </Col>
          <Col span={6}>
            <NumberInput
              label={t('Mform.maintenanceCharge')}
              placeholder={t('fMorm.maintenanceChargePlaceholder')}
              {...form.getInputProps("maintenanceCharge")}
            />
          </Col>
          <Col span={6}>
            <NumberInput
              label={t('Mform.estimatedValue')}
              placeholder={t('Mform.estimatedValuePlaceholder')}
              {...form.getInputProps("estimatedValue")}
            />
          </Col>
          <Col span={6}>
            <NumberInput
              label={t('Mform.yearBuilt')}
              placeholder={t('Mform.yearBuiltPlaceholder')}
              {...form.getInputProps("yearBuilt")}
            />
          </Col>
          <Col span={6}>
            <DateInput
              label={t('Mform.lastRenovationDate')}
              placeholder={t('Mform.selectLastRenovationDate')}
              {...form.getInputProps("lastRenovationDate")}
            />
          </Col>
          <Col span={6}>
            <Textarea
              label={t('Mform.materialsUsed')}
              placeholder={t('Mform.materialsUsedPlaceholder')}
              {...form.getInputProps("materialsUsed")}
            />
          </Col>
          <Col span={6}>
            <Select
              label={t('Mform.condition')}
              placeholder={t('Mform.selectCondition')}
              data={conditionOptions}
              {...form.getInputProps("condition")}
            />
          </Col>
          <Col span={6}>
            <Select
              label={t('Mform.maintenanceSchedule')}
              placeholder={t('Mform.selectMaintenanceSchedule')}
              data={maintenanceScheduleOptions}
              {...form.getInputProps("maintenanceSchedule")}
            />
          </Col>
        </Grid>
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

MBasicDetails.propTypes = {
  prevStep: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  propertyDetails: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    property: PropTypes.string,
    state: PropTypes.string,
    size: PropTypes.number,
    maintenanceCharge: PropTypes.number,
    estimatedValue: PropTypes.number,
    yearBuilt: PropTypes.string,
    lastRenovationDate: PropTypes.instanceOf(Date),
    materialsUsed: PropTypes.string,
    condition: PropTypes.string,
    maintenanceSchedule: PropTypes.string,
  }).isRequired,
  setPropertyDetails: PropTypes.func.isRequired,
};

export default MBasicDetails;
