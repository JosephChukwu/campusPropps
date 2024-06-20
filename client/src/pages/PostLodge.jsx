import { Button, Box, Grid, TextField, Typography, Paper } from "@mui/material";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { object, string, array } from "yup";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

// const validationSchema = Yup.object({
//  selectField: Yup.string()
//     .required('Selection is required'),
// });

function PostLodge() {
  const initialValues = {
    leaseTerms: "",
    title: "",
    type: "",
    vacancy: "",
    rent: "",
    initial: "",
    description: "",
    location: "",
    lodgeImages: [],
    campus: "UNEC",
  };

  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleImageSubmit = async (e, setFieldValue, lodgeImages) => {
    console.log(files);
    if (files.length > 0 && files.length + lodgeImages.length < 6) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          // Concatenate new URLs with existing URLs
          const updatedUrls = lodgeImages.concat(urls);
          // Update the form's lodgeImages field with the updated URLs
          setFieldValue("lodgeImages", updatedUrls);
          console.log(updatedUrls);
          console.log(lodgeImages);
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("image upload failed (2 mb max per image)");
          setUploading(false);
          console.error("Error storing images:", error);
        });
    } else {
      setImageUploadError("you can only upload 5 images per lodge");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteImage = (indexToDelete, values, setFieldValue) => {
    // Create a new array that excludes the image at the specified index
    const newLodgeImages = values.lodgeImages.filter(
      (_, index) => index !== indexToDelete
    );

    // Update the form's lodgeImages field with the new array
    setFieldValue("lodgeImages", newLodgeImages);
  };
  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={validationSchema}

      //Submitting the form
      onSubmit={async (values, formikHelpers) => {
        setLoading(true);
        setError("");

        try {
          const response = await fetch(
            `/api/lodge/createLodge/${currentUser._id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            }
          );
          console.log(values);

          const responseData = await response.json();
          console.log(responseData);

          if (responseData.success === false) {
            setError(
              responseData.message || "Failed to post lodge, please try again"
            );
          } else {
            console.log(responseData);
            navigate(`/LodgePage/${responseData._id}`);
          }
        } catch (error) {
          setError("Expired token; Login required!");
          console.log(error.message);
        } finally {
          setLoading(false);
          // formikHelpers.resetForm();
        }
      }}
      //Validation using the yup object and string
      validationSchema={object({
        title: string()
          .required("please enter your lodge title")
          .min(20, "title is too short")
          .max(100, "title is too long"),
        leaseTerms: string().required("please select Brief"),
        type: string().required("please select lodge Type"),
        location: string().required("please select lodge location"),
        vacancy: string().required("please select vacancy option"),
        rent: string().required("rent is required").max(20, "rent is too long"),
        initial: string().required("Agent fee is required"),
        description: string()
          .required("lodge description is required")
          .min(20, "description is too short")
          .max(100, "description is too long"),
        lodgeImages: array()
          .min(1, "At least one image is required")
          .nullable(),
      })}

      // onSubmit={(values) => {
      //   console.log(values);
      // }}
    >
      {({ errors, touched, setFieldValue, dirty, isValid, values }) => (
        <Grid
          sx={{ marginTop: "70px", marginBottom: { md: 2, sm: 10, xs: 10 } }}
        >
          <Box
            sx={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Typography variant="h5">Post Lodge</Typography>
          </Box>

          <Form>
            <Box
              sx={{ padding: "10px", display: { sm: "column", md: "flex" } }}
            >
              <Box flex={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      name="title"
                      type="string"
                      as={TextField}
                      variant="outlined"
                      label="Title"
                      fullWidth
                      error={Boolean(errors.title) && Boolean(touched.title)}
                      helperText={Boolean(touched.title) && errors.title}
                    />
                    <Box height={14} />
                  </Grid>

                  <Grid item xs={6} sx={{ marginRight: { sm: 1, md: 1 } }}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="lodgeType">Lodge Type</InputLabel>
                      <Field
                        name="type"
                        type="string"
                        as={Select}
                        variant="outlined"
                        label="Lodge Type"
                        fullWidth
                        error={Boolean(errors.type) && Boolean(touched.type)}
                        // helperText={Boolean(touched.type) && errors.type}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="Single_room">Single Room</MenuItem>
                        <MenuItem value="Self_contained">
                          Self Contained
                        </MenuItem>
                        <MenuItem value="Room_in_a_flat">
                          Room In A Flat
                        </MenuItem>
                      </Field>
                      <ErrorMessage
                        name="type"
                        component="div"
                        style={{ color: "#ff8080" }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={5.8} sx={{}}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="leaseTerms">Lease Terms</InputLabel>
                      <Field
                        name="leaseTerms"
                        type="string"
                        as={Select}
                        variant="outlined"
                        label="Lease Terms"
                        fullWidth
                        error={
                          Boolean(errors.leaseTerms) &&
                          Boolean(touched.leaseTerms)
                        }
                        // helperText={Boolean(touched.leaseTerms) && errors.leaseTerms}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="Direct_brief">Direct Brief</MenuItem>
                        <MenuItem value="Semi_direct_brief">
                          Semi Direct Brief
                        </MenuItem>
                      </Field>
                      <ErrorMessage
                        name="leaseTerms"
                        component="div"
                        style={{ color: "#ff8080" }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sx={{ marginTop: "5px" }}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="location">Lodge Location</InputLabel>
                      <Field
                        name="location"
                        type="string"
                        as={Select}
                        variant="outlined"
                        label="Lodge Location"
                        fullWidth
                        error={
                          Boolean(errors.location) && Boolean(touched.location)
                        }
                        // helperText={Boolean(touched.location) && errors.location}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="Maryland">Maryland</MenuItem>
                        <MenuItem value="College-Road">College Road</MenuItem>
                        <MenuItem value="Nkpokiti">Nkpokiti</MenuItem>
                        <MenuItem value="Kenyetta">Kenyetta</MenuItem>
                        <MenuItem value="Lomalinda">Lomalinda</MenuItem>
                        <MenuItem value="Monarch">Monarch</MenuItem>
                      </Field>
                      <ErrorMessage
                        name="location"
                        component="div"
                        style={{ color: "#ff8080" }}
                      />
                      <Box height={14} />
                    </FormControl>
                  </Grid>

                  <Grid item xs={5.8} sx={{ marginRight: { sm: 1, md: 1 } }}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="vacancy">Vacancy Options</InputLabel>
                      <Field
                        name="vacancy"
                        type="string"
                        as={Select}
                        variant="outlined"
                        label="Vacancy Options"
                        fullWidth
                        error={
                          Boolean(errors.vacancy) && Boolean(touched.vacancy)
                        }
                        // helperText={Boolean(touched.vacancy) && errors.vacancy}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="Totally_vacant">
                          Totally vacant
                        </MenuItem>
                        <MenuItem value="Male_roommate">
                          Male roommate needed
                        </MenuItem>
                        <MenuItem value="Female_roommate">
                          Female roommate needed
                        </MenuItem>
                      </Field>
                      <ErrorMessage
                        name="vacancy"
                        component="div"
                        style={{ color: "#ff8080" }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <Field
                      name="rent"
                      type="string"
                      as={TextField}
                      variant="outlined"
                      label="Yearly Rent"
                      fullWidth
                      error={Boolean(errors.rent) && Boolean(touched.rent)}
                      helperText={Boolean(touched.rent) && errors.rent}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      name="initial"
                      type="string"
                      as={TextField}
                      variant="outlined"
                      label="Tot. initial amount"
                      fullWidth
                      error={
                        Boolean(errors.initial) && Boolean(touched.initial)
                      }
                      helperText={Boolean(touched.initial) && errors.initial}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      name="description"
                      type="string"
                      as={TextField}
                      variant="outlined"
                      label="Lodge Description"
                      fullWidth
                      multiline
                      error={
                        Boolean(errors.description) &&
                        Boolean(touched.description)
                      }
                      helperText={
                        Boolean(touched.description) && errors.description
                      }
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box
                flex={1}
                sx={{ marginLeft: { xs: 0, sm: 0, md: 1 }, marginTop: 2 }}
              >
                <Typography variant="body6">
                  Images:{" "}
                  <span style={{ color: "gray" }}>
                    the first image will be the cover(max. 5)
                  </span>{" "}
                </Typography>

                <Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <input
                      name="lodgeImages"
                      onChange={(e) => setFiles(e.target.files)}
                      type="file"
                      id="images"
                      accept="image/*"
                      multiple
                      style={{}}
                      error={
                        Boolean(errors.lodgeImages) &&
                        Boolean(touched.lodgeImages)
                      }
                      helperText={
                        Boolean(touched.lodgeImages) && errors.lodgeImages
                      }
                    />

                    <Button
                      disabled={uploading}
                      onClick={(e) =>
                        handleImageSubmit(
                          e,
                          setFieldValue,
                          values.lodgeImages,
                          values
                        )
                      }
                    >
                      {uploading ? "uploading..." : "upload"}
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {values.lodgeImages.length > 0 &&
                      values.lodgeImages.map((url, index) => (
                        <Grid
                          key={url}
                          sx={{
                            padding: 3,
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <img
                            style={{ width: "50px", height: "50px" }}
                            src={url}
                            alt="lodge image"
                          />
                          <Button
                            sx={{ color: "#ff8080" }}
                            onClick={() =>
                              handleDeleteImage(index, values, setFieldValue)
                            }
                          >
                            Delete
                          </Button>
                        </Grid>
                      ))}

                    <Typography sx={{ color: "#ff8080" }}>
                      {imageUploadError && imageUploadError}
                      <ErrorMessage
                        name="lodgeImages"
                        component="div"
                        style={{ color: "#ff8080" }}
                      />
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!dirty || !isValid || loading}
            >
              {loading ? "Loading..." : "Post Lodge"}
            </Button>

            {error && (
              <Box sx={{ color: "red", marginTop: "10px" }}>{error}</Box>
            )}
          </Form>
        </Grid>
      )}
    </Formik>
  );
}

export default PostLodge;
