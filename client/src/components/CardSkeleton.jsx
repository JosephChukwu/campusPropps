import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CardSkeleton = ({ cards }) => {
  return (
  
      Array(cards)
        .fill(0)
        .map((_, i) => (
          <Grid
            item
            key={i}
            xs={12}
            sm={6}
            md={5}
            sx={{ marginBottom: { md: "0", xs: "23vh" } }}
          >
            <Box
              sx={{
                height: "60vh",
                width: "100%",
                marginBottom: "3vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Topmost part of the skeleton card */}
              <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Skeleton circle height={50} width={50} />
                <Box>
                  <Skeleton width={100} height={20} />
                  <Skeleton width={80} height={20} />
                </Box>
              </Grid>

              {/* Image slider skeleton */}
              <Grid
                sx={{
                  width: { md: "30vw", sm: "100%", xs: "100vw" },
                  position: "relative",
                }}
              >
                <Skeleton height="60vh" />
                <Skeleton
                  width={100}
                  height={20}
                  style={{ position: "absolute", top: "5px", left: "5px" }}
                />
                <Skeleton
                  width={100}
                  height={20}
                  style={{ position: "absolute", top: "30px", left: "5px" }}
                />
              </Grid>

              {/* Title and rent section */}
              <Grid sx={{ width: { md: "30vw", sm: "100%", xs: "100vw" } }}>
                <Skeleton width="80%" height={30} />
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box>
                    <Skeleton width={60} height={20} />
                  </Box>
                  <Box>
                    <Skeleton width={60} height={20} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ))
    // </Grid>
  );
};

export default CardSkeleton;



