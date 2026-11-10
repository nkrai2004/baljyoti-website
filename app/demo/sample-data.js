/* Synthetic Bal Jyoti School OS demo data.
 * All identities and records are fictional. Never use for production.
 * Stable IDs make this dataset suitable for repeatable staging seeding.
 */
(function(){
"use strict";
window.BJ_DEMO_DATA={
 academicYear:{id:"AY-DEMO-2026-27",label:"2026-27",startDate:"2026-04-01",endDate:"2027-03-31",active:true},
 classes:[
  {id:"CLS-DEMO-V",name:"Class V",sortOrder:5},
  {id:"CLS-DEMO-VI",name:"Class VI",sortOrder:6},
  {id:"CLS-DEMO-VII",name:"Class VII",sortOrder:7}
 ],
 sections:[
  {id:"SEC-DEMO-V-A",classId:"CLS-DEMO-V",name:"A"},
  {id:"SEC-DEMO-VI-A",classId:"CLS-DEMO-VI",name:"A"},
  {id:"SEC-DEMO-VII-B",classId:"CLS-DEMO-VII",name:"B"}
 ],
 subjects:[
  {id:"SUB-DEMO-ENG",name:"English",code:"ENG"},
  {id:"SUB-DEMO-MATH",name:"Mathematics",code:"MATH"},
  {id:"SUB-DEMO-SCI",name:"Science",code:"SCI"},
  {id:"SUB-DEMO-HIN",name:"Hindi",code:"HIN"}
 ],
 staff:[
  {id:"STF-DEMO-001",name:"Asha Sharma",designation:"TGT English",department:"Teaching",role:"teacher"},
  {id:"STF-DEMO-002",name:"Rohit Kumar",designation:"TGT Mathematics",department:"Teaching",role:"teacher"},
  {id:"STF-DEMO-003",name:"Meera Verma",designation:"Academic Coordinator",department:"Academics",role:"academic_coordinator"},
  {id:"STF-DEMO-004",name:"Kavita Singh",designation:"Accountant",department:"Finance",role:"accountant"}
 ],
 students:[
  {id:"STU-DEMO-001",admissionNumber:"DEMO-26001",name:"Aarav Demo",classId:"CLS-DEMO-V",sectionId:"SEC-DEMO-V-A",status:"active"},
  {id:"STU-DEMO-002",admissionNumber:"DEMO-26002",name:"Anaya Demo",classId:"CLS-DEMO-V",sectionId:"SEC-DEMO-V-A",status:"active"},
  {id:"STU-DEMO-003",admissionNumber:"DEMO-26003",name:"Kabir Demo",classId:"CLS-DEMO-VI",sectionId:"SEC-DEMO-VI-A",status:"active"},
  {id:"STU-DEMO-004",admissionNumber:"DEMO-26004",name:"Ira Demo",classId:"CLS-DEMO-VII",sectionId:"SEC-DEMO-VII-B",status:"active"}
 ],
 teacherAssignments:[
  {id:"ASN-DEMO-001",staffId:"STF-DEMO-001",classId:"CLS-DEMO-V",sectionId:"SEC-DEMO-V-A",subjectId:"SUB-DEMO-ENG"},
  {id:"ASN-DEMO-002",staffId:"STF-DEMO-002",classId:"CLS-DEMO-VI",sectionId:"SEC-DEMO-VI-A",subjectId:"SUB-DEMO-MATH"}
 ],
 timetable:[
  {id:"TT-DEMO-001",day:"Monday",period:1,classId:"CLS-DEMO-V",sectionId:"SEC-DEMO-V-A",subjectId:"SUB-DEMO-ENG",staffId:"STF-DEMO-001"},
  {id:"TT-DEMO-002",day:"Monday",period:2,classId:"CLS-DEMO-VI",sectionId:"SEC-DEMO-VI-A",subjectId:"SUB-DEMO-MATH",staffId:"STF-DEMO-002"},
  {id:"TT-DEMO-003",day:"Tuesday",period:1,classId:"CLS-DEMO-VII",sectionId:"SEC-DEMO-VII-B",subjectId:"SUB-DEMO-SCI",staffId:"STF-DEMO-001"}
 ],
 attendance:[
  {id:"ATT-DEMO-001",date:"2026-11-10",studentId:"STU-DEMO-001",status:"present"},
  {id:"ATT-DEMO-002",date:"2026-11-10",studentId:"STU-DEMO-002",status:"absent"},
  {id:"ATT-DEMO-003",date:"2026-11-10",studentId:"STU-DEMO-003",status:"present"},
  {id:"ATT-DEMO-004",date:"2026-11-10",studentId:"STU-DEMO-004",status:"present"}
 ],
 homework:[
  {id:"HW-DEMO-001",classId:"CLS-DEMO-V",sectionId:"SEC-DEMO-V-A",subjectId:"SUB-DEMO-ENG",title:"Reading comprehension worksheet",dueDate:"2026-11-12",status:"published"},
  {id:"HW-DEMO-002",classId:"CLS-DEMO-VI",sectionId:"SEC-DEMO-VI-A",subjectId:"SUB-DEMO-MATH",title:"Fractions practice",dueDate:"2026-11-13",status:"published"}
 ],
 assessments:[
  {id:"ASM-DEMO-001",title:"Unit Test 2",classId:"CLS-DEMO-V",subjectId:"SUB-DEMO-ENG",date:"2026-11-18",maxMarks:50,status:"scheduled"}
 ],
 results:[
  {id:"RES-DEMO-001",assessmentId:"ASM-DEMO-001",studentId:"STU-DEMO-001",marks:41,maxMarks:50,publicationStatus:"published"},
  {id:"RES-DEMO-002",assessmentId:"ASM-DEMO-001",studentId:"STU-DEMO-002",marks:36,maxMarks:50,publicationStatus:"published"}
 ],
 feeInvoices:[
  {id:"INV-DEMO-001",studentId:"STU-DEMO-001",academicYearId:"AY-DEMO-2026-27",feeHead:"Tuition Fee",amount:2500,dueDate:"2026-11-10",status:"unpaid"},
  {id:"INV-DEMO-002",studentId:"STU-DEMO-002",academicYearId:"AY-DEMO-2026-27",feeHead:"Tuition Fee",amount:2500,dueDate:"2026-11-10",status:"paid"}
 ],
 announcements:[
  {id:"ANN-DEMO-001",title:"Children's Day Activity",body:"Please bring your activity materials on Friday.",audience:"all",publishDate:"2026-11-10",status:"published"}
 ],
 tasks:[
  {id:"TASK-DEMO-001",title:"Review Class V attendance",ownerStaffId:"STF-DEMO-003",dueDate:"2026-11-11",status:"open"},
  {id:"TASK-DEMO-002",title:"Verify November fee receipts",ownerStaffId:"STF-DEMO-004",dueDate:"2026-11-12",status:"in_progress"}
 ]
};
})();