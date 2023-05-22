import { RolesList } from "@/services/user/type";
import { Typography } from "@material-tailwind/react";
import Link from "next/link";
import { FC } from "react";

type NavListProps = {
  roles: RolesList | undefined;
};

const NavList: FC<NavListProps> = ({ roles }) => {
  console.log(roles);
  return (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {!!roles && (
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <Link href="/groups" className="flex items-center">
            Course groups
          </Link>
        </Typography>
      )}
      {!!(roles?.isAdmin || roles?.isStudent) && (
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <Link href="/courses/my" className="flex items-center">
            My courses
          </Link>
        </Typography>
      )}
      {!!(roles?.isAdmin || roles?.isTeacher) && (
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <Link href="/courses/teaching" className="flex items-center">
            Teaching courses
          </Link>
        </Typography>
      )}
    </ul>
  );
};

export default NavList;
