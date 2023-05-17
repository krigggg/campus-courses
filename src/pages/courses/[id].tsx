import { useGetCourcesDetailsQuery } from "@/services/course/courseApi";
import { Student, Teacher } from "@/services/course/type";
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

const DetailedCourse = () => {
  const { query } = useRouter();
  const { data } = useGetCourcesDetailsQuery(
    typeof query.id === "string" ? query.id : ""
  );

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

  return (
    <>
      <Typography variant="h2">{data?.name}</Typography>
      <Typography variant="h5" className="mt-4">
        {" "}
        Основные данные курса
      </Typography>
      <Card className="w-full mt-2">
        <ListItem className="flex flex-row justify-between border rounded-b-none">
          <div>
            <Typography variant="lead">Статус курса</Typography>
            <Typography variant="paragraph">{data?.status}</Typography>
          </div>
          <div>
            <Button>Изменить</Button>
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
            <Typography variant="paragraph">{data?.semester}</Typography>
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

      <Tabs value="requirements" className="mt-8">
        <TabsHeader>
          {tabsDetails.map(({ label, value }) => (
            <Tab key={value} value={value}>
              {value === "notifications" ? (
                <Badge
                  className="-right-3 top-2"
                  content={
                    data?.notifications.length > 3
                      ? "3+"
                      : data?.notifications.length
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
            <TabPanel key={value} value={value}>
              {desc && typeof desc === "string" ? (
                <ListItem>
                  <div dangerouslySetInnerHTML={{ __html: desc }}></div>
                </ListItem>
              ) : (
                <>
                  {desc &&
                    typeof desc !== "string" &&
                    desc?.map((notification: any, index: number) => (
                      <ListItem key={index} className="border">
                        {notification.text}
                      </ListItem>
                    ))}
                </>
              )}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>

      <Tabs value="teachers" className="mt-8">
        <TabsHeader>
          {tabsUser.map(({ label, value }) => (
            <Tab key={value} value={value}>
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {tabsUser.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
              {desc?.map((value, index) => {
                return (
                  <Card className="w-full" key={index}>
                    {(value as Student).status !== undefined &&
                    typeof (value as Student).status === "string" ? (
                      <ListItem className="grid grid-cols-3 gap-4 justify-between">
                        <div>
                          <Typography variant="lead">
                            {(value as Student).name}
                          </Typography>
                          <Typography variant="paragraph">
                            {(value as Student).status}
                          </Typography>
                          <Typography variant="paragraph">
                            {(value as Student).email}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="paragraph">
                            Промежуточная аттестация
                          </Typography>
                          <Typography variant="paragraph">
                            {(value as Student).midtermResult}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="paragraph">
                            Финальная аттестация
                          </Typography>
                          <Typography variant="paragraph">
                            {(value as Student).finalResult}
                          </Typography>
                        </div>
                      </ListItem>
                    ) : (
                      <ListItem>
                        <div>
                          <Typography variant="lead">
                            {(value as Teacher).name}
                          </Typography>
                          <Typography variant="paragraph">
                            {(value as Teacher).email}
                          </Typography>
                        </div>
                      </ListItem>
                    )}
                  </Card>
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
