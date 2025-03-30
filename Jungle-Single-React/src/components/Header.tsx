import {  NavLink } from "react-router-dom";
import UserProfil from "./Profil";
import { useContext, useState } from "react";
import { UserContext } from "./userContext";
import Login from "./login";
import Register from "./register";

const Header = () => {
    const [, toUpdate] = useState(false);
    const userContext = useContext(UserContext);

    if (!userContext) {
        throw new Error("UserContext must be used within a UserProvider");
    }

    const { user } = userContext;
    return (
        <>
      
      
            {user?.name ? (
                <UserProfil setUpdate={toUpdate} />
            ) : (
                <div style={{ display: "flex", justifyContent: "space-between", position: "absolute", left: "10px", top: "10px" }}>
                    <Login />
                    <Register/>
            </div>)
}
       
        <nav style={{ padding: 10, background: "#eee", display: "flex", gap: 15, position: "absolute", top: "10px", right: "10px" }}>
        {user?.name && <NavLink to="/mySongs" style={({ isActive }) => ({
               color: isActive ? 'red' : ''})}> השירים שלי </NavLink> }
               {user?.name&&"|"}
         <NavLink to="/songs" style={({ isActive }) => ({
               color: isActive ? 'red' : ''})}>שירים</NavLink>|
         <NavLink to="/newSongs" style={({ isActive }) => ({
               color: isActive ? 'red' : ''})}>מה חדש</NavLink>
         </nav>
         </>

    );
};

export default Header;
