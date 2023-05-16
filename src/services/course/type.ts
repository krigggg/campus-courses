type CourseStatus = "Created" | "OpenForAssigning" | "Started" | "Finished";

type Semester = "Spring" | "Autumn"

export type Course = {
    id: string;
    name: string;
    startYear: number;
    maximumStudentsCount: number;
    remainingSlotsCount: number;
    status: CourseStatus;
    semester: Semester;
  }
  
  
type ExcludeFromCourse = "id" | "remainingSlotsCount" | "status";
export type CourseRequest = Omit<Course, ExcludeFromCourse> & { 
    groupId: string, 
    requirements: string, 
    annotations: string, 
    mainTeacherId: string 
}

export type StudentStatus = "InQueue" | "Accepted" | "Declined";
export type StudentMarks = "NotDefined" | "Passed" | "Failed";

export type Student = {
    id: string;
    name: string;
    email: string;
    status: StudentStatus;
    midtermResult: StudentMarks;
    finalResult: StudentMarks;
}

export type Teacher = {
    name: string;
    email: string;
    isMain: boolean;
}

export type Notification = {
    text: string;
    isImportant: boolean;
}

type CourseDetailsWithExtraFields = Course & ExcludeFromCourse & {
    studentsEnrolledCount: number;
    studentsInQueueCount: number;
    students: Student[],
    teachers: Teacher[],
    notifications: Notification[],
}

export type CourseDetails = Omit<CourseRequest & CourseDetailsWithExtraFields, "mainTeacherId">

export type AddTeacherRequest = {
    userId: string;
    courseId: string;
}

export type AddNotification = {
    courseId: string;
} & Notification;