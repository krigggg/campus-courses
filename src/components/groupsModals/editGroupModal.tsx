import { useUpdateGroupMutation } from "@/services/group/groupApi";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  Input,
  Typography,
} from "@material-tailwind/react";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required(),
});

type EditGroupModalProps = {
  groupId: string;
  open: boolean;
  handleOpen: any;
};

type EditFormRequest = {
  name: string;
};

const EditGroupModal: FC<EditGroupModalProps> = ({
  groupId,
  open,
  handleOpen,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFormRequest>({
    resolver: yupResolver(schema),
  });

  const [editGroup] = useUpdateGroupMutation();
  const onSubmit: SubmitHandler<EditFormRequest> = async (data) => {
    try {
      await editGroup({
        id: groupId,
        name: data.name,
      }).unwrap();
      toast.success("Group name has been changed");
    } catch (err: any) {
      console.log(err);
      toast.error("Hoops... Something went wrong");
    }
  };

  return (
    <Dialog open={open} handler={handleOpen} size="sm">
      <Card
        color="transparent"
        shadow={false}
        className="mx-auto w-full max-w-[24rem]"
      >
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-0 grid h-12 place-items-center"
        >
          <Typography variant="h5" color="white">
            Edit group
          </Typography>
        </CardHeader>
      </Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardBody className="flex flex-col gap-4">
          <Input label="Name of group" size="lg" {...register("name")} />
        </CardBody>
        <CardFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            type="submit"
            variant="gradient"
            color="green"
            onClick={handleOpen}
          >
            <span>Edit</span>
          </Button>
        </CardFooter>
      </form>
    </Dialog>
  );
};

export default EditGroupModal;
