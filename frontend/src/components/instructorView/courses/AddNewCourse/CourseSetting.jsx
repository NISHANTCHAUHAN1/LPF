import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructorContext";
import { mediaUploadService } from "@/services";
import React, { useContext } from "react";

const CourseSetting = () => {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(InstructorContext);

  async function handleImageUploadChange(evenet) {
    const selectedImage = evenet.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        const response = await mediaUploadService(imageFormData);
        // console.log(response);
        setCourseLandingFormData({
          ...courseLandingFormData,
          image: response?.data?.url,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  console.log(courseLandingFormData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>

      <CardContent>
        {courseLandingFormData?.image ? (
          <img src={courseLandingFormData.image} />
        ) : (
          <div className="flex flex-col gap-3">
            <Label>Upload Course Image</Label>
            <Input
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseSetting;
