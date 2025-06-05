import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "../models/User";

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

// יצירת קונטקסט עם ערך התחלתי ריק
export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null);
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUserState(JSON.parse(savedUser));
        }
      }, []);
    
      const setUser = (user: User | null) => {
        setUserState(user);
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          localStorage.removeItem("user");
        }
      };
    
    return (
        <UserContext value={{ user, setUser }}>
            {children}
        </UserContext>
    );
};
