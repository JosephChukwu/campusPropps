import { Button, Box, Grid, TextField, Typography, Paper } from "@mui/material";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import pose23 from "../assets/Pose23.png";
import FullScreenLoader from "../components/FullScreenLoader";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import Card from "../components/Card";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Search() {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lodges, setLodges] = useState()

  const initialValues = {
    type: "",
    vacancy: "",
    location: "",
    // campus: "UNEC",
  };

  return (
    <>
    <Formik
      initialValues={initialValues}
      // validationSchema={validationSchema}

      //Submitting the form
      onSubmit={async (values, formikHelpers) => {
        setLoading(true);
        setError("");

        try {
          const response = await fetch(
            `/api/lodge/filter?campus=UNEC&location=${values.location}&vacancy=${values.vacancy}&type=${values.type}`,
            
          );
          console.log(values);

          const responseData = await response.json();
          console.log(responseData);

          if (responseData.success === false) {
            setLoading(false);
            setError(
              responseData.message || "Failed to get lodge, please try again"
            );

          } else if (responseData.length < 1) {
            setLoading(false);
            setError("Ooops, no lodges matched your search criteria");

          } else {
            setLodges(responseData);
            console.log(responseData);

          }
        } catch (error) {
          setError(error.message);
          console.log(error.message);
        } finally {
          setLoading(false);
          // formikHelpers.resetForm();
        }
      }}
    >
      {({ touched, setFieldValue, dirty, isValid, values }) => (
        <Grid
          sx={{
            // display: "flex",
            // flexDirection: "column",
            // alignItems: "center",
            paddingTop:{xs: 5, md: 10},
            // marginBottom: 20,
            height: "100%",
            width: "100%",
            // marginTop: "70px",
            marginBottom: { md: 55, sm: 0, xs: 80 },
            backgroundImage: `url(${pose23})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "contain",
            backgroundAttachment: "fixed",
          }}
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
            <Typography variant="h5">Search for Lodge</Typography>
          </Box>

          <Form>
            <Box
              sx={{ padding: "10px", display: { sm: "column", md: "flex" }, }}
            >
              <Box flex={6}>
                <Grid container spacing={2}>
                  <Grid item xs={4} sx={{ marginRight: { sm: 1, md: 0 } }}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="Type">Type</InputLabel>
                      <Field
                        name="type"
                        type="string"
                        as={Select}
                        variant="outlined"
                        label="Type"
                        fullWidth
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
                    </FormControl>
                  </Grid>

                  <Grid item xs={4}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="location">Location</InputLabel>
                      <Field
                        name="location"
                        type="string"
                        as={Select}
                        variant="outlined"
                        label="Location"
                        fullWidth
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
                    </FormControl>
                  </Grid>

                  <Grid item xs={4} sx={{ marginRight: { sm: 1, md: 0 } }}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="vacancy">Vacancy</InputLabel>
                      <Field
                        name="vacancy"
                        type="string"
                        as={Select}
                        variant="outlined"
                        label="Vacancy"
                        fullWidth
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
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!dirty || !isValid || loading}
            >
              {loading ? "Loading..." : "Search"}
            </Button>

            {error && (
              <Box sx={{ color: "red", marginTop: "10px" }}>{error}</Box>
            )}
          </Form>


          {loading && <FullScreenLoader loading={loading} />}

   
    <Grid container spacing={{ xs: "0", md: "180" }} sx={{display:"flex",alignItems: "center",}}>
      {lodges && !loading && !error && lodges.map((lodge) => (
        <Grid item xs={12} sm={6} md={5.5} key={lodge._id} sx={{ marginBottom: { md: "0", xs: "23vh" }, marginTop: "10vh"}}>
          <Card
            lodge={lodge}
            lodgeId={lodge._id}
            currentUser={currentUser}
          />
        </Grid>
      ))}
    </Grid>


        </Grid>
      )}
    </Formik>

    
    

    </>
  );
}

export default Search;
