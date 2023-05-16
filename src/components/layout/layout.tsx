import { splitApi } from "@/services/splitApi";
import {
  useGetUserProfileQuery,
  useLogoutUserMutation,
} from "@/services/user/userApi";
import { Button, Navbar, Typography } from "@material-tailwind/react";
import Link from "next/link";
import { FC, ReactNode } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import NavList from "./navList";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { data } = useGetUserProfileQuery();
  const [logout] = useLogoutUserMutation();

  const handleLogoutClick = async () => {
    try {
      await logout().unwrap();
      toast.success("Logout was successfull");
    } catch (err: any) {
      if (err.status === 401) {
        localStorage.removeItem("token");
        dispatch(splitApi.util.resetApiState());
        toast.success("Logout was successfull");
      }
    }
  };

  return (
    <>
      <Navbar className="sticky inset-0 z-10 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-blue-gray-900">
          <div className="flex items-center">
            <Typography
              as="a"
              className="mr-4 cursor-pointer py-1.5 font-bold text-xl"
            >
              <Link href="/">Campus courses</Link>
            </Typography>
            <div className="ml-8">
              <NavList />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!data?.email ? (
              <>
                <Link href="/register">
                  <Button
                    variant="gradient"
                    size="sm"
                    className="hidden lg:inline-block w-28 px-6 py-3"
                  >
                    <span>Register</span>
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="gradient"
                    size="sm"
                    className="hidden lg:inline-block w-28 px-6 py-3"
                  >
                    <span>Login</span>
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/profile">
                  <p className="cursor-pointer">{data?.email}</p>
                </Link>
                <Button onClick={handleLogoutClick} className="w-24 px-6 py-3">
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </Navbar>
      <Toaster />
      <div className="max-w-7xl mx-auto">{children}</div>
    </>
  );
};

export default Layout;
