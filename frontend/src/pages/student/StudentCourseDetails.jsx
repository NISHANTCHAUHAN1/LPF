import { Skeleton } from "@/components/ui/skeleton";
import { StudentContext } from "@/context/studentContext";
import { fetchStudentViewCourseDetailsService } from "@/services";
import { Globe } from "lucide-react";
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

const StudentCourseDetails = () => {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loading,
    setLoading,
  } = useContext(StudentContext);

  console.log(studentViewCourseDetails);

  const { id } = useParams();

  async function fetchStudentViewCourseDetails() {
    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId
    );
    // console.log(response);
    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoading(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentCourseDetailsId !== null) {
      fetchStudentViewCourseDetails(currentCourseDetailsId);
    }
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) {
      setCurrentCourseDetailsId(id);
    }
  }, [id]);

  if (loading) return <Skeleton />;

  return (
    <div className=" mx-auto p-4">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">
          {studentViewCourseDetails?.title}
        </h1>
        <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <span>Created By {studentViewCourseDetails?.instructorName}</span>
          {/* <span>Created On {studentViewCourseDetails?.date.split("T")[0]}</span> */}

          <span className="flex items-center">
            <Globe className="mr-1 h-4 w-4" />
            {studentViewCourseDetails?.primaryLanguage}
          </span>
          <span>
            {studentViewCourseDetails?.students.length}{" "}
            {studentViewCourseDetails?.students.length <= 1
              ? "Student"
              : "Students"}
          </span>
        </div>
      </div>


    </div>
  );
};

export default StudentCourseDetails;
