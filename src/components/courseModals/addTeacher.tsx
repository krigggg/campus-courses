import { useAddteacherMutation } from "@/services/course/courseApi";
import { useGetAllUsersQuery } from "@/services/user/userApi";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { FC } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object({
  userId: yup.string().required(),
});

type AddTeacherModalProps = {
  courseId: string;
  open: boolean;
  handleOpen: any;
};

type AddTeacherRequest = {
  courseId: string;
  userId: string;
};

const AddTeacherModal: FC<AddTeacherModalProps> = ({
  courseId,
  open,
  handleOpen,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddTeacherRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      userId: "",
    },
  });
  const users = useGetAllUsersQuery().data;
  const [addTeacher] = useAddteacherMutation();
  const onSubmit: SubmitHandler<AddTeacherRequest> = async (data) => {
    console.log(data);
    try {
      await addTeacher({ courseId: courseId, userId: data.userId }).unwrap();
      toast.success("Teacher has been added");
    } catch (err: any) {
      if (err?.data?.message) {
        toast.error(err.data.message);
      } else {
        toast.error("Hoops... Something went wrong");
      }
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
            Add new teacher
          </Typography>
        </CardHeader>
      </Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardBody>
          <Controller
            name="userId"
            control={control}
            render={({ field }) => (
              <Select {...field} variant="static" label="Select teacher">
                {users?.map((user, index) => (
                  <Option key={index} value={user.id}>
                    {user.fullName}
                  </Option>
                ))}
              </Select>
            )}
          />
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
            <span>Add</span>
          </Button>
        </CardFooter>
      </form>
    </Dialog>
  );
};

export default AddTeacherModal;
