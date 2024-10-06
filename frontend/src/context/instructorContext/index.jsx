import { courseLandingInitialFormData } from "@/config";
import { createContext, useState } from "react";

export const InstructorContext = createContext(null);

export default function InstructorProvider({ children }) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  );
//   console.log(courseLandingFormData);

  return (
    <InstructorContext.Provider
      value={{ courseLandingFormData, setCourseLandingFormData }}
    >
      {children}
    </InstructorContext.Provider>
  );
}
