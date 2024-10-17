import { createContext, useState } from "react";

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [studentCourseList, setStudentCourseList] = useState([]);

  return (
    <StudentContext.Provider
      value={{ studentCourseList, setStudentCourseList }}
    >
      {children}
    </StudentContext.Provider>
  );
}
