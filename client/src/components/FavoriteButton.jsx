// FavoriteButton.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
} from "../redux/user/userSlice";

const FavoriteButton = ({ lodgeId, setIsFavorite, isFavorite, currentUser }) => {
  // const { currentUser } = useSelector((state) => state.user);
  // const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      return navigate("/sign-in");
    }

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/addToFave/${lodgeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: currentUser.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateUserFailure(data.message));
        throw new Error(`Error ${res.status}: ${data.message}`);
      }

      if (data.updatedUser) {
        setIsFavorite((prev) => !prev);
        console.log(data.updatedUser);
        dispatch(updateUserSuccess(data.updatedUser));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.favorites.includes(lodgeId)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [currentUser, lodgeId]);

  return (
    <IconButton
      onClick={handleToggleFavorite}
    >
      <FavoriteIcon sx={{ color: isFavorite ? "red" : "default" }} />
    </IconButton>
  );
};

export default FavoriteButton;
