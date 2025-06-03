import { Outlet } from "react-router";
import { UserProvider } from "./userContext";
import Header from "./Header";
import bg from "../assets/bgimg.png";
import { Modal } from "@mui/material";
import { ModalProvider } from "./modalContext";

const AppLayOut = () => {
    return (
        
        <UserProvider>
            <ModalProvider>
            <Header />
            <Outlet />
            </ModalProvider>
        </UserProvider>
        
        
    );
};

export default AppLayOut;
