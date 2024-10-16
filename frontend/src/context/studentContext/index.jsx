import { createContext } from "react";

export const  StudentContext = createContext(null);

export default function StudentProvider({children}) {
    return <StudentContext.Provider>{children}</StudentContext.Provider>
}