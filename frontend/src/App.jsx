import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/auth";
import RouteProtected from "./components/routeProtect/RouteProtect";
import { AuthContext } from "./context/authContext";
import InstructorDashBoard from "./pages/instruct/InstructorDashBoard";
import CommonLayout from "./components/studentView/CommonLayout";
import Home from "./pages/student/Home";

const App = () => {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <RouteProtected
            element={<Auth />}
            authenticate={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      <Route
        path="instructor"
        element={
          <RouteProtected
            element={<InstructorDashBoard />}
            authenticate={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      <Route
        path="/"
        element={
          <RouteProtected
            element={<CommonLayout />}
            authenticate={auth?.authenticate}
            user={auth?.user}
          />
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="home" element={<Home />} />

      </Route>
    </Routes>
  );
};

export default App;
