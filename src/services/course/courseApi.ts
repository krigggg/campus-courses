import { splitApi } from '../splitApi';
import { AddNotification, AddTeacherRequest, Course, CourseDetails, CourseRequest, CourseStatus, StudentStatus } from './type';

export const courcesApi = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getUserCources: build.query<Course[], string | void>({
      query: () => 'courses/my',
      providesTags: ["MyCourses"]
    }),
    getCourcesByGroupId: build.query<Course[], string>({
      query: (id) => `groups/${id}`,
      providesTags: [{type: "Courses"}]
    }),
    getTeachingCourses: build.query<Course[], string | void>({
      query: () => 'courses/teaching',
      providesTags: ["TeachingCourses"]
    }),
    getCourcesDetails: build.query<CourseDetails, string>({
      query: (id) => `courses/${id}/details`,
      providesTags: ["CoursesDetails"]
    }),
    addCourse: build.mutation<void, CourseRequest>({
      query(data: CourseRequest) {
          const {groupId, ...body} = data;
          return {
              url: `/courses/${groupId}`,
              method: "POST",
              body,
          }
      },
      invalidatesTags: [{type: "Courses"}],
    }),
    addUserToCourse: build.mutation<void, string>({
      query: (id) => ({
          url: `/courses/${id}/sign-up`,
          method: "POST",
        }),
        invalidatesTags: ["CoursesDetails"]
    }),
    addNotification: build.mutation<void, AddNotification>({
      query(data: AddNotification) {
        const {courseId, ...body} = data;
        return {
            url: `/courses/${courseId}/notifications`,
            method: "POST",
            body,
        }
    },
    invalidatesTags: ["CoursesDetails"]
    }),
    addteacher: build.mutation<void, AddTeacherRequest>({
      query(data: AddTeacherRequest) {
        const {courseId, ...body} = data;
        return {
            url: `/courses/${courseId}/teachers`,
            method: "POST",
            body,
        }
    },
    invalidatesTags: ["CoursesDetails"]
    }),
    editStudentStatus: build.mutation<void, { status: StudentStatus; courseId: string; studentId: string; }>({
      query(data) {
        const {courseId, studentId, ...body} = data;
        return {
            url: `/courses/${courseId}/student-status/${studentId}`,
            method: "POST",
            body,
        }
    },
    invalidatesTags: ["CoursesDetails"]
    }),
    editStudentMark: build.mutation<void, { courseId: string; studentId: string; markType: string; mark: string }>({
      query(data) {
        const {courseId, studentId, ...body} = data;
        return {
            url: `/courses/${courseId}/marks/${studentId}`,
            method: "POST",
            body,
        }
    },
    invalidatesTags: ["CoursesDetails"]
    }),
    editCourseStatus:  build.mutation<void, { status: CourseStatus; courseId: string; }>({
      query(data) {
        const {courseId, ...body} = data;
        return {
            url: `/courses/${courseId}/status`,
            method: "POST",
            body,
        }
    },
    invalidatesTags: ["CoursesDetails"]
    }),
    editCourseData: build.mutation<void, { requirements: string, annotations: string, courseId: string }>({
      query(data) {
        const {courseId, ...body} = data;
        return {
            url: `/courses/${courseId}`,
            method: "PUT",
            body,
        }
    },
    invalidatesTags: ["CoursesDetails"]
    }),
  }),
  overrideExisting: false,
})

export const { useGetUserCourcesQuery, useGetCourcesByGroupIdQuery, useGetTeachingCoursesQuery, useAddCourseMutation, useAddUserToCourseMutation, useAddNotificationMutation, useAddteacherMutation, useGetCourcesDetailsQuery, useEditStudentStatusMutation, useEditCourseStatusMutation, useEditCourseDataMutation, useEditStudentMarkMutation } = courcesApi