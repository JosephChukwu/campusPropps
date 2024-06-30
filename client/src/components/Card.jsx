import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import { useTheme } from "@mui/material/styles";
import FavoriteButton from "./FavoriteButton";
import { Link } from "react-router-dom";

const Card = ({ lodgeId, lodge, currentUser }) => {
  const theme = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.favorites.includes(lodgeId)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [currentUser, lodgeId]);

  return (
    <main
    // // flex={3}
    //   sx={{
    //     height: "100%",
    //     width: "100%",
    //     marginBottom: "5vh",
    //     // overflow: "hidden", // Ensure content doesn't overflow
    //   }}
    >
      <Box
        overflow={""}
        sx={{
          height: "60vh",
          width: "100%",
          marginBottom: "5vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Topmost part of the card */}
        <Grid sx={{ display: "flex", alignItems: "center" }}>
          <img
            src={lodge.creator.profileimage}
            alt="agent image"
            style={{
              height: "50px",
              width: "50px",
              borderRadius: "50px",
            }}
          />
          <Box>
            <Typography>{lodge.creator.username}</Typography>
            <Typography>{lodge.createdAt}</Typography>
          </Box>
        </Grid>

        {/* Image slider */}
        <Grid
          sx={{
            width: { md: "30vw", sm: "100%", xs: "100vw" },
            position: "relative",
          }}
        >
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={1}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            style={{
              width: "100%",
              height: "60vh",
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

          <div
            style={{
              position: "absolute",
              top: "5px",
              right: "10px",
              zIndex: 5,
              border: "0px black",
              borderRadius: "50px",
              // height: "20px",
              // width: "20px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <FavoriteButton
              isFavorite={isFavorite}
              setIsFavorite={setIsFavorite}
              lodgeId={lodgeId}
              currentUser={currentUser}
            />
          </div>

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
          <Typography
            sx={{
              position: "absolute",
              top: "5px",
              left: "5px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
              zIndex: 5,
            }}
          >
            {lodge.type}
          </Typography>
          <Typography
            sx={{
              position: "absolute",
              top: "40px",
              left: "5px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
              zIndex: 5,
            }}
          >
            {lodge.location}
          </Typography>
        </Grid>

        {/* titlwe and rent them*/}
        <Link
          to={`/LodgePage/${lodge._id}`}
          style={{ textDecoration: "none", color: "white" }}
        >
          <Grid sx={{ width: { md: "30vw", sm: "100%", xs: "100vw" } }}>
            <Typography variant="h6">{lodge.title}</Typography>
            <Grid
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
          </Grid>
        </Link>
      </Box>
    </main>
  );
};

export default Card;





