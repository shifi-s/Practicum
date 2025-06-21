import { Outlet } from "react-router";
import { UserProvider } from "./userContext";
import Header from "./Header";
import { ModalProvider } from "./modalContext";
import Footer from "./Footer";
// import Footer from "./Footer";
// import { Box } from "@mui/material";

const AppLayOut = () => {
    return (
        // <Box sx={{ margin: 0, padding: 0, width: "100%" }}>
            <UserProvider>
                <ModalProvider>
                    <Header />
                    <Outlet />
                </ModalProvider>
            </UserProvider>
            
        // </Box>
    );
};

export default AppLayOut;