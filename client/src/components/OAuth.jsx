import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { Button, Box, Grid, TextField, Typography } from "@mui/material";
import { app } from "../firebase";
import { useDispatch } from 'react-redux';
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from 'react-router-dom';


export default function OAuth() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          profileimage: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/')
    //   console.log(result);
    } catch (error) {
      console.log("cannot sign in with google", error);
    }
  };

  return (
    <Button
      sx={{ backgroundColor: "#FF474C", marginTop: "10px", "&:hover": {
        backgroundColor: "#FF474Ced" }}}
      variant="contained"
      size="large"
      type="button"
      onClick={handleGoogleClick}
    >
      Continue With Google
    </Button>
  );
}
