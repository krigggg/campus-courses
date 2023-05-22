import { useEditStudentMarkMutation } from "@/services/course/courseApi";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  Radio,
  Typography,
} from "@material-tailwind/react";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object({
  mark: yup.string().required(),
});

type EditMarkModalProps = {
  courseId: string;
  studentId: string;
  markType: string;
  open: boolean;
  handleOpen: any;
};

type EditMarkRequest = {
  courseId: string;
  studentId: string;
  markType: string;
  mark: string;
};

const EditMarkModal: FC<EditMarkModalProps> = ({
  courseId,
  studentId,
  markType,
  open,
  handleOpen,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditMarkRequest>({
    resolver: yupResolver(schema),
  });

  const [editMark] = useEditStudentMarkMutation();
  const onSubmit: SubmitHandler<EditMarkRequest> = async (data) => {
    try {
      await editMark({
        courseId: courseId,
        studentId: studentId,
        markType: markType,
        mark: data.mark,
      }).unwrap();
      toast.success("Mark has been changed");
    } catch (err: any) {
      console.log(err);
      if (err.data.message) {
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
            Change course status
          </Typography>
        </CardHeader>
      </Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardBody className="flex flex-row gap-6">
          <Radio {...register("mark")} label="Пройдено" value="Passed" />
          <Radio {...register("mark")} label="Зафейлено" value="Failed" />
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
            <span>Change</span>
          </Button>
        </CardFooter>
      </form>
    </Dialog>
  );
};

export default EditMarkModal;
