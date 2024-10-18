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
import { StudentContext } from "@/context/studentContext";
import { fetchStudentViewCourseListService } from "@/services";
import { ArrowDownUpIcon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const StudentCourseView = () => {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

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

  const { studentViewCoursesList, setStudentViewCoursesList, loading, setLoading } =
    useContext(StudentContext);

  //   function handleFilterOnChange(getSectionId, getCurrentOption) {
  //     let cpyFilters = { ...filters };
  //     const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);
  //     console.log(indexOfCurrentSection, getSectionId);
  //     if (indexOfCurrentSection === -1) {
  //       cpyFilters = {
  //         ...cpyFilters,
  //         [getSectionId]: [getCurrentOption.id],
  //       };
  //       console.log(cpyFilters);
  //     } else {
  //       const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
  //         getCurrentOption.id
  //       );
  //       if (indexOfCurrentOption === -1)
  //         cpyFilters[getSectionId].push(getCurrentOption.id);
  //       else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
  //     }
  //     setFilters(cpyFilters);
  //     sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  //   }

  function handleFilterOnChange(sectionId, option) {
    // Create a copy of the filters object to avoid mutations
    let updatedFilters = { ...filters };

    // If the section does not exist, create it with the selected option
    if (!updatedFilters[sectionId]) {
      updatedFilters[sectionId] = [option.id];
    } else {
      // If the section exists, find the index of the option
      const optionIndex = updatedFilters[sectionId].indexOf(option.id);

      // Add the option if it's not present, or remove it if it is
      if (optionIndex === -1) {
        updatedFilters[sectionId].push(option.id);
      } else {
        updatedFilters[sectionId].splice(optionIndex, 1);
      }
    }

    // Update the state and store the filters in sessionStorage
    setFilters(updatedFilters);
    sessionStorage.setItem("filters", JSON.stringify(updatedFilters));
  }

  async function  fetchAllStudentViewCourses(filters, sort) {
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

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if(filters !== null && sort !== null)
      fetchAllStudentViewCourses(filters, sort);
}, [filters, sort]);

useEffect(() => {
  return () => {
    sessionStorage.removeItem("filters");
  };
}, []);


  console.log(filters);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Courses</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-64 space-y-4">
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
                      {/* <Checkbox
                        checked={
                            filters &&
                            Object.keys(filters).length > 0 &&
                            filters[ketItem] &&
                            filters[ketItem].indexOf(option.id) > -1
                          }
                        onCheckedChange={() =>
                          handleFilterOnChange(ketItem, option)
                        }
                      /> */}
                      <Checkbox
                        checked={
                          filters?.[ketItem]?.includes(option.id) || false
                        }
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
        <main className="flex-1">
          <div className="flex justify-end items-center mb-4 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex  items-center gap-2 p-5"
                >
                  <ArrowDownUpIcon className="h-4 w-4" />
                  <span className="text-[16px] font-medium ">Sort By</span>
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

            <span className="text-sm text-black font-bold"> 10 Results</span>
          </div>

          <div className="space-y-4">

          
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <Card className="cursor-pointer" key={courseItem._id}>
                  <CardContent className="flex gap-4 p-4">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={courseItem?.image}
                        className="w-ful h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {courseItem?.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mb-1">
                        Created By{" "}
                        <span className="font-bold">
                          {courseItem?.instructorName}
                        </span>
                      </p>
                      <p className="text-[16px] text-gray-600 mt-3 mb-2">
                        {`${courseItem?.curriculum?.length} ${
                          courseItem?.curriculum?.length <= 1
                            ? "Lecture"
                            : "Lectures"
                        } - ${courseItem?.level.toUpperCase()} Level`}
                      </p>
                      <p className="font-bold text-lg">
                        ${courseItem?.pricing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : loading ? (<Skeleton /> ) : (
              <h1 className="font-extrabold text-4xl" >No Course Found</h1>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentCourseView;
