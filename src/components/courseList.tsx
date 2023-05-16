import {
  convertSemester,
  statusColors,
  statusConvertions,
} from "@/helpers/courseConverters";
import { Course } from "@/services/course/type";
import { List, ListItem, Typography } from "@material-tailwind/react";
import { FC } from "react";

type CourseListProps = {
  groupName: string;
  data: Course[] | undefined;
};

const CourseList: FC<CourseListProps> = ({ groupName, data }) => (
  <>
    <Typography variant="h2" className="my-2">
      {groupName}
    </Typography>
    <List>
      {data?.map((course, index) => (
        // eslint-disable-next-line react/jsx-no-undef
        <ListItem
          key={index}
          className="border flex items-start justify-between"
        >
          <div className="flex flex-col">
            <Typography variant="lead" color="black" className="font-medium">
              {course.name}
            </Typography>
            <Typography variant="paragraph" color="black" className="mt-1">
              {course.startYear}-{course.startYear + 1}
            </Typography>
            <Typography variant="paragraph" color="black">
              Семестр - {convertSemester(course.semester)}
            </Typography>
            <Typography variant="paragraph" className="mt-1">
              Мест всего - {course.maximumStudentsCount}
            </Typography>
            <Typography variant="paragraph">
              Мест свободно - {course.remainingSlotsCount}
            </Typography>
          </div>
          <div className={`flex flex-col`}>
            <span className={`${statusColors[course.status]} font-semibold`}>
              {statusConvertions[course.status]}
            </span>
          </div>
        </ListItem>
      ))}
    </List>
  </>
);

export default CourseList;
