import { Button, Box, Grid, TextField, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { object, string } from "yup";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import OAuth from "../components/OAuth";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

const initialValues = {
  username: "",
  email: "",
  password: "",
};

export default function SignUp() {
  //via functionality now
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  return (
    <Grid
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: { xs: "10px", sm: "30px" },
         marginTop: 10, marginBottom: 5
      }}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, formikHelpers) => {
          //real sign up functionality proper
          setLoading(true);
          setError("");

          try {
            // Replace the API_URL with your actual backend API URL
            const response = await fetch("/api/auth/SignUp", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            });

            const responseData = await response.json();

            if (responseData.success === false) {
              setError(responseData.message || "Failed to sign up");
            } else {
              // Redirect to the home page upon successful signup
              console.log(responseData);
              navigate("/sign-in");
            }
          } catch (error) {
            setError("Failed to sign up. Please try again later.");
          } finally {
            setLoading(false);
            formikHelpers.resetForm();
          }

          // console.log(values)
          // formikHelpers.resetForm();
        }}
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
        {({ errors, isValid, touched, dirty }) => (
          <Form>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: { xs: "80vw", sm: "50vw" },
                marginTop: { xs: "20px", sm: "0px" },
              }}
            >
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
                disabled={!dirty || !isValid || loading}
              >
                {loading ? "Loading..." : "Sign Up"}
              </Button>

              <Divider sx={{ marginTop: "10px", marginBottom: "10px" }}>
               {/* <Chip label="OR" size="small" /> */}
               OR
              </Divider>

              <OAuth />

              {error && (
                <Box sx={{ color: "red", marginTop: "10px" }}>{error}</Box>
              )}
            </Box>
            <Link to={"/sign-in"}>
              <Typography sx={{ marginTop: "10px" }}>
                Have an Account? Sign In
              </Typography>
            </Link>
          </Form>
        )}
      </Formik>
    </Grid>
  );
}
