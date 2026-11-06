
window.BJ_ERP_CONFIG = {
  schoolName: "Bal Jyoti Public School",
  applicationName: "Bal Jyoti ERP",
  version: "1.1",

  roles: {
    SUPER_ADMIN: "super_admin",
    DIRECTOR: "director",
    PRINCIPAL: "principal",
    ADMIN: "administrator",
    ACADEMIC_COORDINATOR: "academic_coordinator",
    ADMISSION_COORDINATOR: "admission_coordinator",
    ACTIVITY_COORDINATOR: "activity_coordinator",
    SPORTS_DISCIPLINE_COORDINATOR: "sports_discipline_coordinator",
    TEACHER: "teacher",
    ACCOUNTANT: "accountant",
    HR_MANAGER: "hr_manager",
    STAFF: "staff"
  },

  modules: [
    {
      id: "dashboard",
      name: "Dashboard",
      roles: "all"
    },
    {
      id: "admissions",
      name: "Admissions",
      roles: ["super_admin", "director", "principal", "administrator", "admission_coordinator"]
    },
    {
      id: "academics",
      name: "Academic Management",
      roles: ["super_admin", "director", "principal", "administrator", "academic_coordinator", "teacher"]
    },
    {
      id: "students",
      name: "Student Management",
      roles: ["super_admin", "director", "principal", "administrator", "academic_coordinator", "teacher", "admission_coordinator"]
    },
    {
      id: "attendance",
      name: "Attendance",
      roles: ["super_admin", "director", "principal", "administrator", "academic_coordinator", "teacher", "hr_manager", "staff"]
    },
    {
      id: "examinations",
      name: "Examinations & Results",
      roles: ["super_admin", "director", "principal", "academic_coordinator", "teacher"]
    },
    {
      id: "activities",
      name: "Activities & Events",
      roles: ["super_admin", "director", "principal", "activity_coordinator", "teacher"]
    },
    {
      id: "sports_discipline",
      name: "Sports & Discipline",
      roles: ["super_admin", "director", "principal", "sports_discipline_coordinator", "teacher"]
    },
    {
      id: "hr",
      name: "Staff & HR Management",
      roles: ["super_admin", "director", "administrator", "hr_manager"]
    },
    {
      id: "staff_tasks",
      name: "My Staff Tasks",
      roles: ["super_admin", "director", "administrator", "hr_manager", "staff"]
    },
    {
      id: "finance",
      name: "Fees & Finance",
      roles: ["super_admin", "director", "administrator", "accountant"]
    },
    {
      id: "operations",
      name: "School Operations",
      roles: ["super_admin", "director", "principal", "administrator", "academic_coordinator", "activity_coordinator", "sports_discipline_coordinator", "staff"]
    },
    {
      id: "reports",
      name: "Reports & MIS",
      roles: ["super_admin", "director", "principal", "administrator", "academic_coordinator", "admission_coordinator", "accountant", "hr_manager"]
    },
    {
      id: "settings",
      name: "System Settings & User Access",
      roles: ["super_admin"]
    }
  ],

  getModulesForRole: function(role) {
    return this.modules.filter(module =>
      module.roles === "all" || module.roles.includes(role)
    );
  }
};
