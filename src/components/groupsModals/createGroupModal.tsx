import { useAddGroupMutation } from "@/services/group/groupApi";
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

type CreateGroupModalProps = {
  open: boolean;
  handleOpen: any;
};

type CreateFormRequest = {
  name: string;
};

const CreateGroupModal: FC<CreateGroupModalProps> = ({ open, handleOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormRequest>({
    resolver: yupResolver(schema),
  });

  const [createGroup] = useAddGroupMutation();
  const onSubmit: SubmitHandler<CreateFormRequest> = async (data) => {
    try {
      await createGroup(data).unwrap();
      toast.success("Group has been added");
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
            Create new group
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
            <span>Create</span>
          </Button>
        </CardFooter>
      </form>
    </Dialog>
  );
};

export default CreateGroupModal;
