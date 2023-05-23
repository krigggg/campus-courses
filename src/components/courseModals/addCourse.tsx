import { useAddCourseMutation } from "@/services/course/courseApi";
import { useGetAllUsersQuery } from "@/services/user/userApi";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  Input,
  Radio,
  Typography,
} from "@material-tailwind/react";
import { FC, useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required(),
  startYear: yup.string().required(),
  maximumStudentsCount: yup.string().required(),
  requirements: yup.string(),
  annotations: yup.string(),
  semester: yup.string().required(),
  mainTeacherId: yup.string().required(),
});

type ChangeCourseModalProps = {
  groupId: string;
  open: boolean;
  handleOpen: any;
};

type AddCourseRequest = {
  groupId: string;
  name: string;
  startYear: string;
  maximumStudentsCount: string;
  annotations: string;
  requirements: string;
  semester: string;
  mainTeacherId: string;
};

const AddCourseModal: FC<ChangeCourseModalProps> = ({
  groupId,
  open,
  handleOpen,
}) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<AddCourseRequest>({
    resolver: yupResolver(schema),
  });
  const editorRef: any = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [requirementsData, setRequirementsData] = useState("");
  const [annotationsData, setAnnotationsData] = useState("");
  const users = useGetAllUsersQuery().data;

  useEffect(() => {
    editorRef.current = {
      // CKEditor: require('@ckeditor/ckeditor5-react'), // depricated in v3
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
    if (typeof window !== "undefined") setEditorLoaded(true);
  }, []);

  const [addCourse] = useAddCourseMutation();
  const onSubmit: SubmitHandler<AddCourseRequest> = async (data) => {
    console.log(data);
    try {
      await addCourse({ ...data, groupId: groupId }).unwrap();
      toast.success("Course has been added");
    } catch (err: any) {
      if (err?.data?.message) {
        toast.error(err.data.message);
      } else {
        toast.error("Hoops... Something went wrong");
      }
    }
  };

  return editorLoaded ? (
    <Dialog
      open={open}
      handler={handleOpen}
      size="sm"
      className="overflow-auto max-h-[90%] pt-10"
    >
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
            Change course details
          </Typography>
        </CardHeader>
      </Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardBody>
          <Input label="Course name" {...register("name")} />
          <div className="mt-4">
            <Input label="Start year" {...register("startYear")} />
          </div>
          <div className="mt-4">
            <Input
              label="Max students count"
              {...register("maximumStudentsCount")}
            />
          </div>
          <div className="mt-4">
            <Radio label="Осенний" value="Autumn" {...register("semester")} />
            <Radio {...register("semester")} label="Весенний" value="Spring" />
          </div>
          <Controller
            name="requirements"
            control={control}
            render={({
              field: { onChange, onBlur, value, ref },
              formState,
              fieldState,
            }) => (
              <CKEditor
                editor={ClassicEditor}
                data={requirementsData}
                onChange={(event: any, editor: { getData: () => any }) => {
                  const data = editor.getData();
                  setRequirementsData(data);
                  onChange(data);
                }}
              />
            )}
          />
          <Controller
            name="annotations"
            control={control}
            render={({
              field: { onChange, onBlur, value, ref },
              formState,
              fieldState,
            }) => (
              <>
                <CKEditor
                  editor={ClassicEditor}
                  data={annotationsData}
                  onChange={(event: any, editor: { getData: () => any }) => {
                    const data = editor.getData();
                    setAnnotationsData(data);
                    onChange(data);
                  }}
                />
              </>
            )}
          />
          <select
            className="mt-4 p-2 font-montserrat border-2 border-slate-200 rounded-md border-solid"
            {...register("mainTeacherId")}
          >
            {users?.map((user: User) => (
              <option key={user.id} value={user.id}>
                {user.fullName}
              </option>
            ))}
          </select>
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
            <span>Add</span>
          </Button>
        </CardFooter>
      </form>
    </Dialog>
  ) : null;
};

export default AddCourseModal;
