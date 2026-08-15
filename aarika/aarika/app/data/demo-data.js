// AARIKA DEMO DATA — Bal Jyoti Public School
// Front-end demo dataset for GitHub Pages. No real student/parent data is used.

const names = [
  "Aarav Sharma","Aditi Verma","Advait Singh","Ananya Gupta","Arjun Mehta","Avni Kapoor","Devansh Jain","Diya Malhotra","Ishaan Rao","Ira Khanna",
  "Kabir Sethi","Kiara Bansal","Krish Agarwal","Meera Joshi","Neil Bhatia","Navya Arora","Reyansh Tiwari","Riya Saxena","Rohan Nair","Sara Khan",
  "Shaurya Mishra","Siya Kapoor","Vedant Roy","Vanya Das","Vivaan Malhotra","Zoya Ali","Advik Kumar","Anika Shah","Dhruv Gupta","Myra Sen"
];

const teacherNames = [
  "Anil Gupta","Sunita Sharma","Mamta Verma","Rakesh Kumar","Neha Singh","Pooja Mehta","Rajesh Tiwari","Priya Nair","Vivek Jain","Kavita Rao",
  "Sanjay Kapoor","Ritu Bansal","Amit Joshi","Shalini Arora","Manoj Sethi"
];

export function createDemoData(){
  const students = names.map((name, i) => ({
    id:`STU-${String(1001+i).padStart(4,"0")}`,
    admissionNo:`BJPS/${26+(i%3)}/${String(101+i).padStart(3,"0")}`,
    name,
    className:`Class ${5 + (i%6)}`,
    section:["A","B","C"][i%3],
    gender:i%2===0?"Male":"Female",
    rollNo:(i%10)+1,
    attendance:[96,94,91,89,98,87,93,95,90,97][i%10],
    feeStatus:["Paid","Paid","Paid","Partial","Paid"][i%5],
    transport:i%3!==0?`Route ${1+(i%5)}`:"Self",
    status:"Active"
  }));

  const teachers = teacherNames.map((name,i)=>({
    id:`TCH-${String(201+i).padStart(3,"0")}`,
    name,
    designation:i<11?"Teacher":"Staff",
    department:["Mathematics","Science","English","Hindi","Social Science"][i%5],
    classes:[`Class ${5+(i%6)}-${["A","B","C"][i%3]}`],
    attendance:[98,96,94,97,92][i%5],
    status:"Active"
  }));

  const classes=["5-A","5-B","6-A","6-B","7-A","7-B","8-A","8-B","9-A","9-B","10-A","10-B"].map((x,i)=>({
    id:`CLS-${i+1}`,
    name:`Class ${x.split("-")[0]}`,
    section:x.split("-")[1],
    room:`${101+i}`,
    classTeacher:teachers[i%teachers.length].name,
    students:24+(i%8),
    capacity:40,
    status:"Active"
  }));

  const subjects=["English","Hindi","Mathematics","Science","Social Science","Computer Science","Physical Education","Art & Activity","General Knowledge"];
  const timetable=[
    ["08:00","08:45","Mathematics","Class 10-A","Neha Singh"],["08:45","09:30","Science","Class 10-A","Pooja Mehta"],
    ["09:45","10:30","English","Class 9-A","Sunita Sharma"],["10:30","11:15","Social Science","Class 8-B","Rajesh Tiwari"],
    ["11:30","12:15","Hindi","Class 7-A","Ritu Bansal"],["12:15","13:00","Computer Science","Class 6-B","Vivek Jain"]
  ].map((r,i)=>({id:`TT-${i+1}`,time:`${r[0]}–${r[1]}`,subject:r[2],className:r[3],teacher:r[4],room:`${201+i}`}));

  const assessments=[
    ["Periodic Test 1","Mathematics","Class 10-A","18 Aug 2026",40,"Scheduled"],
    ["Periodic Test 1","Science","Class 10-A","20 Aug 2026",40,"Scheduled"],
    ["Unit Test","English","Class 9-A","19 Aug 2026",30,"Scheduled"],
    ["Project Review","Social Science","Class 8-B","22 Aug 2026",25,"Scheduled"],
    ["Practical","Computer Science","Class 7-A","25 Aug 2026",30,"Scheduled"]
  ].map((r,i)=>({id:`ASM-${i+1}`,title:r[0],subject:r[1],className:r[2],date:r[3],maxMarks:r[4],status:r[5]}));

  const admissions=[
    ["ADM-26001","Aarushi Mehta","Class 6","Parent enquiry","12 Aug 2026","Documents pending","High"],
    ["ADM-26002","Vihaan Kapoor","Class 8","Application","11 Aug 2026","Verification pending","High"],
    ["ADM-26003","Ishita Sharma","Class 5","Application","10 Aug 2026","Interview scheduled","Medium"],
    ["ADM-26004","Aditya Rao","Class 9","Enquiry","09 Aug 2026","Follow-up due","Medium"],
    ["ADM-26005","Anvi Jain","Class 7","Application","08 Aug 2026","Approved","Low"],
    ["ADM-26006","Rudra Singh","Class 6","Application","07 Aug 2026","Fee confirmation","Medium"],
    ["ADM-26007","Myra Gupta","Class 10","Enquiry","06 Aug 2026","Counselling completed","Low"],
    ["ADM-26008","Arnav Nair","Class 5","Application","05 Aug 2026","Documents verified","Low"]
  ].map(r=>({id:r[0],student:r[1],className:r[2],source:r[3],date:r[4],stage:r[5],priority:r[6]}));

  const attendance = students.slice(0,20).map((s,i)=>({studentId:s.id,name:s.name,className:`${s.className}-${s.section}`,status:i%9===0?"Absent":i%7===0?"Late":"Present",time:i%9===0?"—":"07:45 AM"}));

  const fees=students.slice(0,15).map((s,i)=>({id:`FEE-${i+1}`,student:s.name,className:`${s.className}-${s.section}`,term:"Q2",amount:18000+(i%4)*1500,paid:i%5===3?12000:18000+(i%4)*1500,status:i%5===3?"Partial":"Paid",due:"31 Aug 2026"}));

  const transport=[
    ["BUS-01","Route 1","Ashok Nagar → School","Rakesh Kumar",34,40,"On route"],
    ["BUS-02","Route 2","Indira Nagar → School","Sanjay Kapoor",29,40,"On route"],
    ["BUS-03","Route 3","Gomti Nagar → School","Manoj Sethi",31,40,"At school"],
    ["BUS-04","Route 4","Aliganj → School","Vivek Jain",26,40,"On route"],
    ["BUS-05","Route 5","Mahanagar → School","Amit Joshi",23,40,"On route"]
  ].map(r=>({id:r[0],route:r[1],stops:r[2],driver:r[3],students:r[4],capacity:r[5],status:r[6]}));

  const maintenance=[
    ["MT-1001","Science Lab projector","Academic Block","High","Open","14 Aug 2026"],
    ["MT-1002","Class 8-B fan","Academic Block","Medium","Assigned","13 Aug 2026"],
    ["MT-1003","Water dispenser","Admin Block","Low","Closed","12 Aug 2026"],
    ["MT-1004","Bus 03 GPS","Transport","Medium","Open","12 Aug 2026"],
    ["MT-1005","Library AC","Library","High","In progress","11 Aug 2026"]
  ].map(r=>({id:r[0],issue:r[1],location:r[2],priority:r[3],status:r[4],reported:r[5]}));

  const activities=[
    ["08:10","Attendance marked","Class 10-A","Academic"],["08:35","Admission follow-up completed","ADM-26007","Admissions"],
    ["09:00","Bus Route 2 departed","Route 2","Transport"],["09:25","Assessment timetable updated","Periodic Test 1","Academic"],
    ["10:05","Maintenance ticket assigned","MT-1002","Administration"],["10:30","Fee receipt generated","FEE-1004","Finance"]
  ].map((r,i)=>({id:`ACT-${i+1}`,time:r[0],action:r[1],reference:r[2],category:r[3]}));

  const events=[
    ["17 Aug 2026","Independence Day Reflection","School","All students"],["18 Aug 2026","Periodic Test 1 – Mathematics","Academic","Classes 9–10"],
    ["20 Aug 2026","Parent-Teacher Meeting","School","All parents"],["22 Aug 2026","Science Exhibition","Activity","Classes 6–10"],
    ["28 Aug 2026","Monthly Staff Review","Administration","Teachers & staff"]
  ].map((r,i)=>({id:`EVT-${i+1}`,date:r[0],title:r[1],type:r[2],audience:r[3]}));

  const audit=[
    ["15 Aug 2026 09:56","Google sign-in","Director Bal Jyoti","Authentication"],
    ["15 Aug 2026 09:42","Admission record updated","Admissions Team","Admissions"],
    ["15 Aug 2026 09:31","Attendance submitted","Sunita Sharma","Academic"],
    ["14 Aug 2026 16:45","Fee receipt generated","Accounts","Finance"],
    ["14 Aug 2026 15:20","Maintenance ticket closed","Admin","Administration"]
  ].map((r,i)=>({id:`AUD-${i+1}`,time:r[0],action:r[1],user:r[2],module:r[3]}));

  return {
    school:{name:"Bal Jyoti Public School",session:"2026–27",location:"Lucknow, Uttar Pradesh",principal:"Director Bal Jyoti",students:students.length,teachers:teachers.length,classes:classes.length},
    students,teachers,classes,subjects,timetable,assessments,admissions,attendance,fees,transport,maintenance,activities,events,audit,
    ai:{attendanceRisk:3,admissionFollowups:4,academicAlerts:2,operationalAlerts:3,brief:"Overall school operations are stable. Attendance is strong, four admission follow-ups need attention, and three operational exceptions are open."}
  };
}

export function money(value){ return `₹${Number(value||0).toLocaleString("en-IN")}`; }
