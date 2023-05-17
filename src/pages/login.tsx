import { useLoginUserMutation } from "@/services/user/userApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, Input, Typography } from "@material-tailwind/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email(),
  password: yup.string().required(),
});

type SignInRequest = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignInRequest>({
    resolver: yupResolver(schema),
  });
  const router = useRouter();
  const [login] = useLoginUserMutation();
  const onSubmit: SubmitHandler<SignInRequest> = async (data) => {
    try {
      await login(data).unwrap();
      toast.success("Sign in success");
      router.push("/");
    } catch (err: any) {
      if (err.data?.message === "Login failed" && err.status === 400) {
        toast.error("Email or password aren't right");
      } else {
        toast.error("Hoops... Something went wrong");
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
        Sign in
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        Enter your details to sign in.
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
      >
        <div className="mb-4">
          <div className="mb-1">
            <Input size="lg" label="Email" {...register("email")} />
          </div>
          <p className="text-red-400">{errors.email?.message}</p>
          <div className="mt-3 mb-1">
            <Input
              type="password"
              size="lg"
              label="Password"
              {...register("password")}
            />
          </div>
          <p className="text-red-400">{errors.password?.message}</p>
        </div>
        <Button className="mt-6" type="submit" fullWidth>
          Sign in
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-500 transition-colors hover:text-blue-700"
          >
            Sign up
          </Link>
        </Typography>
      </form>
    </Card>
  );
};

export default Login;
