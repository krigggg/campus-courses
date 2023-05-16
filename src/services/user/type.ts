export type Profile = {
    fullName: string;
    email: string;
    birthDate: Date;
  }
  
  export type Login = {
    email: string;
    password: string;
  }
  
  export type IUser = {
    id: string;
    fullName: string;
  }
  
  export type Registration = Profile & Login;
  
  export type Role = "Teacher" | "Student" | "Admin";
  
  export type RolesList = {
    [P in Role as `is${P}`]: boolean;
  }