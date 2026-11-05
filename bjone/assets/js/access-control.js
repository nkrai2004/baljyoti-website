// Shared role registry and module access configuration.
// The Firestore userRoles/{uid} document is the source of truth.
window.BJ_ROLES = [
  "Teacher",
  "Administrator",
  "Principal",
  "Director",
  "Accountant",
  "Coordinator",
  "HR Manager",
  "Transport Manager",
  "Librarian",
  "Exam Coordinator"
];
window.BJ_MODULES = {
  "dashboard": "Dashboard",
  "teachingTools": "Teaching Tools",
  "dailyReports": "Daily Reports",
  "staffManagement": "Staff Management",
  "studentManagement": "Student Management",
  "academicManagement": "Academic Management",
  "attendance": "Attendance",
  "feeManagement": "Fee Management",
  "transport": "Transport Management",
  "library": "Library Management",
  "examinations": "Examination Management",
  "reports": "Reports & Analytics",
  "settings": "ERP Settings"
};
window.BJ_PERMISSIONS = {
  "Teacher": {
    "dashboard": "read",
    "teachingTools": "read",
    "dailyReports": "write",
    "attendance": "read",
    "academicManagement": "read"
  },
  "Administrator": {
    "dashboard": "write",
    "dailyReports": "write",
    "staffManagement": "write",
    "studentManagement": "write",
    "academicManagement": "write",
    "attendance": "write",
    "feeManagement": "write",
    "transport": "write",
    "library": "write",
    "examinations": "write",
    "reports": "write",
    "settings": "write",
    "teachingTools": "read"
  },
  "Principal": {
    "dashboard": "read",
    "teachingTools": "read",
    "dailyReports": "approve",
    "staffManagement": "read",
    "studentManagement": "read",
    "academicManagement": "write",
    "attendance": "read",
    "feeManagement": "read",
    "transport": "read",
    "library": "read",
    "examinations": "read",
    "reports": "read",
    "settings": "read"
  },
  "Director": {
    "dashboard": "admin",
    "teachingTools": "admin",
    "dailyReports": "admin",
    "staffManagement": "admin",
    "studentManagement": "admin",
    "academicManagement": "admin",
    "attendance": "admin",
    "feeManagement": "admin",
    "transport": "admin",
    "library": "admin",
    "examinations": "admin",
    "reports": "admin",
    "settings": "admin"
  },
  "Accountant": {
    "dashboard": "read",
    "feeManagement": "write",
    "reports": "read",
    "studentManagement": "read"
  },
  "Coordinator": {
    "dashboard": "read",
    "dailyReports": "write",
    "attendance": "write",
    "academicManagement": "write",
    "studentManagement": "read",
    "reports": "read"
  },
  "HR Manager": {
    "dashboard": "read",
    "staffManagement": "write",
    "attendance": "read",
    "reports": "read"
  },
  "Transport Manager": {
    "dashboard": "read",
    "transport": "write",
    "studentManagement": "read",
    "reports": "read"
  },
  "Librarian": {
    "dashboard": "read",
    "library": "write",
    "studentManagement": "read"
  },
  "Exam Coordinator": {
    "dashboard": "read",
    "examinations": "write",
    "academicManagement": "read",
    "studentManagement": "read",
    "reports": "read"
  }
};
window.BJ_PORTALS = {
  "Teacher": "teacher.html",
  "Administrator": "administrator.html",
  "Principal": "principal.html",
  "Director": "director.html",
  "Accountant": "accountant.html",
  "Coordinator": "coordinator.html",
  "HR Manager": "hr-manager.html",
  "Transport Manager": "transport-manager.html",
  "Librarian": "librarian.html",
  "Exam Coordinator": "exam-coordinator.html"
};

window.BJ_ROLE_LABELS = {
  "Teacher":"Teacher Portal",
  "Administrator":"Administrator Portal",
  "Principal":"Principal Portal",
  "Director":"Director Portal",
  "Accountant":"Accountant Portal",
  "Coordinator":"Coordinator Portal",
  "HR Manager":"HR Manager Portal",
  "Transport Manager":"Transport Manager Portal",
  "Librarian":"Librarian Portal",
  "Exam Coordinator":"Exam Coordinator Portal"
};

window.BJ_MODULE_PATHS = {
  dashboard: "../modules/dashboard.html",
  teachingTools: "../modules/teaching-tools.html",
  dailyReports: "../modules/daily-reports.html",
  staffManagement: "../modules/staff-management.html",
  studentManagement: "../modules/student-management.html",
  academicManagement: "../modules/academic-management.html",
  attendance: "../modules/attendance.html",
  feeManagement: "../modules/fee-management.html",
  transport: "../modules/transport.html",
  library: "../modules/library.html",
  examinations: "../modules/examinations.html",
  reports: "../modules/reports.html",
  settings: "../modules/settings.html"
};

window.bjCanAccess = function(role, moduleKey, required="read") {
  const actual = (window.BJ_PERMISSIONS[role] || {})[moduleKey];
  if (!actual) return false;
  const rank = {read:1, write:2, approve:2, admin:3};
  return (rank[actual] || 0) >= (rank[required] || 1);
};
