import React, { useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  NumberInput,
  Checkbox,
  Textarea,
  Button,
  Group,
  Select,
  Stack,
  Card,
  Title,
  SimpleGrid,
} from "@mantine/core";

const EditPropertyForm = ({ propertyData = {}, onCancel }) => {
  const [initialPropertyDetails, setInitialPropertyDetails] = useState({
    ...propertyData,
    facilities: {
      bedrooms: propertyData.facilities?.bedrooms || 0,
      parkings: propertyData.facilities?.parkings || 0,
      bathrooms: propertyData.facilities?.bathrooms || 0,
      furnished: propertyData.facilities?.furnished || false,
      parking: propertyData.facilities?.parking || false,
      offer: propertyData.facilities?.offer || false,
    },
  });

  useEffect(() => {
    if (propertyData) {
      setInitialPropertyDetails({
        ...propertyData,
        facilities: {
          bedrooms: propertyData.facilities?.bedrooms || 0,
          parkings: propertyData.facilities?.parkings || 0,
          bathrooms: propertyData.facilities?.bathrooms || 0,
          furnished: propertyData.facilities?.furnished || false,
          parking: propertyData.facilities?.parking || false,
          offer: propertyData.facilities?.offer || false,
        },
      });
    }
  }, [propertyData]);

  const form = useForm({
    initialValues: {
      name: initialPropertyDetails.name,
      type: initialPropertyDetails.type,
      property: initialPropertyDetails.property,
      status: initialPropertyDetails.status,
      description: initialPropertyDetails.description,
      country: initialPropertyDetails.country,
      city: initialPropertyDetails.city,
      address: initialPropertyDetails.address,
      regularPrice: initialPropertyDetails.regularPrice,
      discountPrice: initialPropertyDetails.discountPrice,
      facilities: {
        bedrooms: initialPropertyDetails.facilities.bedrooms,
        parkings: initialPropertyDetails.facilities.parkings,
        bathrooms: initialPropertyDetails.facilities.bathrooms,
        furnished: initialPropertyDetails.facilities.furnished,
        parking: initialPropertyDetails.facilities.parking,
        offer: initialPropertyDetails.facilities.offer,
      },
      image: initialPropertyDetails.image ? initialPropertyDetails.image[0] : "",
    },
  });

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        width: '80%',
        margin: '0 auto',
        maxWidth: '800px',
      }}
    >
      <Title order={3} align="center" mb="md">Edit Property</Title>
      <form
        onSubmit={form.onSubmit((values) => {
          onSubmit(values);
        })}
      >
        <SimpleGrid cols={2} spacing="md">
          <TextInput
            label="Property Name"
            placeholder="Enter property name"
            {...form.getInputProps("name")}
          />

          <Select
            label="Type"
            placeholder="Pick one"
            data={[
              { value: "rent", label: "Rent" },
              { value: "sale", label: "Sale" },
            ]}
            {...form.getInputProps("type")}
          />

          <Select
            label="Property Type"
            placeholder="Select property type"
            data={[
              { value: "apartment", label: "Apartment" },
              { value: "house", label: "House" },
              { value: "condo", label: "Condo" },
            ]}
            {...form.getInputProps("property")}
          />

          <Select
            label="Status"
            placeholder="Select status"
            data={[
              { value: "available", label: "Available" },
              { value: "occupied", label: "Occupied" },
              { value: "under_contract", label: "Under Contract" },
              { value: "for_sale", label: "For Sale" },
            ]}
            {...form.getInputProps("status")}
          />

          <Textarea
            label="Description"
            placeholder="Enter property description"
            {...form.getInputProps("description")}
          />

          <TextInput
            label="Country"
            placeholder="Enter country"
            {...form.getInputProps("country")}
          />

          <TextInput
            label="City"
            placeholder="Enter city"
            {...form.getInputProps("city")}
          />

          <TextInput
            label="Address"
            placeholder="Enter address"
            {...form.getInputProps("address")}
          />

          <NumberInput
            label="Regular Price"
            placeholder="Enter regular price"
            {...form.getInputProps("regularPrice")}
          />

          <NumberInput
            label="Discount Price"
            placeholder="Enter discount price"
            {...form.getInputProps("discountPrice")}
          />

          <NumberInput
            label="Bedrooms"
            placeholder="Number of bedrooms"
            {...form.getInputProps("facilities.bedrooms")}
          />
          <NumberInput
            label="Parkings"
            placeholder="Number of parkings"
            {...form.getInputProps("facilities.parkings")}
          />
          <NumberInput
            label="Bathrooms"
            placeholder="Number of bathrooms"
            {...form.getInputProps("facilities.bathrooms")}
          />

          <Checkbox
            label="Furnished"
            {...form.getInputProps("facilities.furnished", { type: "checkbox" })}
          />
          <Checkbox
            label="Parking Available"
            {...form.getInputProps("facilities.parking", { type: "checkbox" })}
          />
          <Checkbox
            label="Special Offer"
            {...form.getInputProps("facilities.offer", { type: "checkbox" })}
          />

          <TextInput
            label="Image URL"
            placeholder="Enter image URL"
            {...form.getInputProps("image")}
          />
        </SimpleGrid>

        <Group position="center" mt="md">
          <Button type="submit" variant="filled" color="blue">
            Submit
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
