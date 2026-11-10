/* Bal Jyoti School OS — demo account manifest.
 * Synthetic account labels and stable IDs. This file does NOT create Firebase Auth users.
 * Create the matching Google/Firebase identities in baljyoti-school-os-staging first.
 */
(function(){
"use strict";
window.BJ_DEMO_ACCOUNTS=[
 {demoId:"PRINCIPAL-DEMO",displayName:"Principal Demo",email:"principal.demo@baljyoti.com",role:"principal",accountType:"staff",status:"active",purpose:"School leadership and approvals"},
 {demoId:"COORDINATOR-DEMO",displayName:"Academic Coordinator Demo",email:"coordinator.demo@baljyoti.com",role:"academic_coordinator",accountType:"staff",status:"active",purpose:"Academic coordination and monitoring"},
 {demoId:"TEACHER-DEMO",displayName:"Teacher Demo",email:"teacher.demo@baljyoti.com",role:"teacher",accountType:"staff",status:"active",purpose:"Assigned classes, attendance, homework and marks"},
 {demoId:"ACCOUNTANT-DEMO",displayName:"Accountant Demo",email:"accountant.demo@baljyoti.com",role:"accountant",accountType:"staff",status:"active",purpose:"Fee and accounts workflows"},
 {demoId:"STUDENT-DEMO",displayName:"Student Demo",email:"student.demo@baljyoti.com",role:"student",accountType:"student",status:"active",admissionNumber:"DEMO-26001",purpose:"Own student workspace"},
 {demoId:"PARENT-DEMO",displayName:"Parent Demo",email:"parent.demo@baljyoti.com",role:"parent",accountType:"parent",status:"active",linkedAdmissionNumbers:["DEMO-26001"],purpose:"Verified demo child view; link verification must be completed in staging"}
];
})();