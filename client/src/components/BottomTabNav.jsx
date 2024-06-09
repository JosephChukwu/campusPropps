import React, { useState } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import BookmarksRoundedIcon from "@mui/icons-material/BookmarksRounded";
import Box from "@mui/material/Box"; // Import the Box component
import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";

const BottomTabNav = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [value, setValue] = useState("home");
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box  sx={{ display: { sx: "flex", sm: "none", md: "none"},}}>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, width: "100%", zIndex: 10}}
        elevation={3}
      >
        <BottomNavigation
          sx={{
            "& .Mui-selected .MuiBottomNavigationAction-icon": {
              color: "#46c4bd", 
            },
            
          }}
          value={value}
          onChange={handleChange}
        >
          <BottomNavigationAction
            label="Home"
            value="home"
            onClick={() => navigate("/")}
            icon={<HomeRoundedIcon />}
          />
          <BottomNavigationAction
            label="Favorites"
            value="favorites"
            onClick={() => navigate("/Favorites")}
            icon={<FavoriteIcon />}
          />
          <BottomNavigationAction
            label="Search"
            value="search"
            onClick={() => navigate("/Search")}
            icon={<SearchRoundedIcon />}
          />
          <BottomNavigationAction
            label="Booked"
            value="booked"
            onClick={() => navigate("/Booked")}
            icon={<BookmarksRoundedIcon />}
          />
          <BottomNavigationAction
            label="Profile"
            value="profile"
            onClick={() => navigate("/Profile")}
            icon={
              currentUser && currentUser.profileimage ? (
                <img alt="profile" src={currentUser.profileimage} style={{ width: 30, height: 30, borderRadius: 40 }}/>
              ) : (
                <AccountCircleRoundedIcon />
              )
            }
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default BottomTabNav;
