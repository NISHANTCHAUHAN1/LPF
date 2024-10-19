import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/auth";
import RouteProtected from "./components/routeProtect/RouteProtect";
import { AuthContext } from "./context/authContext";
import InstructorDashBoard from "./pages/instruct/InstructorDashBoard";
import CommonLayout from "./components/studentView/CommonLayout";
import Home from "./pages/student/Home";
import NotFound from "./pages/notFound/NotFound";
import AddNewCourse from "./pages/instruct/AddNewCourse";
import StudentCourseView from "./pages/student/StudentCourseView";
import StudentCourseDetails from "./pages/student/StudentCourseDetails";
import PaymentReturnPage from "./pages/student/PaymentReturnPage";
import StudentCoursePage from "./pages/student/StudentCoursePage";

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
        path="/instructor"
        element={
          <RouteProtected
            element={<InstructorDashBoard />}
            authenticate={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      <Route
        path="/instructor/create-new-course"
        element={
          <RouteProtected
            element={<AddNewCourse />}
            authenticate={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      <Route
        path="/instructor/edit-course/:courseId"
        element={
          <RouteProtected
            element={<AddNewCourse />}
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
        <Route path="courses" element={<StudentCourseView />} />
        <Route path="course/details/:id" element={<StudentCourseDetails />} />
        <Route path="payment-return" element={<PaymentReturnPage />} />
        <Route path="student-courses" element={<StudentCoursePage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
