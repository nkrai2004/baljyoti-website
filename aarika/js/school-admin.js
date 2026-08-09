const SCHOOL_MODULES = [
  ["dashboard.html","⌂","Dashboard"],
  ["students.html","♙","Students"],
  ["teachers.html","♟","Teachers"],
  ["parents.html","♡","Parents"],
  ["attendance.html","✓","Attendance"],
  ["academics.html","▤","Academics"],
  ["timetable.html","◫","Timetable"],
  ["exams.html","◈","Examinations"],
  ["fees.html","₹","Fees & Finance"],
  ["admissions.html","＋","Admissions"],
  ["communication.html","✉","Communication"],
  ["transport.html","▰","Transport"],
  ["library.html","▥","Library"],
  ["inventory.html","▦","Inventory"],
  ["reports.html","▥","Reports"],
  ["settings.html","⚙","School Settings"]
];

function schoolSession(){
  const s=requireSession("SCHOOL_ADMIN");
  if(!s) return null;
  const selected=JSON.parse(sessionStorage.getItem("selectedSchool")||"null");
  return {s,selected};
}
function safeText(x){return String(x??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
