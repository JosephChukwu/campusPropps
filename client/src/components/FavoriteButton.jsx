import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { keyframes, styled } from "@mui/system";
import { IconButton } from "@mui/material";

// Define the heartbeat keyframes
const heartbeat = keyframes`
  from {
    transform: scale(1);
    transform-origin: center center;
    animation-timing-function: ease-out;
  }
  10% {
    transform: scale(1.2);
    animation-timing-function: ease-in;
  }
  17% {
    transform: scale(1);
    animation-timing-function: ease-out;
  }
  33% {
    transform: scale(1.2);
    animation-timing-function: ease-in;
  }
  45% {
    transform: scale(1);
    animation-timing-function: ease-out;
  }
`;

// Create a styled IconButton with conditional animation
const AnimatedIconButton = styled(IconButton)(({ isAnimating }) => ({
  ...(isAnimating && {
    // animation: `${heartbeat} 1s`,
    animation: `${heartbeat} 0.7s ease-out`,

  }),
}));

const FavoriteButton = ({
  lodgeId,
  setIsFavorite,
  isFavorite,
  currentUser,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggleFavorite = async () => {

    if (!currentUser) {
      return navigate("/sign-in");
    }

    setIsAnimating(true);


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
        // setTimeout(() => setIsAnimating(false), 1000); // Reset animation state after animation duration
        setTimeout(() => setIsAnimating(false), 2000);
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
    <AnimatedIconButton
      onClick={handleToggleFavorite}
      isAnimating={isAnimating}
    >
      <FavoriteIcon sx={{ color: isFavorite ? "red" : "default" }} />
    </AnimatedIconButton>
  );
};

export default FavoriteButton;