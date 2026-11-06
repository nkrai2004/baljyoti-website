
/* =========================================
   BAL JYOTI ERP
   Navigation & Role Configuration
   Version: 1.0
   ========================================= */

window.BJ_ERP_CONFIG = {

  schoolName: "Bal Jyoti Public School",

  applicationName: "Bal Jyoti ERP",

  version: "1.0",

  // All available user roles
  roles: {
    DIRECTOR: "director",
    PRINCIPAL: "principal",
    ADMIN: "administrator",
    ACADEMIC_COORDINATOR: "academic_coordinator",
    TEACHER: "teacher",
    ACCOUNTANT: "accountant",
    HR_MANAGER: "hr_manager"
  },

  // Main ERP navigation
  modules: [

    {
      id: "dashboard",
      name: "Dashboard",
      roles: [
        "director",
        "principal",
        "administrator",
        "academic_coordinator",
        "teacher",
        "accountant",
        "hr_manager"
      ]
    },

    {
      id: "academics",
      name: "Academic Management",
      roles: [
        "director",
        "principal",
        "administrator",
        "academic_coordinator",
        "teacher"
      ]
    },

    {
      id: "students",
      name: "Student Management",
      roles: [
        "director",
        "principal",
        "administrator",
        "academic_coordinator",
        "teacher"
      ]
    },

    {
      id: "attendance",
      name: "Attendance",
      roles: [
        "director",
        "principal",
        "administrator",
        "academic_coordinator",
        "teacher",
        "hr_manager"
      ]
    },

    {
      id: "examinations",
      name: "Examinations & Results",
      roles: [
        "director",
        "principal",
        "academic_coordinator",
        "teacher"
      ]
    },

    {
      id: "hr",
      name: "Teachers & HR",
      roles: [
        "director",
        "principal",
        "administrator",
        "hr_manager"
      ]
    },

    {
      id: "finance",
      name: "Fees & Finance",
      roles: [
        "director",
        "administrator",
        "accountant"
      ]
    },

    {
      id: "operations",
      name: "School Operations",
      roles: [
        "director",
        "principal",
        "administrator",
        "academic_coordinator"
      ]
    },

    {
      id: "reports",
      name: "Reports & MIS",
      roles: [
        "director",
        "principal",
        "administrator",
        "academic_coordinator",
        "accountant",
        "hr_manager"
      ]
    },

    {
      id: "settings",
      name: "Settings",
      roles: [
        "director",
        "administrator"
      ]
    }

  ],

  // Get modules available to a particular role
  getModulesForRole: function(role) {

    return this.modules.filter(function(module) {
      return module.roles.includes(role);
    });

  }

};

