import CreateGroupModal from "@/components/groupsModals/createGroupModal";
import EditGroupModal from "@/components/groupsModals/editGroupModal";
import {
  useDeleteGroupMutation,
  useGetAllGroupsQuery,
} from "@/services/group/groupApi";
import { Button, List, ListItem } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useState } from "react";

const Groups = () => {
  const { data } = useGetAllGroupsQuery();
  const { push } = useRouter();
  const [editId, setEditId] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteGroup] = useDeleteGroupMutation();

  const handleOpenCreate = () => setOpenCreate(!openCreate);
  const handleOpenEdit = () => setOpenEdit(!openEdit);

  return (
    <>
      <Button onClick={handleOpenCreate} className="my-4">
        Create
      </Button>
      <CreateGroupModal open={openCreate} handleOpen={handleOpenCreate} />
      <EditGroupModal
        groupId={editId}
        open={openEdit}
        handleOpen={handleOpenEdit}
      />
      <List className="p-0">
        {data?.map((group, index) => (
          <ListItem
            key={index}
            className="border"
            onClick={() =>
              push({
                pathname: `/groups/${group.id}`,
                query: {
                  groupName: group.name,
                },
              })
            }
          >
            <div className="flex items-center justify-between w-full">
              <span>{group.name}</span>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  onClick={() => {
                    setEditId(group.id);
                    handleOpenEdit();
                  }}
                  className="bg-amber-600 shadow-amber-600/20 hover:shadow-amber-600/60 text-white font-bold rounded-md py-3 px-6 w-24"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => deleteGroup(group.id)}
                  className="bg-red-500 shadow-red-500/20  hover:shadow-red-500/40 text-white font-bold rounded-md p-3 py-3 px-6 w-24"
                >
                  Delete
                </Button>
              </div>
            </div>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Groups;
