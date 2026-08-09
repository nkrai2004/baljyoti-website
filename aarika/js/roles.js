export const AARIKA_ROLES = [
  {id:"SUPER_ADMIN", name:"Super Admin", scope:"Platform", description:"Full platform administration and tenant management."},
  {id:"SCHOOL_ADMIN", name:"School Admin", scope:"School", description:"Manage one school and its operational modules."},
  {id:"TEACHER", name:"Teacher", scope:"School", description:"Academic, attendance and classroom functions."},
  {id:"ACCOUNTANT", name:"Accountant", scope:"School", description:"Fees, finance and accounting functions."},
  {id:"FRONT_OFFICE", name:"Front Office", scope:"School", description:"Admissions, enquiries and front-office operations."},
  {id:"PARENT", name:"Parent", scope:"Family", description:"View child information, communication and payments."},
  {id:"STUDENT", name:"Student", scope:"Student", description:"Learning, attendance, timetable and student services."}
];

export const PERMISSIONS = [
  ["dashboard.view","Dashboard"],
  ["school.manage","School Management"],
  ["users.manage","Users"],
  ["roles.manage","Roles & Permissions"],
  ["students.manage","Students"],
  ["teachers.manage","Teachers"],
  ["attendance.manage","Attendance"],
  ["academics.manage","Academics"],
  ["fees.manage","Fees & Finance"],
  ["admissions.manage","Admissions"],
  ["communication.manage","Communication"],
  ["reports.view","Reports"],
  ["settings.manage","Settings"],
  ["audit.view","Audit & Activity"]
];
