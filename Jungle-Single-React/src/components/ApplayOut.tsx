import { Outlet } from "react-router";
import { UserProvider } from "./userContext";
import Header from "./Header";

const AppLayOut = () => {
    return (
        <UserProvider>
            <Header />
            <Outlet />
        </UserProvider>
    );
};

export default AppLayOut;
