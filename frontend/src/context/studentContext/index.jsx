import { createContext, useState } from "react";

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <StudentContext.Provider
      value={{
        studentViewCoursesList,
        setStudentViewCoursesList,
        loading,
        setLoading,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
