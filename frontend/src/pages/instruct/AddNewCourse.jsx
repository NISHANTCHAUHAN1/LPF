import CourseCurriculum from '@/components/instructorView/courses/AddNewCourse/CourseCurriculum'
import CourseLanding from '@/components/instructorView/courses/AddNewCourse/CourseLanding'
import CourseSetting from '@/components/instructorView/courses/AddNewCourse/CourseSetting'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

const AddNewCourse = () => {
  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between'>
        <h1 className='text-3xl font-extrabold mb-5'>Create new course</h1>
        <Button className="text-sm tracking-wider font-bold px-8">Submit</Button>
      </div>

      <Card>
        <CardContent>
            <div className='container mx-auto p-4'>
                <Tabs defaultValue='curriculum' className='space-y-4'>
                    <TabsList>
                        <TabsTrigger value="curriculum">curriculum</TabsTrigger>
                        <TabsTrigger value="course-landing-page">course-landing-page</TabsTrigger>
                        <TabsTrigger value="settings">settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="curriculum">
                        <CourseCurriculum />
                    </TabsContent>
                    <TabsContent value="course-landing-page">
                        <CourseLanding />
                    </TabsContent>
                    <TabsContent value="settings">
                        <CourseSetting />
                    </TabsContent>
                </Tabs>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddNewCourse
