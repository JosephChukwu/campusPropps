import { Box, Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FullScreenLoader from "../components/FullScreenLoader";
import Card from "../components/Card";
// import CustomCard from "../components/Card";
import { useTheme } from "@mui/material/styles";
import CardSkeleton from "../components/CardSkeleton";




export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const [lodges, setLodges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();

  useEffect(() => {
    const fetchLodge = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/lodge/allLodges/`);
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          setError(data.message);
          return;
        } else {
          setLoading(false);
          setLodges(data.lodges);
          console.log(data.lodges);
          setError(false);
        }
      } catch (error) {
        setError(error.message);
        console.log(error.message);
        setLoading(false);
      }
    };

    fetchLodge();
  }, []);

  const memoizedLodges = useMemo(() => lodges, [lodges]);

  return (
    <Grid
    container
    sx={{
      width: "100%",
      height: "100%",
      // maxWidth: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      marginTop: { xs: "0vh", sm: "20px", md: "10vh" },
      marginBottom: { xs: "15vh", sm: "70px", md: "30vh" },
      // gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
    }}
  >
      <Typography variant="h5" color={theme.palette.primary.main}>
        All available lodges
      </Typography>


      {error && (
        <Typography color="red">
          Something went wrong; check lodgeId or internet
        </Typography>
      )}



<Grid container spacing={{xs: "0", md: "180"}} sx={{
  width: "100%",
  maxWidth: "100%",
  marginBottom: {xs: "0", md: "20vh"}
// height: "100%"
}}>

{loading &&         <CardSkeleton cards={10}/>      }



      {memoizedLodges &&
      !loading &&
      !error &&
        memoizedLodges.map((lodge) => (
          // <Grid spacing={2} container sx={{display: "flex", justifyContent: "space-between", my: "90px", flexWrap: "wrap", flexDirection: "row"}}>
          <Grid item xs={12} sm={6} md={5.5} key={lodge._id} sx={{  marginBottom: {md: "0", xs: "23vh"}
        }}>

            <Card
              lodge={lodge}
              lodgeId={lodge._id}
              currentUser={currentUser}
            />
          </Grid>
          // </Grid>
        ))}
        </Grid>
    </Grid>
  );
}
