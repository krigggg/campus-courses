import {
  useEditUserProfileMutation,
  useGetUserProfileQuery,
} from "@/services/user/userApi";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Card,
  CardBody,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object({
  fullName: yup.string().required(),
  birthDate: yup.date().required(),
});

export type ProfileRequest = {
  fullName: string;
  birthDate: string;
};

const Profile = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileRequest>({
    resolver: yupResolver(schema),
  });

  const [changeProfile] = useEditUserProfileMutation();
  const profile = useGetUserProfileQuery().data;

  useEffect(() => {
    setValue("fullName", profile?.fullName || "");
    setValue("birthDate", profile?.birthDate.toString().split("T")[0] || "");
  }, [setValue, profile]);

  const onSubmit: SubmitHandler<ProfileRequest> = async (data) => {
    try {
      await changeProfile(data).unwrap();
      toast.success("Profile has changed successfull");
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <Card className="mt-8 w-96 mx-auto">
      <CardBody>
        <Typography variant="h4" color="blue-gray" className="mb-2">
          Profile
        </Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 mb-2 w-full max-w-screen-lg"
        >
          <div className="mb-4 flex flex-col gap-6">
            <Input size="lg" label="FullName" {...register("fullName")} />
            <Input
              value={profile?.email}
              size="lg"
              label="Email"
              disabled
              className="w-full"
            />
            <Input
              type="date"
              size="lg"
              label="BirthDate"
              {...register("birthDate")}
            />
          </div>
          <Button type="submit">Change</Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default Profile;
