import React from "react";

const StudentCoursePage = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5"></div>
    </div>
  );
};

export default StudentCoursePage;
