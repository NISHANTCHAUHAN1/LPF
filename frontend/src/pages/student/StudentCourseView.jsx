// student filter page

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/authContext";
import { StudentContext } from "@/context/studentContext";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { ArrowDownUpIcon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const StudentCourseView = () => {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { auth } = useContext(AuthContext);

  function createSearchParamsHelper(filterParams) {
    const queryParams = [];
    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",");

        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }
    return queryParams.join("&");
  }

  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loading,
    setLoading,
  } = useContext(StudentContext);

  // console.log(studentViewCoursesList);

  function handleFilterOnChange(sectionId, option) {
    let updatedFilters = { ...filters };
    if (!updatedFilters[sectionId]) {
      updatedFilters[sectionId] = [option.id];
    } else {
      const optionIndex = updatedFilters[sectionId].indexOf(option.id);
      if (optionIndex === -1) {
        updatedFilters[sectionId].push(option.id);
      } else {
        updatedFilters[sectionId].splice(optionIndex, 1);
      }
    }
    setFilters(updatedFilters);
    sessionStorage.setItem("filters", JSON.stringify(updatedFilters));
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });
    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setLoading(false);
    }
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    try {
      const response = await checkCoursePurchaseInfoService(
        getCurrentCourseId,
        auth?.user?._id
      );

      if (response?.success) {
        if (response?.data) {
          navigate(`/course-progress/${getCurrentCourseId}`);
        } else {
          navigate(`/course/details/${getCurrentCourseId}`);
        }
      } else {
        console.error("Failed to fetch course purchase info.");
      }
    } catch (error) {
      console.error("Error navigating course:", error);
    }
  }

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  console.log(filters);

  return (
    // <div className="container mx-auto p-4">
    //   <h1 className="text-3xl font-bold mb-4">All Courses</h1>
    //   <div className="flex flex-col md:flex-row gap-4">
    //     <aside className="w-full md:w-64 space-y-4">
    //       <div>
    //         {Object.keys(filterOptions).map((ketItem) => (
    //           <div className="p-4 border-b" key={ketItem}>
    //             <h3 className="font-bold mb-3">{ketItem.toUpperCase()}</h3>
    //             <div className="grid gap-2 mt-2">
    //               {filterOptions[ketItem].map((option, index) => (
    //                 <Label
    //                   className="flex font-medium items-center gap-3"
    //                   key={`${ketItem}-${option.id || index}`}
    //                 >
    //                   <Checkbox
    //                     checked={
    //                       filters?.[ketItem]?.includes(option.id) || false
    //                     }
    //                     onCheckedChange={() =>
    //                       handleFilterOnChange(ketItem, option)
    //                     }
    //                   />

    //                   {option.label}
    //                 </Label>
    //               ))}
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </aside>
    //     <main className="flex-1">
    //       <div className="flex justify-end items-center mb-4 gap-5">
    //         <DropdownMenu>
    //           <DropdownMenuTrigger asChild>
    //             <Button
    //               variant="outline"
    //               size="sm"
    //               className="flex  items-center gap-2 p-5"
    //             >
    //               <ArrowDownUpIcon className="h-4 w-4" />
    //               <span className="text-[16px] font-medium ">Sort By</span>
    //             </Button>
    //           </DropdownMenuTrigger>
    //           <DropdownMenuContent align="end" className="w-[180px]">
    //             <DropdownMenuRadioGroup
    //               value={sort}
    //               onValueChange={(value) => setSort(value)}
    //             >
    //               {sortOptions.map((sortItem) => (
    //                 <DropdownMenuRadioItem
    //                   value={sortItem.id}
    //                   key={sortItem.id}
    //                 >
    //                   {sortItem.label}
    //                 </DropdownMenuRadioItem>
    //               ))}
    //             </DropdownMenuRadioGroup>
    //           </DropdownMenuContent>
    //         </DropdownMenu>

    //         <span className="text-sm text-black font-bold">
    //           {" "}
    //           {studentViewCoursesList.length}
    //         </span>
    //       </div>

    //       <div className="space-y-4">
    //         {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
    //           studentViewCoursesList.map((courseItem) => (
    //             <Card
    //               // onClick={() => navigate(`/course/details/${courseItem?._id}`)}
    //               onClick={() => handleCourseNavigate(courseItem?._id)}
    //               className="cursor-pointer"
    //               key={courseItem._id}
    //             >
    //               <CardContent className="flex gap-4 p-4">
    //                 <div className="w-48 h-32 flex-shrink-0">
    //                   <img
    //                     src={courseItem?.image}
    //                     className="w-ful h-full object-cover"
    //                   />
    //                 </div>
    //                 <div className="flex-1">
    //                   <CardTitle className="text-xl mb-2">
    //                     {courseItem?.title}
    //                   </CardTitle>
    //                   <p className="text-sm text-gray-600 mb-1">
    //                     Created By{" "}
    //                     <span className="font-bold">
    //                       {courseItem?.instructorName}
    //                     </span>
    //                   </p>
    //                   <p className="text-[16px] text-gray-600 mt-3 mb-2">
    //                     {`${courseItem?.curriculum?.length} ${
    //                       courseItem?.curriculum?.length <= 1
    //                         ? "Lecture"
    //                         : "Lectures"
    //                     } - ${courseItem?.level.toUpperCase()} Level`}
    //                   </p>
    //                   <p className="font-bold text-lg">
    //                     ${courseItem?.pricing}
    //                   </p>
    //                 </div>
    //               </CardContent>
    //             </Card>
    //           ))
    //         ) : loading ? (
    //           <Skeleton />
    //         ) : (
    //           <div className="text-center">
    //             <img
    //               src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTcKcoquPvJ-O9WfgEYiUF34hYhzaGcrtamQ&s"
    //               alt="No courses"
    //               className="mx-auto mb-4"
    //             />
    //             <h1 className="font-extrabold text-4xl">No Course Found</h1>
    //           </div>
    //         )}
    //       </div>
    //     </main>
    //   </div>
    // </div>

    // chat gpt 
    <div className="container mx-auto p-4">
  <h1 className="text-2xl md:text-3xl font-bold mb-4">All Courses</h1>

  <div className="flex flex-col lg:flex-row gap-6">
    {/* Sidebar */}
    <aside className="w-full lg:w-64 space-y-6">
      <div>
        {Object.keys(filterOptions).map((ketItem) => (
          <div className="p-4 border-b" key={ketItem}>
            <h3 className="font-bold mb-3">{ketItem.toUpperCase()}</h3>
            <div className="grid gap-2 mt-2">
              {filterOptions[ketItem].map((option, index) => (
                <Label
                  className="flex font-medium items-center gap-3"
                  key={`${ketItem}-${option.id || index}`}
                >
                  <Checkbox
                    checked={filters?.[ketItem]?.includes(option.id) || false}
                    onCheckedChange={() =>
                      handleFilterOnChange(ketItem, option)
                    }
                  />
                  {option.label}
                </Label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>

    {/* Main Content */}
    <main className="flex-1">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 px-4 py-2"
            >
              <ArrowDownUpIcon className="h-4 w-4" />
              <span className="text-[16px] font-medium">Sort By</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={(value) => setSort(value)}
            >
              {sortOptions.map((sortItem) => (
                <DropdownMenuRadioItem
                  value={sortItem.id}
                  key={sortItem.id}
                >
                  {sortItem.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="text-sm font-bold text-gray-700">
          {studentViewCoursesList.length} Courses
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
          studentViewCoursesList.map((courseItem) => (
            <Card
              onClick={() => handleCourseNavigate(courseItem?._id)}
              className="cursor-pointer"
              key={courseItem._id}
            >
              <CardContent className="flex gap-4 p-4">
                <div className="w-36 h-24 md:w-48 md:h-32 flex-shrink-0">
                  <img
                    src={courseItem?.image}
                    className="w-full h-full object-cover"
                    alt="Course"
                  />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg md:text-xl mb-2">
                    {courseItem?.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mb-1">
                    Created By{" "}
                    <span className="font-bold">
                      {courseItem?.instructorName}
                    </span>
                  </p>
                  <p className="text-[14px] md:text-[16px] text-gray-600 mt-2 mb-2">
                    {`${courseItem?.curriculum?.length} ${
                      courseItem?.curriculum?.length <= 1
                        ? "Lecture"
                        : "Lectures"
                    } - ${courseItem?.level.toUpperCase()} Level`}
                  </p>
                  <p className="font-bold text-lg">${courseItem?.pricing}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : loading ? (
          <Skeleton />
        ) : (
          <div className="text-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTcKcoquPvJ-O9WfgEYiUF34hYhzaGcrtamQ&s"
              alt="No courses"
              className="mx-auto mb-4"
            />
            <h1 className="font-extrabold text-2xl md:text-4xl">
              No Course Found
            </h1>
          </div>
        )}
      </div>
    </main>
  </div>
</div>





  );
};

export default StudentCourseView;
