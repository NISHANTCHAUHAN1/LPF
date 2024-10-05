import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { registerService } from "@/services";
import { createContext, useState } from "react";
export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);

  const handleRegister = async(e) => {
    e.preventDefault();
    const data = await registerService(signUpFormData);
    console.log(data);
  }

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
