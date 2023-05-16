import { splitApi } from "../splitApi";
import { AddGroupModel, EditGroupModel, Group } from "./type";

export const groupApi = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getAllGroups: build.query<Group[], string | void>({
            query: () => '/groups',
            providesTags: (result) => result ? 
            [
              ...result.map(({id}) => ({ type: "Groups", id } as const)), 
              { type: "Groups", id: "List"}
            ] 
            : 
              [{type: "Groups", id: "List"}]
        }),
        addGroup: build.mutation<void, AddGroupModel>({
            query(body: AddGroupModel) {
                return {
                    url: '/groups',
                    method: "POST",
                    body,
                }
            },
            invalidatesTags: [{type: 'Groups', id: "List"}],
        }),
        updateGroup:build.mutation<Group, EditGroupModel>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `groups/${id}`,
                    method: 'PUT',
                    body,
                }
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Groups', id }],
        }),
        deleteGroup: build.mutation<void, string>({
            query(id) {
                return {
                    url: `/groups/${id}`,
                    method: "DELETE",
                }
            },
            invalidatesTags: (result, error, id) => [{ type: "Groups", id }],
        })
    }),
    overrideExisting: false,
})

export const { 
    useGetAllGroupsQuery, 
    useAddGroupMutation, 
    useUpdateGroupMutation, 
    useDeleteGroupMutation 
} = groupApi;