import PropTypes from 'prop-types';
import { useEffect, useRef } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Button } from "@mantine/core";
import "./UploadImage.css";

const UploadImage1 = ({ uploadedImages, setUploadedImages }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "duyrx4d7g",
        uploadPreset: "rz4wltd3",
        maxFiles: 6,
        multiple: true,
      },
      (err, result) => {
        if (result.event === "success") {
          setUploadedImages((prev) => [...prev, result.info.secure_url]);
        }
      }
    );
  }, [setUploadedImages]);

  return (
    <div>
      {uploadedImages.length === 0 ? (
        <div onClick={() => widgetRef.current?.open()}>
          <AiOutlineCloudUpload size={50} color="grey" />
          <span>Upload Image</span>
        </div>
      ) : (
        <div>
          {uploadedImages.map((url, index) => (
            <img key={index} src={url} alt={`Uploaded ${index + 1}`} />
          ))}
          <Button variant="default" onClick={() => widgetRef.current?.open()}>
            Upload More Images
          </Button>
        </div>
      )}
    </div>
  );
};

UploadImage1.propTypes = {
  uploadedImages: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of image URLs
  setUploadedImages: PropTypes.func.isRequired, // Function to update the parent state
};

export default UploadImage1;
