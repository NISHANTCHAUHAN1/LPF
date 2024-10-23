import MediaProgressbar from "@/components/mediaProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/videoPlayer/indedx";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructorContext";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Upload } from "lucide-react";
import React, { useContext, useRef } from "react";

const CourseCurriculum = () => {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgess,
    setMediaUploadProgess,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

  // The function handleNewLecture is used to add a new lecture to the existing curriculum.
  // It keeps the current lectures and adds a new lecture using the default data structure (courseCurriculumInitialFormData[0]).
  // This helps manage the state for a form where users can add multiple lectures dynamically.
  const handleNewLecture = () => {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  };

  // This function updates the title of a specific course in an array of course data based on the user’s input, while maintaining immutability by working on a copy of the array.
  const handleCourseTitleChange = (event, currentIndex) => {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      title: event.target.value,
    };
    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  };

  function handleFreePreviewChange(currentValue, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    // console.log(evnet.target.files);
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgess(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        // console.log(response);
        if (response.success) {
          let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
          cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgess(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleReplaceVideo(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const deleteCurrentMediaResponse = await mediaDeleteService(
      getCurrentVideoPublicId
    );
    // console.log(deleteCurrentMediaResponse);
    if (deleteCurrentMediaResponse?.success) {
      cpyCourseCurriculumFormData[currentIndex] = {
        ...cpyCourseCurriculumFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };
      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }

  function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }

  function handleOpenBulkUploadDialog() {
    bulkUploadInputRef.current?.click();
  }

  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();

    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));
    try {
      setMediaUploadProgess(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );
      //  console.log(response);
      if (response?.success) {
        let cpyCourseCurriculumFormData =
          areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)
            ? []
            : [...courseCurriculumFormData];

        cpyCourseCurriculumFormData = [
          ...cpyCourseCurriculumFormData,
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${
              cpyCourseCurriculumFormData.length + (index + 1)
            }`,
            freePreview: false,
          })),
        ];
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
        setMediaUploadProgess(false);
        // console.log(courseCurriculumFormData, cpyCourseCurriculumFormData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteLecture(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    // console.log(cpyCourseCurriculumFormData[currentIndex]);
    const getCurrentSelectedVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;
    const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);
    if (response?.success) {
      cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
        (_, index) => index !== currentIndex
      );
      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  // console.log(courseCurriculumFormData);

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <CardTitle className="text-lg sm:text-xl font-semibold">
          Create Course Curriculum
        </CardTitle>
        <div className="mt-2 sm:mt-0">
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUploadDialog}
          >
            <Upload className="w-4 h-5 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Button
          disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgess}
          onClick={handleNewLecture}
          className="mb-4"
        >
          Add Lecture
        </Button>
        {mediaUploadProgess ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgess}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((curriculumItem, index) => (
            <div
              className="border p-5 rounded-md flex flex-col sm:flex-row"
              key={index}
            >
              <div className="flex-1">
                <h3 className="font-semibold">Lecture {index + 1}</h3>
                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter lecture title"
                  className="max-w-full sm:max-w-96"
                  onChange={(event) => handleCourseTitleChange(event, index)}
                  value={courseCurriculumFormData[index]?.title}
                />
              </div>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0 sm:ml-4">
                <Switch
                  onCheckedChange={(value) =>
                    handleFreePreviewChange(value, index)
                  }
                  checked={courseCurriculumFormData[index]?.freePreview}
                  id={`freePreview-${index + 1}`}
                />
                <Label htmlFor={`freePreview-${index + 1}`}>Free Preview</Label>
              </div>

              <div className="mt-6">
                {courseCurriculumFormData[index]?.videoUrl ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <VideoPlayer
                      url={courseCurriculumFormData[index]?.videoUrl}
                      width="100%"
                      height="200px"
                      className="flex-1"
                    />
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={() => handleReplaceVideo(index)}
                        className="w-full"
                      >
                        Replace Video
                      </Button>
                      <Button
                        onClick={() => handleDeleteLecture(index)}
                        className="bg-red-900 w-full"
                      >
                        Delete Lecture
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(event) =>
                      handleSingleLectureUpload(event, index)
                    }
                    className="mb-4"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCurriculum;
