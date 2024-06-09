import { Button, Box, Grid, TextField, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { object, string } from "yup";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import Divider from "@mui/material/Divider";



const initialValues = {
  email: "",
  password: "",
};

export default function SignIn() {
  //via functionality now 
  //commented out  so to use redux stuff
  const { loading, error } = useSelector((state) => state.user);
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();




  return (
    <Grid sx={{ display: "flex", justifyContent: "center", padding: {xs: "10px", sm: "30px"}, marginTop: 10, marginBottom: 5}}>
      <Formik
        initialValues={initialValues}
        onSubmit={ async (values, formikHelpers) => {
          //real sign up functionality proper

          //using the redux dispatchb method
          dispatch(signInStart());
          // setLoading(true);


          // setError("");

          try {
            // Replace the API_URL with your actual backend API URL
            const response = await fetch('/api/auth/SignIn', {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(values)
            });

          

            const responseData = await response.json();
            
            if (responseData.success === false) {
              //using redux method
              dispatch(signInFailure(responseData.message))
              // setError(responseData.message || "Failed to sign In");
            } else {
              // Redirect to the home page upon successful signin
              console.log(responseData)
              dispatch(signInSuccess(responseData))
              navigate("/");
            }
          } catch (error) {
            dispatch(signInFailure(error.message));
              setError("Failed to sign in. Please check your internet and try again later.");
          } finally {
            // dispatch(signInFailure());
            // setLoading(false);
            formikHelpers.resetForm();
          }





          // console.log(values)
          // formikHelpers.resetForm();
        }}
        validationSchema={object({
          email : string().required("please enter your email").email("Invaid email"),
          password : string().required("please enter your password").min(6, "password is too short").matches(/^\S*$/, "Password cannot contain spaces"),
        })}
      >
       {({errors, isValid, touched, dirty}) => ( 
          <Form>
            <Box
              sx={{ display: "flex", flexDirection: "column", width: {xs: "80vw", sm: "50vw"}, marginTop: {xs: "20px", sm: "0px"} }}
            >
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

              <Button type="submit" variant="contained" size="large"
              disabled={!dirty || !isValid || loading}
              >
              {loading ? "Loading..." : "Sign In"}
              </Button>

              <Divider sx={{ marginTop: "10px", marginBottom: "10px" }}>
               {/* <Chip label="OR" size="small" /> */}
               OR
              </Divider>
              <OAuth/>

              {error && <Box sx={{color: "red", marginTop: "10px"}}>{error}</Box>}

            </Box>
            <Link to={"/sign-up"}>
              <Typography sx={{marginTop: "10px"}}>Don't have an Account? Sign Up</Typography>
          </Link>
          </Form>
         )} 
      </Formik>
    </Grid>
  );
}


