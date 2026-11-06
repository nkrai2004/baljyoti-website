
window.BJ_ERP_USER_CONFIG = {
  collection: "users",
  version: "1.1",

  profileFields: [
    "uid",
    "fullName",
    "email",
    "employeeId",
    "designation",
    "department",
    "role",
    "status",
    "joiningDate",
    "createdAt",
    "updatedAt"
  ],

  status: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    PENDING: "pending"
  },

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

  authority: {
    super_admin: {
      createUser: true,
      editProfile: true,
      assignRole: true,
      changePermissions: true,
      activateUser: true,
      deactivateUser: true,
      requestAccessChange: false
    },

    director: {
      createUser: true,
      editProfile: true,
      assignRole: false,
      changePermissions: false,
     assignRole: true,
activateUser: true,
deactivateUser: true,
    },

    administrator: {
      createUser: true,
      editProfile: true,
      assignRole: false,
      changePermissions: false,
      activateUser: false,
      deactivateUser: false,
      requestAccessChange: false
    },

    principal: {
      createUser: false,
      editProfile: false,
      assignRole: false,
      changePermissions: false,
      activateUser: false,
      deactivateUser: false,
      requestAccessChange: true
    },

    academic_coordinator: {
      createUser: false,
      editProfile: false,
      assignRole: false,
      changePermissions: false,
      activateUser: false,
      deactivateUser: false,
      requestAccessChange: false
    },

    admission_coordinator: {
      createUser: false,
      editProfile: false,
      assignRole: false,
      changePermissions: false,
      activateUser: false,
      deactivateUser: false,
      requestAccessChange: false
    },

    activity_coordinator: {
      createUser: false,
      editProfile: false,
      assignRole: false,
      changePermissions: false,
      activateUser: false,
      deactivateUser: false,
      requestAccessChange: false
    },

    sports_discipline_coordinator: {
      createUser: false,
      editProfile: false,
      assignRole: false,
      changePermissions: false,
      activateUser: false,
      deactivateUser: false,
      requestAccessChange: false
    },

    teacher: {
      createUser: false,
      editProfile: false,
      assignRole: false,
      changePermissions: false,
      activateUser: false,
      deactivateUser: false,
      requestAccessChange: false
    },

    accountant: {
      createUser: false,
      editProfile: false,
      assignRole: false,
      changePermissions: false,
      activateUser: false,
      deactivateUser: false,
      requestAccessChange: false
    },

    hr_manager: {
      createUser: false,
      editProfile: true,
      assignRole: false,
      changePermissions: false,
      activateUser: false,
      deactivateUser: false,
      requestAccessChange: false
    },

    staff: {
      createUser: false,
      editProfile: false,
      assignRole: false,
      changePermissions: false,
      activateUser: false,
      deactivateUser: false,
      requestAccessChange: false
    }
  }
};
