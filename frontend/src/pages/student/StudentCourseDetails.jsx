import { Skeleton } from "@/components/ui/skeleton";
import { StudentContext } from "@/context/studentContext";
import { fetchStudentViewCourseDetailsService } from "@/services";
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

  // console.log( studentViewCourseDetails);
  
  const { id } = useParams();

  async function fetchStudentViewCourseDetails() {
    const response = await fetchStudentViewCourseDetailsService(currentCourseDetailsId);
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
    if(currentCourseDetailsId !== null) {
      fetchStudentViewCourseDetails(currentCourseDetailsId);
    }
  },[currentCourseDetailsId])

  useEffect(() => {
    if(id) {
      setCurrentCourseDetailsId(id);
    }
  },[id])

  if (loading) return <Skeleton />;
  
  return <div>StudentCourseDetails</div>;
};

export default StudentCourseDetails;
