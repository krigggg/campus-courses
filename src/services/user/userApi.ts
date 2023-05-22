import { ProfileRequest } from '@/pages/profile';
import { splitApi } from '../splitApi';
import { IUser, Login, Profile, Registration, RolesList } from './type';

export const accountApi = splitApi.injectEndpoints({
    endpoints: (build) => ({
      getUserProfile: build.query<Profile, string | void>({
        query: () => '/profile',
        providesTags: ["Profile"]
      }),
      editUserProfile: build.mutation<Profile, ProfileRequest>({
        query: (body) => {
          return {
            url: '/profile',
            method: "PUT",
            body
          }
        },
        invalidatesTags: ["Profile"]
      }),
      registerUser: build.mutation<{token: string}, Registration>({
        query(body: Registration) {
          return {
              url: '/registration',
              method: "POST",
              body,
          }
        },
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            localStorage.setItem("token", data.token);
            dispatch(splitApi.util.invalidateTags(["Profile", "Roles"]));
          } catch (err) {
            console.log(err);
          }
        },
      }),
      loginUser: build.mutation<{ token: string }, Login>({
        query(body: Login) {
            return {
                url: '/login',
                method: "POST",
                body,
            }
        },
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            localStorage.setItem("token", data.token);
            dispatch(splitApi.util.invalidateTags(["Profile", "Roles"]));
          } catch (err) {
            console.log(err);
          }
        },
      }),
      logoutUser: build.mutation<void, void>({
        query() {
            return {
                url: '/logout',
                method: "POST",
            }
        },
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(splitApi.util.resetApiState());
            localStorage.removeItem("token");
          } catch (err) {
            console.log(err);
          }
        }
      }),
      getUserRoles: build.query<RolesList, void>({
        query: () => "/roles",
        providesTags: ["Roles"]
      }),
      getAllUsers: build.query<IUser[], void>({
        query: () => "/users"
      })
    }),
    overrideExisting: false,
  })
    
  export const { 
    useGetUserProfileQuery, 
    useEditUserProfileMutation,
    useRegisterUserMutation, 
    useLoginUserMutation, 
    useLogoutUserMutation, 
    useGetUserRolesQuery, 
    useGetAllUsersQuery 
  } = accountApi
