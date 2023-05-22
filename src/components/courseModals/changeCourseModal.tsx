import { useEditCourseDataMutation } from "@/services/course/courseApi";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  Typography,
} from "@material-tailwind/react";
import { FC, useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object({
  requirements: yup.string(),
  annotations: yup.string(),
});

type ChangeCourseModalProps = {
  courseId: string;
  requirements: string;
  annotations: string;
  open: boolean;
  handleOpen: any;
};

type ChangeCourseRequest = {
  annotations: string;
  requirements: string;
};

const ChangeCourseModal: FC<ChangeCourseModalProps> = ({
  requirements,
  annotations,
  courseId,
  open,
  handleOpen,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChangeCourseRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      annotations: annotations,
      requirements: requirements,
    },
  });
  const editorRef: any = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [requirementsData, setRequirementsData] = useState(requirements);
  const [annotationsData, setAnnotationsData] = useState(annotations);

  console.log(requirementsData, annotationsData, courseId);

  useEffect(() => {
    editorRef.current = {
      // CKEditor: require('@ckeditor/ckeditor5-react'), // depricated in v3
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
    if (typeof window !== "undefined") setEditorLoaded(true);
  }, []);

  useEffect(() => {
    setRequirementsData(requirements), setAnnotationsData(annotations);
  }, [requirements, annotations]);

  const [editCourse] = useEditCourseDataMutation();
  const onSubmit: SubmitHandler<ChangeCourseRequest> = async (data) => {
    console.log(data);
    try {
      await editCourse({
        courseId,
        requirements: requirementsData,
        annotations: annotationsData,
      }).unwrap();
      toast.success("Course has been changed");
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
            <span>Change</span>
          </Button>
        </CardFooter>
      </form>
    </Dialog>
  ) : null;
};

export default ChangeCourseModal;
