import { useEditCourseStatusMutation } from "@/services/course/courseApi";
import { CourseStatus } from "@/services/course/type";
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
  status: yup.string().required(),
});

type StatusModalProps = {
  courseId: string;
  open: boolean;
  handleOpen: any;
};

type ChangeCourseStatusRequest = {
  status: CourseStatus;
};

const EditStatusModal: FC<StatusModalProps> = ({
  courseId,
  open,
  handleOpen,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangeCourseStatusRequest>({
    resolver: yupResolver(schema),
  });

  const [editCourseStatus] = useEditCourseStatusMutation();
  const onSubmit: SubmitHandler<ChangeCourseStatusRequest> = async (data) => {
    try {
      await editCourseStatus({ courseId, ...data }).unwrap();
      toast.success("Status has been changed");
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
          <Radio
            {...register("status")}
            label="Open for assigning"
            value="OpenForAssigning"
          />
          <Radio {...register("status")} label="Started" value="Started" />
          <Radio {...register("status")} label="Finished" value="Finished" />
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

export default EditStatusModal;
