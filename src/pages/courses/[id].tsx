import AddTeacherModal from "@/components/courseModals/addTeacher";
import ChangeCourseModal from "@/components/courseModals/changeCourseModal";
import EditMarkModal from "@/components/courseModals/changeStudentMark";
import CreateNotificationModal from "@/components/courseModals/notificationModal";
import EditStatusModal from "@/components/courseModals/statusModal";
import {
  MarkColor,
  MarkConvertions,
  StudentStatusColor,
  StudentStatusConvertions,
  convertSemester,
  statusColors,
  statusConvertions,
} from "@/helpers/courseConverters";
import {
  useAddUserToCourseMutation,
  useEditStudentStatusMutation,
  useGetCourcesDetailsQuery,
} from "@/services/course/courseApi";
import { Student, Teacher } from "@/services/course/type";
import {
  useGetUserProfileQuery,
  useGetUserRolesQuery,
} from "@/services/user/userApi";
import {
  Badge,
  Button,
  Card,
  ListItem,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

const DetailedCourse = () => {
  const { query } = useRouter();
  const { data } = useGetCourcesDetailsQuery(
    typeof query.id === "string" ? query.id : ""
  );
  const roles = useGetUserRolesQuery().data;
  const profile = useGetUserProfileQuery().data;
  const profileEmail = useGetUserProfileQuery().data?.email;
  const mainTeacherEMail = data?.teachers.filter((teacher) => teacher.isMain)[0]
    .email;
  const isTeacher = data?.teachers.filter(
    (teacher) => teacher.email === profileEmail
  ).length;

  const [openCreateNotification, setOpenCreateNotifcation] = useState(false);
  const handleOpenCreateNotification = () =>
    setOpenCreateNotifcation(!openCreateNotification);

  const [openEditCourseStatus, setOpenEditCourseStatus] = useState(false);
  const handleOpenEditCourseStatus = () =>
    setOpenEditCourseStatus(!openEditCourseStatus);

  const [openAddTeacher, setOpenAddTeacher] = useState(false);
  const handleOpenAddTeacher = () => setOpenAddTeacher(!openAddTeacher);

  const [openChangeCourse, setOpenChangeCourse] = useState(false);
  const handleOpenChangeCourse = () => setOpenChangeCourse(!openChangeCourse);

  const [openMark, setOpenMark] = useState(false);
  const handleOpenMark = () => setOpenMark(!openMark);

  const [signUp] = useAddUserToCourseMutation();
  const [editStudentStatus] = useEditStudentStatusMutation();

  const [studentId, setStudentId] = useState("");
  const [markType, setMarkType] = useState("");

  const tabsDetails = [
    {
      label: "Требования к курсу",
      value: "requirements",
      desc: data?.requirements,
    },
    {
      label: "Аннотации",
      value: "annotations",
      desc: data?.annotations,
    },
    {
      label: "Уведомления",
      value: "notifications",
      desc: data?.notifications,
    },
  ];

  const tabsUser = [
    {
      label: "Преподаватели",
      value: "teachers",
      desc: data?.teachers,
    },
    {
      label: "Студенты",
      value: "students",
      desc: data?.students,
    },
  ];

  const [activeDetailsTab, setActiveDetailsTab] = useState("requirements");
  const [activeUserTab, setActiveUserTab] = useState("teachers");

  return (
    <>
      <CreateNotificationModal
        courseId={typeof query.id === "string" ? query.id : ""}
        open={openCreateNotification}
        handleOpen={handleOpenCreateNotification}
      />
      <EditStatusModal
        courseId={typeof query.id === "string" ? query.id : ""}
        open={openEditCourseStatus}
        handleOpen={handleOpenEditCourseStatus}
      />
      <AddTeacherModal
        courseId={typeof query.id === "string" ? query.id : ""}
        open={openAddTeacher}
        handleOpen={handleOpenAddTeacher}
      />
      <ChangeCourseModal
        courseId={typeof query.id === "string" ? query.id : ""}
        open={openChangeCourse}
        handleOpen={handleOpenChangeCourse}
        requirements={data?.requirements || ""}
        annotations={data?.annotations || ""}
      />
      {!!(roles?.isAdmin || isTeacher) && (
        <EditMarkModal
          studentId={studentId}
          markType={markType}
          courseId={typeof query.id === "string" ? query.id : ""}
          open={openMark}
          handleOpen={handleOpenMark}
        />
      )}
      <Typography variant="h2">{data?.name}</Typography>
      <div className="flex items-center justify-between">
        <Typography variant="h5" className="mt-4">
          {" "}
          Основные данные курса
        </Typography>
        {!!(roles?.isAdmin || isTeacher) && (
          <Button color="orange" onClick={handleOpenChangeCourse}>
            Edit
          </Button>
        )}
        {data?.status === "OpenForAssigning" &&
        data.students.filter((st) => st.email === profileEmail).length === 0 &&
        data.teachers.filter((teacher) => teacher.email === profileEmail)
          .length === 0 ? (
          <Button
            onClick={async () => {
              try {
                await signUp(
                  typeof query.id === "string" ? query.id : ""
                ).unwrap();
                toast.success("Your sign up was success");
              } catch (err: any) {
                if (err?.data?.message) {
                  toast.error(err.data.message);
                } else {
                  toast.error("Hoops... something went wrong :(");
                }
              }
            }}
            color="green"
          >
            Sign up
          </Button>
        ) : null}
      </div>
      <Card className="w-full mt-2">
        <ListItem className="flex flex-row justify-between border rounded-b-none">
          <div>
            <Typography variant="lead">Статус курса</Typography>
            <Typography
              variant="paragraph"
              // @ts-ignore
              className={`${statusColors[data?.status]}`}
            >
              {/*// @ts-ignore */}
              {statusConvertions[data?.status]}
            </Typography>
          </div>
          <div>
            {!!(roles?.isAdmin || isTeacher) && (
              <Button color="orange" onClick={handleOpenEditCourseStatus}>
                Edit
              </Button>
            )}
          </div>
        </ListItem>
        <ListItem className="flex flex-row border rounded-none">
          <div className="basis-1/2">
            <Typography variant="lead">Учебный год</Typography>
            <Typography variant="paragraph">
              {!!data?.startYear && (
                <span>
                  {data.startYear}-{data.startYear + 1}
                </span>
              )}
            </Typography>
          </div>
          <div className="basis-1/2">
            <Typography variant="lead">Семестр</Typography>
            <Typography variant="paragraph">
              {/*// @ts-ignore */}
              {convertSemester(data?.semester)}
            </Typography>
          </div>
        </ListItem>
        <ListItem className="flex flex-row border rounded-none">
          <div className="basis-1/2">
            <Typography variant="lead">Всего мест</Typography>
            <Typography variant="paragraph">
              {data?.maximumStudentsCount}
            </Typography>
          </div>
          <div className="basis-1/2">
            <Typography variant="lead">Студентов зачислено</Typography>
            <Typography variant="paragraph">
              {data?.studentsEnrolledCount}
            </Typography>
          </div>
        </ListItem>
        <ListItem className="flex flex-row border rounded-t-none">
          <div>
            <Typography variant="lead">Студентов на рассмотрении</Typography>
            <Typography variant="paragraph">
              {data?.studentsInQueueCount}
            </Typography>
          </div>
        </ListItem>
      </Card>

      <Tabs value={activeDetailsTab} className="mt-8">
        <TabsHeader
          className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
          indicatorProps={{
            className: "bg-transparent shadow-none rounded-none",
          }}
        >
          {tabsDetails.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              onClick={() => setActiveDetailsTab(value)}
              className={
                activeDetailsTab === value
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : ""
              }
            >
              {value === "notifications" ? (
                <Badge
                  className="-right-3 top-2"
                  // @ts-ignore
                  content={
                    data?.notifications
                      ? data?.notifications?.length > 3
                        ? "3+"
                        : data?.notifications.length
                      : 0
                  }
                >
                  {label}
                </Badge>
              ) : (
                label
              )}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {tabsDetails.map(({ value, desc }) => (
            <TabPanel key={value} value={value} className="p-0">
              {desc && typeof desc === "string" ? (
                <ListItem className="border mt-2">
                  <div dangerouslySetInnerHTML={{ __html: desc }}></div>
                </ListItem>
              ) : (
                <>
                  {!!(roles?.isAdmin || isTeacher) && (
                    <Button
                      onClick={handleOpenCreateNotification}
                      className="my-2 ml-2"
                    >
                      Add notification
                    </Button>
                  )}
                  {desc &&
                    typeof desc !== "string" &&
                    desc?.map((notification: any, index: number) => (
                      <ListItem
                        key={index}
                        className={`border ${
                          notification.isImportant && "bg-red-400 text-white"
                        }`}
                      >
                        {notification.text}
                      </ListItem>
                    ))}
                </>
              )}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>

      <Tabs value={activeUserTab} className="mt-8">
        <TabsHeader
          className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
          indicatorProps={{
            className: "bg-transparent shadow-none rounded-none",
          }}
        >
          {tabsUser.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              onClick={() => setActiveUserTab(value)}
              className={
                activeUserTab === value
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : ""
              }
            >
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {tabsUser.map(({ value, desc }) => (
            <TabPanel key={value} value={value} className="p-0 my-2">
              {value === "teachers" &&
                (!!roles?.isAdmin || profileEmail === mainTeacherEMail) && (
                  <Button className="m-2 mb-4" onClick={handleOpenAddTeacher}>
                    Add Teacher
                  </Button>
                )}
              {desc?.map((value, index) => {
                return (
                  <>
                    <Card
                      className="w-full border drop-shadow-none first:rounded-t-md last:rounded-b-md rounded-none"
                      key={index}
                    >
                      {(value as Student).status !== undefined &&
                      typeof (value as Student).status === "string" ? (
                        <>
                          {roles?.isAdmin || isTeacher ? (
                            <>
                              {(value as Student).status === "Accepted" && (
                                <ListItem className="drop-shadow-none grid grid-cols-3 gap-4">
                                  <div>
                                    <Typography variant="lead">
                                      {(value as Student).name}
                                    </Typography>
                                    <Typography
                                      variant="paragraph"
                                      className={
                                        StudentStatusColor[
                                          (value as Student).status
                                        ]
                                      }
                                    >
                                      {
                                        StudentStatusConvertions[
                                          (value as Student).status
                                        ]
                                      }
                                    </Typography>
                                    <Typography variant="paragraph">
                                      {(value as Student).email}
                                    </Typography>
                                  </div>
                                  <div className="flex">
                                    <Typography
                                      onClick={() => {
                                        setStudentId((value as Student).id);
                                        setMarkType("Midterm");
                                        handleOpenMark();
                                      }}
                                      variant="paragraph"
                                    >
                                      Промежуточная аттестация
                                    </Typography>
                                    <Button
                                      className="ml-2"
                                      size="sm"
                                      //@ts-ignore
                                      color={
                                        MarkColor[
                                          (value as Student).midtermResult
                                        ]
                                      }
                                    >
                                      {
                                        MarkConvertions[
                                          (value as Student).midtermResult
                                        ]
                                      }
                                    </Button>
                                  </div>
                                  <div className="flex">
                                    <Typography
                                      onClick={() => {
                                        setStudentId((value as Student).id);
                                        setMarkType("Final");
                                        handleOpenMark();
                                      }}
                                      variant="paragraph"
                                    >
                                      Финальная аттестация
                                    </Typography>
                                    <Button
                                      className="ml-2"
                                      size="sm"
                                      //@ts-ignore
                                      color={
                                        MarkColor[
                                          (value as Student).finalResult
                                        ]
                                      }
                                    >
                                      {
                                        MarkConvertions[
                                          (value as Student).finalResult
                                        ]
                                      }
                                    </Button>
                                  </div>
                                </ListItem>
                              )}
                              {(value as Student).status === "InQueue" && (
                                <ListItem className="drop-shadow-none flex justify-between">
                                  <div>
                                    <Typography variant="lead">
                                      {(value as Student).name}
                                    </Typography>
                                    <Typography
                                      variant="paragraph"
                                      className={
                                        StudentStatusColor[
                                          (value as Student).status
                                        ]
                                      }
                                    >
                                      {
                                        StudentStatusConvertions[
                                          (value as Student).status
                                        ]
                                      }
                                    </Typography>
                                    <Typography variant="paragraph">
                                      {(value as Student).email}
                                    </Typography>
                                  </div>

                                  <div className="flex gap-4">
                                    <Button
                                      onClick={() => {
                                        editStudentStatus({
                                          status: "Accepted",
                                          courseId:
                                            typeof query.id === "string"
                                              ? query.id
                                              : "",
                                          studentId: (value as Student).id,
                                        });
                                      }}
                                      size="sm"
                                      color="green"
                                      className="h-16"
                                    >
                                      Принять
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        editStudentStatus({
                                          status: "Declined",
                                          courseId:
                                            typeof query.id === "string"
                                              ? query.id
                                              : "",
                                          studentId: (value as Student).id,
                                        });
                                      }}
                                      size="sm"
                                      color="red"
                                      className="h-16"
                                    >
                                      Отклонить <br /> заявку
                                    </Button>
                                  </div>
                                </ListItem>
                              )}
                              {(value as Student).status === "Declined" && (
                                <ListItem className="drop-shadow-none">
                                  <div>
                                    <Typography variant="lead">
                                      {(value as Student).name}
                                    </Typography>
                                    <Typography
                                      variant="paragraph"
                                      className={
                                        StudentStatusColor[
                                          (value as Student).status
                                        ]
                                      }
                                    >
                                      {
                                        StudentStatusConvertions[
                                          (value as Student).status
                                        ]
                                      }
                                    </Typography>
                                    <Typography variant="paragraph">
                                      {(value as Student).email}
                                    </Typography>
                                  </div>
                                </ListItem>
                              )}
                            </>
                          ) : (
                            <>
                              {(value as Student).email === profileEmail && (
                                <ListItem className="drop-shadow-none grid grid-cols-3 gap-4">
                                  <div>
                                    <Typography variant="lead">
                                      {(value as Student).name}
                                    </Typography>
                                    <Typography
                                      variant="paragraph"
                                      className={
                                        StudentStatusColor[
                                          (value as Student).status
                                        ]
                                      }
                                    >
                                      {
                                        StudentStatusConvertions[
                                          (value as Student).status
                                        ]
                                      }
                                    </Typography>
                                    <Typography variant="paragraph">
                                      {(value as Student).email}
                                    </Typography>
                                  </div>
                                  <div className="flex">
                                    <Typography
                                      onClick={() => {
                                        setStudentId((value as Student).id);
                                        setMarkType("Midterm");
                                        handleOpenMark();
                                      }}
                                      variant="paragraph"
                                    >
                                      Промежуточная аттестация
                                    </Typography>
                                    <Button
                                      className="ml-2"
                                      size="sm"
                                      //@ts-ignore
                                      color={
                                        MarkColor[
                                          (value as Student).midtermResult
                                        ]
                                      }
                                    >
                                      {
                                        MarkConvertions[
                                          (value as Student).midtermResult
                                        ]
                                      }
                                    </Button>
                                  </div>
                                  <div className="flex">
                                    <Typography
                                      onClick={() => {
                                        setStudentId((value as Student).id);
                                        setMarkType("Final");
                                        handleOpenMark();
                                      }}
                                      variant="paragraph"
                                    >
                                      Финальная аттестация
                                    </Typography>
                                    <Button
                                      className="ml-2"
                                      size="sm"
                                      //@ts-ignore
                                      color={
                                        MarkColor[
                                          (value as Student).finalResult
                                        ]
                                      }
                                    >
                                      {
                                        MarkConvertions[
                                          (value as Student).finalResult
                                        ]
                                      }
                                    </Button>
                                  </div>
                                </ListItem>
                              )}
                              {(value as Student).email !== profileEmail &&
                                (value as Student).status === "Accepted" && (
                                  <ListItem className="drop-shadow-none">
                                    <div>
                                      <Typography variant="lead">
                                        {(value as Student).name}
                                      </Typography>
                                      <Typography
                                        variant="paragraph"
                                        className={
                                          StudentStatusColor[
                                            (value as Student).status
                                          ]
                                        }
                                      >
                                        {
                                          StudentStatusConvertions[
                                            (value as Student).status
                                          ]
                                        }
                                      </Typography>
                                      <Typography variant="paragraph">
                                        {(value as Student).email}
                                      </Typography>
                                    </div>
                                  </ListItem>
                                )}
                            </>
                          )}
                        </>
                      ) : (
                        <ListItem className="flex gap-6">
                          <div>
                            <Typography variant="lead" className="text-black">
                              {(value as Teacher).name}
                            </Typography>
                            <Typography variant="paragraph">
                              {(value as Teacher).email}
                            </Typography>
                          </div>
                          {!!(value as Teacher).isMain && (
                            <Button color="green">Основной</Button>
                          )}
                        </ListItem>
                      )}
                    </Card>
                  </>
                );
              })}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </>
  );
};

export default DetailedCourse;
