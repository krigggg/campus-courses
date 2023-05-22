import { useAddNotificationMutation } from "@/services/course/courseApi";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Dialog,
  Input,
  Typography,
} from "@material-tailwind/react";
import { FC } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object({
  text: yup.string().required(),
  isImportant: yup.boolean().required(),
});

type CreateNotificationModalProps = {
  courseId: string;
  open: boolean;
  handleOpen: any;
};

type CreateNotificationRequest = {
  text: string;
  isImportant: boolean;
};

const CreateNotificationModal: FC<CreateNotificationModalProps> = ({
  courseId,
  open,
  handleOpen,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateNotificationRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      text: "",
      isImportant: false,
    },
  });

  const [createNotification] = useAddNotificationMutation();
  const onSubmit: SubmitHandler<CreateNotificationRequest> = async (data) => {
    try {
      await createNotification({ courseId, ...data }).unwrap();
      toast.success("Notification has been added");
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
            Create new notification
          </Typography>
        </CardHeader>
      </Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardBody className="flex flex-col gap-4">
          <Input label="Notification text" size="lg" {...register("text")} />
          <Controller
            name="isImportant"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                label="Is important"
                value={value.toString()}
                onChange={onChange}
              />
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
            <span>Create</span>
          </Button>
        </CardFooter>
      </form>
    </Dialog>
  );
};

export default CreateNotificationModal;
