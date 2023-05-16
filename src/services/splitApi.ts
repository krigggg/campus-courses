import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

// https://samokat.somnoynadno.ru/api/v
// http://localhost:3000/api

export const splitApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'https://camp-courses.api.kreosoft.space/', prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
    
        if (token) {
          headers.set("Authorization", "Bearer " + token);
        }
    
        return headers;
      }}),
    tagTypes: ['Profile', 'Groups', 'Courses', 'MyCourses', 'TeachingCourses', 'CoursesDetails'],
  endpoints: () => ({}),
})