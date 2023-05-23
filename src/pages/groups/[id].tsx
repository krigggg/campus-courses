import { useGetCourcesByGroupIdQuery } from "@/services/course/courseApi";
import { useRouter } from "next/router";
import CourseList from "../../components/courseList";

const GroupCourses = () => {
  const { query } = useRouter();
  const groupId = typeof query.id === "string" ? query.id : "";
  const { data } = useGetCourcesByGroupIdQuery(groupId);

  return (
    <CourseList
      groupId={groupId}
      groupName={typeof query.groupName === "string" ? query.groupName : ""}
      data={data}
    />
  );
};

export default GroupCourses;
