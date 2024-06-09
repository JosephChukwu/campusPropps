import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile"
import Search from "./pages/Search"
import Favorites from "./pages/Favorites"
import SignUp from "./pages/SignUp";
import PostLodge from "./pages/PostLodge";
import Booked from "./pages/Booked";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Header from "./components/Header";
import BottomTabNav from "./components/BottomTabNav";
import SideBar from "./components/SideBar";
import FAQs from "./pages/FAQs";
import { Stack } from "@mui/material";
import PrivateRoute from "./components/PrivateRoute";
import LodgePage from "./pages/LodgePage";

// import React from 'react'

const App = () => {
  return (
    <BrowserRouter>
    <Header />
    <Stack direction={"row"} justifyContent={"space-between"}>
    <SideBar/>
        <div style={{ flex: 4 }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/lodgePage/:lodgeId" element={<LodgePage />} />
           <Route element={<PrivateRoute/>}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/booked" element={<Booked />} />
              <Route path="/postLodge" element={<PostLodge />} />
            </Route>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/search" element={<Search />} />
      </Routes>
      </div>    
      </Stack>
      <BottomTabNav />
    </BrowserRouter>  )
}

export default App;

