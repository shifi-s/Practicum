import { createContext, ReactNode, useState } from "react";
import { User } from "../models/User";

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

// יצירת קונטקסט עם ערך התחלתי ריק
export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext value={{ user, setUser }}>
            {children}
        </UserContext>
    );
};
