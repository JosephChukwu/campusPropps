import { Button, Box, Grid, TextField, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { object, string } from "yup";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  signOutStart,
  signOutFailure,
  signOutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const dispatch = useDispatch();

  const [loaading, setLoaading] = useState(false);
  const [errror, setErrror] = useState("");
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);

  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [userLodges, setUserLodges] = useState([]);

  const [myLodgeError, setMyLodgeError] = useState(false);

  //iniyal values for the form
  const initialValues = {
    username: currentUser.username || "",
    email: currentUser.email || "",
    password: "",
    profileimage: currentUser.profileimage || "",
  };

  // State for file upload
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);

  //getting the img after uploading so to assign it as src for teh avatr
  const [avatarSrc, setAvatarSrc] = useState(currentUser.profileimage);

  // Handle file upload if we have an image
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file, setFieldValue) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
        // console.log("Upload progress:", progress); // Log the progress
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Update the Formik form with the download URL
          setFieldValue("profileimage", downloadURL);
          setAvatarSrc(downloadURL);

          console.log(downloadURL);
        });
      }
    );
  };

  //handle signout
  const handleSignout = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/auth/signout");
      const responseData = await res.json();
      if (responseData.success === false) {
        dispatch(signOutFailure(responseData.message));
        return;
      }
      dispatch(signOutSuccess(responseData));
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  const handleMyLodges = async () => {
    try {
      setMyLodgeError(false);

      const res = await fetch(`/api/user/agentLodges/${currentUser._id}`);
      const responseData = await res.json();
      if (responseData.success === false) {
        setMyLodgeError(responseData);
        return;
      } else {
        // console.log(responseData);
        setUserLodges(responseData);
      }
    } catch (error) {
      setMyLodgeError(true);
    }
  };

  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: { xs: "10px", sm: "30px" },
        marginTop: 10,
        marginBottom: 5
      }}
    >
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: { xs: "10px", sm: "30px" },
        }}
      >
        <Typography
          fontSize={{
            lg: 35,
            md: 30,
            sm: 25,
            xs: 20,
          }}
        >
          Profile
        </Typography>

        <Avatar
          onClick={() => fileRef.current.click()}
          alt="Profile"
          src={avatarSrc}
          sx={{
            width: 100,
            height: 100,
            marginTop: "10px",
            marginBottom: "10px",
            cursor: "pointer",
          }}
        />

        <Grid>
          {fileUploadError ? (
            <Typography sx={{ color: "FF474Ced" }}>
              Error uploading image
            </Typography>
          ) : filePerc > 0 && filePerc < 100 ? (
            <Typography
              sx={{ color: "#46c4bd" }}
            >{`Uploading ${filePerc}%`}</Typography>
          ) : filePerc === 100 ? (
            <Typography sx={{ color: "#46c4bd" }}>
              Image successfully uploaded!
            </Typography>
          ) : (
            ""
          )}
        </Grid>
      </Grid>

      <Formik
        initialValues={initialValues}
        //Submitting the form
        onSubmit={async (values, formikHelpers) => {
          setLoaading(true);
          setErrror("");

          try {
            dispatch(updateUserStart());
            const response = await fetch(
              `/api/user/updateUser/${currentUser._id}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
              }
            );
            console.log(values);

            const responseData = await response.json();

            if (responseData.success === false) {
              dispatch(updateUserFailure(responseData.message));
              setErrror(responseData.message || "Failed to sign up");
            } else {
              dispatch(updateUserSuccess(responseData));
              setUpdateSuccess(true);
              console.log(responseData);
            }
          } catch (error) {
            dispatch(updateUserFailure(error.message));
            setErrror("Failed to Update profile. Please try again later.");
          } finally {
            setLoaading(false);
            formikHelpers.resetForm();
          }
        }}
        //Validation using the yup object and string
        validationSchema={object({
          username: string()
            .required("please enter your username")
            .min(5, "username is too short")
            .matches(/^\S*$/, "Username cannot contain spaces"),
          email: string()
            .required("please enter your email")
            .email("Invaid email"),
          password: string()
            .required("please enter your password")
            .min(6, "password is too short")
            .matches(/^\S*$/, "Password cannot contain spaces"),
        })}
      >
        {({ errors, isValid, touched, dirty, setFieldValue }) => (
          <Form
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: { xs: "20px", sm: "0px" },
                width: { xs: "80vw", sm: "50vw" },
              }}
            >
              <input
                name="profileimage"
                type="file"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  handleFileUpload(e.target.files[0], setFieldValue);
                }}
                ref={fileRef}
                hidden
                accept="image/*"
              />

              <Field
                name="username"
                type="string"
                as={TextField}
                variant="outlined"
                label="Username"
                fullWidth
                error={Boolean(errors.username) && Boolean(touched.username)}
                helperText={Boolean(touched.username) && errors.username}
              />

              <Box height={14} />
              <Field
                name="email"
                type="email"
                as={TextField}
                variant="outlined"
                label="Email"
                fullWidth
                error={Boolean(errors.email) && Boolean(touched.email)}
                helperText={Boolean(touched.email) && errors.email}
              />
              <Box height={14} />

              <Field
                name="password"
                type="password"
                as={TextField}
                variant="outlined"
                label="Password"
                fullWidth
                error={Boolean(errors.password) && Boolean(touched.password)}
                helperText={Boolean(touched.password) && errors.password}
              />
              <Box height={16} />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!dirty || !isValid || loaading}
              >
                {loaading ? "Loading..." : "Update Profile"}
              </Button>

              {currentUser.role === "Agent" && (
                <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Link to="/PostLodge">
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        marginTop: "10px",
                        backgroundColor: "#46c4bd",
                        "&:hover": {
                          backgroundColor: "#46c4bd",
                        },
                      }}
                    >
                      post lodge
                    </Button>
                  </Link>

                  <Button
                    onClick={handleMyLodges}
                    variant="contained"
                    size="large"
                    sx={{
                      marginTop: "10px",
                      backgroundColor: "#46c4bd",
                      "&:hover": {
                        backgroundColor: "#46c4bd",
                      },
                    }}
                  >
                    my lodges
                  </Button>
                  <Typography sx={{ color: "#FF474Ced", marginTop: "10px" }}>
                    {myLodgeError ? "Error showing lodges!" : ""}
                  </Typography>
                </Grid>
              )}

              <Button
                variant="contained"
                size="large"
                onClick={handleSignout}
                sx={{
                  marginTop: "10px",
                  backgroundColor: "#FF474Ced",
                  "&:hover": {
                    backgroundColor: "#FF474Ced",
                  },
                }}
              >
                Sign Out
              </Button>

              {error && (
                <Box sx={{ color: "red", marginTop: "10px" }}>{error}</Box>
              )}
              <Box>
                <Typography sx={{ color: "#46c4bd", marginTop: "10px" }}>
                  {updateSuccess ? "Successfully updated profile!" : ""}
                </Typography>
                {userLodges &&
                  userLodges.length > 0 && 
                  <Grid>
                  <Typography textAlign={"center"} sx={{marginTop: 5}}>Your Lodges</Typography>

                  {userLodges.map((lodge) => (

                    <Grid>
                    <Grid
                      key={lodge._id}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        padding: 1,
                        justifyContent: "space-between",
                      }}
                    >
                      <Link
                        to={`/LodgePage/${lodge._id}`}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          textDecoration: "none",
                          gap: 5,
                        }}
                      >
                        <img
                          style={{
                            height: "70px",
                            width: "70px",
                            margin: "5px",
                          }}
                          src={lodge.lodgeImages[1]}
                          alt={`First Lodge Image of ${lodge._id}`}
                        />
                        <div>
                          <Typography
                            sx={{
                              color: "white",
                              width: "220px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {lodge.title}
                          </Typography>
                        </div>
                      </Link>
                      <Grid sx={{ display: "flex", flexDirection: "column" }}>
                        <Button sx={{ color: "red" }}>delete</Button>
                        <Button>edit</Button>
                      </Grid>
                    </Grid>
                    </Grid>
                  ))}
                  </Grid>}
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Grid>
  );
}
