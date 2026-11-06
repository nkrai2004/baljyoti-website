
/* =========================================
   BAL JYOTI ERP
   USER PROFILE CONFIGURATION
   Version: 1.0
   ========================================= */

window.BJ_ERP_USER_CONFIG = {

  collection: "users",

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

  // User-management authority
  authority: {

    director: {
      createUser: true,
      editProfile: true,
      assignRole: true,
      changePermissions: true,
      activateUser: true,
      deactivateUser: true
    },

    administrator: {
      createUser: true,
      editProfile: true,
      assignRole: false,
      changePermissions: false,
      activateUser: false,
      deactivateUser: false
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
      deactivateUser: false
    },

    teacher: {
      createUser: false,
      editProfile: false,
      assignRole: false,
      changePermissions: false,
      activateUser: false,
      deactivateUser: false
    },

    accountant: {
      createUser: false,
      editProfile: false,
      assignRole: false,
      changePermissions: false,
      activateUser: false,
      deactivateUser: false
    },

    hr_manager: {
      createUser: false,
      editProfile: true,
      assignRole: false,
      changePermissions: false,
      activateUser: false,
      deactivateUser: false
    }

  }

};
