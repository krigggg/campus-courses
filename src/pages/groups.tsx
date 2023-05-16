import { useGetAllGroupsQuery } from "@/services/group/groupApi";
import { Button, List, ListItem } from "@material-tailwind/react";

const Groups = () => {
  const { data } = useGetAllGroupsQuery();

  return (
    <List>
      {data?.map((group, index) => (
        <ListItem key={index} className="border">
          <div className="flex items-center justify-between w-full">
            <span>{group.name}</span>
            <div className="flex gap-2">
              <Button className="bg-amber-600 shadow-amber-600/20 hover:shadow-amber-600/60 text-white font-bold rounded-md py-3 px-6 w-24">
                Edit
              </Button>
              <Button className="bg-red-500 shadow-red-500/20  hover:shadow-red-500/40 text-white font-bold rounded-md p-3 py-3 px-6 w-24">
                Delete
              </Button>
            </div>
          </div>
        </ListItem>
      ))}
    </List>
  );
};

export default Groups;
