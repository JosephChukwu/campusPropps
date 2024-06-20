import { Box, Divider, Grid, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FullScreenLoader from "../components/FullScreenLoader.jsx";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShareIcon from "@mui/icons-material/Share";
import IconButton from "@mui/material/IconButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import NightShelterIcon from "@mui/icons-material/NightShelter";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
} from "../redux/user/userSlice";
import FavoriteButton from "../components/FavoriteButton.jsx";



function LodgePage() {
  // SwiperCore.use([Navigation, Pagination, Scrollbar]);
  const { currentUser } = useSelector((state) => state.user);
  const [lodge, setLodge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const params = useParams();
  const dispatch = useDispatch();

  // //
  // const handleToggleFavorite = async () => {
  //   const user = await currentUser;
  //   if (!user) {
  //     return navigate("/sign-in");
  //   }

  //   try {
  //     dispatch(updateUserStart());

  //     const res = await fetch(`/api/user/addToFave/${params.lodgeId}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email: currentUser.email }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       dispatch(updateUserFailure(data.message));

  //       const errorText = await res.text();
  //       throw new Error(`Error ${res.status}: ${errorText}`);
  //     }

  //     if (data.updatedUser) {
  //       setIsFavorite((prev) => !prev);
  //       dispatch(updateUserSuccess(data.updatedUser));

  //       console.log(data.updatedUser);
  //     }
  //   } catch (error) {
  //     console.error("Error toggling favorite:", error);
  //   }
  // };

  // const checkFav = () => {
  //   if (currentUser && currentUser.favorites.includes(params.lodgeId)) {
  //     console.log(currentUser.favorites);
  //     setIsFavorite(true);
  //   } else {
  //     setIsFavorite(false);

  //   }
  // }

  useEffect(() => {
    //   const checkFav = async() => {

    // }

    const fetchLodge = async () => {
      try {
        setLoading(true);


        if (currentUser) {
          const fav = await currentUser.favorites;
          if (fav.includes(params.lodgeId)) {
            console.log(currentUser.favorites);
            setIsFavorite(true);
        }
        } else {
          setIsFavorite(false);
        }

        const res = await fetch(`/api/lodge/singleLodge/${params.lodgeId}`);
        const data = await res.json();
        console.log(data);
        if (data.success === false) {
          setLoading(false);
          setError(data);
          return;
        } else {
          setLoading(false);

          setLodge(data);
          setError(false);
        }

      
      } catch (error) {
        setError(error.message);
        console.log(error.message);
        setLoading(false);
      }
    };

  
    fetchLodge();
  }, [params.lodgeId]);

  return (
    <Grid
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        // position: "relative",
        marginTop: { xs: "43vh", sm: "20px", md: "10vh" },
        marginBottom: { xs: "45vh", sm: "70px", md: "30vh" },
        // height: "100vh"
      }}
    >
      <Typography variant="h5" color={theme.palette.primary.main}>
        Lodge Details
      </Typography>
      {loading && <FullScreenLoader loading={loading} />}

      {error && (
        <Typography color="red">
          Something went wrong; check lodgeId or internet
        </Typography>
      )}

      <Grid
        container
        sx={{ display: { md: "flex", sm: "column", xs: "column" } }}
      >
        <Box flex={3}>
          {lodge && !loading && !error && (
            <Grid
              sx={{ width: { sm: "100vw", md: "65vw" }, position: "relative" }}
            >
              <Grid sx={{ width: { md: "65vw", sm: "100vw", xs: "100vw" } }}>
                <Swiper
                  modules={[Navigation, Pagination, Scrollbar, A11y]}
                  spaceBetween={50}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  scrollbar={{ draggable: true }}
                  style={{
                    width: "100%",
                    height: "80vh",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "5px",
                  }}
                >
                  {lodge.lodgeImages.map((imageUrl, index) => (
                    <SwiperSlide
                      key={index}
                      style={{
                        background: `url(${imageUrl}) no-repeat center center / cover`,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    ></SwiperSlide>
                  ))}
                </Swiper>
              </Grid>

              <Typography
                sx={{
                  position: "absolute",
                  bottom: "5px",
                  left: "5px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  zIndex: 5,
                }}
              >
                {lodge.leaseTerms}
              </Typography>
             
              <div style={{
                position: "absolute",
                top: "5px",
                right: "60px",
                zIndex: 5,
                border: "0px black",
                borderRadius: "50px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}>
                <FavoriteButton  
                isFavorite={isFavorite}
                setIsFavorite={setIsFavorite}
                lodgeId={params.lodgeId}
                currentUser={currentUser}/>
                </div>

              <IconButton
                sx={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  zIndex: 5,
                  border: "1px solid black",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <ShareIcon variant="Outlined" sx={{ color: "" }} />
              </IconButton>

              <Typography
                sx={{
                  position: "absolute",
                  bottom: "5px",
                  right: "5px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  zIndex: 5,
                }}
              >
                {lodge.vacancy}
              </Typography>

              <Grid sx={{ paddingTop: "0px", position: "absolute" }}>
                <Typography variant="h5" sx={{}}>
                  {lodge.title}
                </Typography>
                <Grid>
                  <Grid
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: { md: "40vw" },
                      my: 2,
                    }}
                  >
                  <Box>
                  <Typography variant="body1">{lodge.initial}</Typography>
                  <hr
                    style={{
                      width: `${lodge.initial.toString().length * 8}px`,
                      borderColor: theme.palette.primary.main,
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    color={theme.palette.primary.main}
                  >
                    Initial
                  </Typography>
                </Box>

                    <Box>
                      <Typography variant="body1">{lodge.rent}</Typography>
                      <hr
                        style={{
                          width: `${lodge.rent.toString().length * 8}px`,
                          borderColor: theme.palette.primary.main,
                        }}
                      />
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        color={theme.palette.primary.main}
                      >
                        Rent
                      </Typography>
                    </Box>

                   

                  </Grid>

                  <Grid
                    sx={{
                      width: { md: 1, xs: "100vw", sm: "100vw" },
                      height: {
                        xs: `${Math.ceil(
                          (lodge.description.length * 0.1) / 0
                        )}vh`,
                        md: `${Math.ceil(
                          (lodge.description.length * 0.1) / 0
                        )}vh`,
                        sm: `${Math.ceil(
                          (lodge.description.length * 0.5) / 2
                        )}vh`,
                      },
                      border: "1px solid",
                      borderColor: theme.palette.primary.main,
                      marginBottom: "50px",
                    }}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        color: theme.palette.primary.main,
                      }}
                    >
                      Description
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: "16px", lineHeight: "1.5", p: 0, m: 0 }}
                    >
                      {lodge.description}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* the second part of the lodge page thatshos at teh bottom in xs screen  */}

        {lodge && !loading && !error && (
          <Box flex={2}>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { md: "column", sm: "row", xs: "column" },
                  marginTop: { md: 0, sm: "30vh", xs: "30vh" },
                  justifyContent: "space-between",
                  padding: { md: "10px" },
                  gap: { md: "10px" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: { xs: "column", sm: "column" },
                  }}
                >
                  <Typography sx={{ display: "flex", alignItems: "center" }}>
                    <NightShelterIcon
                      sx={{ color: theme.palette.primary.main }}
                    />
                    {lodge.type}
                  </Typography>

                  <Grid sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOnIcon
                      sx={{ color: theme.palette.primary.main }}
                    />
                    <Typography>{lodge.location}</Typography>
                  </Grid>
                </Box>

                <Box
                  sx={{
                    height: "40vh",
                    width: "100%",
                    border: "1px solid #071011",
                    backgroundColor: "#0c1a1d",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography>Agent</Typography>
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                      margin: "5px",
                      gap: "5px",
                    }}
                  >
                    <img
                      src={lodge.creator.profileimage}
                      alt="agent image"
                      style={{
                        height: "70px",
                        widht: "110px",
                        borderRadius: "20px",
                      }}
                    />
                    <Typography>{lodge.creator.username}</Typography>
                    <Typography>{lodge.creator.email}</Typography>
                    <Typography>
                      {lodge.creator.phone ? lodge.creator.phone : ""}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    height: "5vh",
                    width: "100%",
                    backgroundColor: "#00feb2",
                  }}
                >
                  <Typography>{lodge.createdAt}</Typography>
                </Box>
                <Button
                  sx={{
                    height: "9vh",
                    width: "100%",
                    backgroundColor: "#00feb2",
                    color: "black",
                  }}
                >
                  contact Agent
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}

export default LodgePage;