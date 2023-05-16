import { useRegisterUserMutation } from "@/services/user/userApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, Input, Typography } from "@material-tailwind/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object({
  fullName: yup.string().required(),
  birthDate: yup.date().required(),
  email: yup.string().email(),
  password: yup
    .string()
    .required()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase and One Number"
    ),
  confirmPassword: yup
    .string()
    .required("confirmation of password is important")
    .oneOf([yup.ref("password")], "password doesn't match"),
});

type SignUpRequest = {
  fullName: string;
  birthDate: Date;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpRequest>({
    resolver: yupResolver(schema),
  });
  const router = useRouter();
  const [registrate] = useRegisterUserMutation();
  const onSubmit: SubmitHandler<SignUpRequest> = async (data) => {
    try {
      await registrate(data).unwrap();
      toast.success("Register is success");
      router.push("/");
    } catch (err: any) {
      console.log(err);

      if (err.data?.message === "User with this email is already registered.") {
        toast.error("Email is already registered");
      } else if (err.status === 400) {
        toast.error("Registration failed");
      } else {
        toast.error("Ooops... Something went wrong :(");
      }
    }
  };

  return (
    <Card
      className="flex items-center justify-center mt-12"
      color="transparent"
      shadow={false}
    >
      <Typography variant="h4" color="blue-gray">
        Sign up
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        Enter your details to sign up.
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
      >
        <div className="mb-4">
          <div className="mb-1">
            <Input
              size="lg"
              label="FullName"
              required
              {...register("fullName")}
            />
          </div>
          <p className="text-red-400">{errors.fullName?.message}</p>
          <div className="mt-3 mb-1">
            <Input
              type="date"
              size="lg"
              required
              label="BirthDate"
              {...register("birthDate")}
            />
          </div>
          <p className="text-red-400">{errors.birthDate?.message}</p>
          <div className="mt-3 mb-1">
            <Input
              type="email"
              required
              size="lg"
              label="Email"
              {...register("email")}
            />
          </div>
          <p className="text-red-400">{errors.email?.message}</p>
          <div className="mt-3 mb-1">
            <Input
              type="password"
              size="lg"
              label="Password"
              required
              {...register("password")}
            />
          </div>
          <p className="text-red-400">{errors.password?.message}</p>
          <div className="mt-3 mb-1">
            <Input
              type="password"
              size="lg"
              label="Password"
              {...register("confirmPassword", {
                required: true,
                validate: (value: string) => {
                  if (watch("password") !== value) {
                    return "Пароли не совпадают";
                  }
                },
              })}
            />
          </div>
          <p className="text-red-400">{errors.confirmPassword?.message}</p>
        </div>
        <Button className="mt-6" type="submit" fullWidth>
          Sign up
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-500 transition-colors hover:text-blue-700"
          >
            Sign in
          </Link>
        </Typography>
      </form>
    </Card>
  );
};

export default Register;
