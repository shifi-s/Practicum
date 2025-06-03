import { Outlet } from "react-router";
import { UserProvider } from "./userContext";
import Header from "./Header";

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
