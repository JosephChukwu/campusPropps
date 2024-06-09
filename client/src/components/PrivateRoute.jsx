import { useSelector } from "react-redux";
import { Outlet, Navigate } from 'react-router-dom';


function PrivateRoute() {
    const { currentUser } = useSelector((state) => state.user);


  return (
    //check if the currentuser availanle dy exist, if not redirect the person make him go dign in
    currentUser ? <Outlet/> : <Navigate to='/sign-in' />
)
}

export default PrivateRoute