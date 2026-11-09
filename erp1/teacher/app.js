(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const demoStudents = [
    ['Aarav Sharma','BJ26001'],['Aanya Verma','BJ26002'],['Aditya Singh','BJ26003'],['Ananya Gupta','BJ26004'],
    ['Arjun Kumar','BJ26005'],['Diya Sharma','BJ26006'],['Ishaan Verma','BJ26007'],['Kavya Singh','BJ26008'],
    ['Meera Gupta','BJ26009'],['Reyansh Kumar','BJ26010'],['Riya Sharma','BJ26011'],['Vivaan Verma','BJ26012'],
    ['Aditi Singh','BJ26013'],['Dev Gupta','BJ26014'],['Ira Kumar','BJ26015'],['Kabir Sharma','BJ26016'],
    ['Mira Verma','BJ26017'],['Neil Singh','BJ26018'],['Pari Gupta','BJ26019'],['Rohan Kumar','BJ26020'],
    ['Sara Sharma','BJ26021'],['Shaurya Verma','BJ26022'],['Tara Singh','BJ26023'],['Yash Gupta','BJ26024'],
    ['Aarohi Kumar','BJ26025'],['Dhruv Sharma','BJ26026'],['Kiara Verma','BJ26027'],['Manav Singh','BJ26028'],
    ['Navya Gupta','BJ26029'],['Pranav Kumar','BJ26030'],['Saanvi Sharma','BJ26031'],['Ved Verma','BJ26032']
  ].map(([name, admissionNo]) => ({name, admissionNo}));
  let attendance = new Map(demoStudents.map(s => [s.admissionNo, 'present']));
  let toastTimer;
  function toast(message) {
    const el = $('toast'); el.textContent = message; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
  }
  function showView(name) {
    document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === `view-${name}`));
    document.querySelectorAll('.nav-item[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === name));
    const labels = {home:'My Day', timetable:'My Timetable', attendance:'Take Attendance', lessons:'Lesson Plans', homework:'Homework', students:'My Students'};
    $('pageTitle').textContent = labels[name] || 'My Day';
    $('sidebar').classList.remove('open'); window.scrollTo({top:0,behavior:'smooth'});
  }
  document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => showView(b.dataset.view)));
  document.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => showView(b.dataset.open)));
  $('menuButton').addEventListener('click', () => $('sidebar').classList.toggle('open'));
  $('todayLabel').textContent = new Date().toLocaleDateString('en-IN', {weekday:'long',day:'numeric',month:'long',year:'numeric'}) + ' · Here is what needs your attention today.';
  const today = new Date();
  const localDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  ['attendanceDate','lessonDate'].forEach(id => $(id).value = localDate);
  $('homeworkDue').value = localDate;

  function renderAttendance() {
    $('studentAttendance').innerHTML = demoStudents.map(s => {
      const status = attendance.get(s.admissionNo);
      return `<div class="student-row"><div><span class="student-name">${s.name}</span><span class="student-meta">${s.admissionNo}</span></div><div class="status-toggle"><button data-id="${s.admissionNo}" data-status="present" class="${status==='present'?'selected present':''}">Present</button><button data-id="${s.admissionNo}" data-status="absent" class="${status==='absent'?'selected absent':''}">Absent</button></div></div>`;
    }).join('');
    const present = [...attendance.values()].filter(v => v === 'present').length;
    const absent = attendance.size - present;
    $('attendanceSummary').textContent = `${present} present · ${absent} absent`;
    $('studentAttendance').querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
      attendance.set(btn.dataset.id, btn.dataset.status); renderAttendance();
    }));
  }
  renderAttendance();
  $('allPresent').addEventListener('click', () => { attendance = new Map(demoStudents.map(s => [s.admissionNo,'present'])); renderAttendance(); toast('All students marked present in this prototype.'); });
  $('attendanceClass').addEventListener('change', () => toast(`Showing sample students for ${$('attendanceClass').value}.`));
  $('saveAttendance').addEventListener('click', () => {
    const absent = [...attendance.values()].filter(v => v === 'absent').length;
    $('homeAttendance').textContent = 'Reviewed';
    toast(`Demo review complete: ${attendance.size-absent} present, ${absent} absent. Nothing was saved to Firebase.`);
  });
  $('submitLesson').addEventListener('click', () => {
    if (!$('lessonTopic').value.trim()) return toast('Please enter today’s topic first.');
    toast('Lesson plan preview saved in this session only. Firebase is not connected.');
  });
  $('submitHomework').addEventListener('click', () => {
    if (!$('homeworkTitle').value.trim() || !$('homeworkInstructions').value.trim()) return toast('Please enter a title and instructions.');
    const row = document.createElement('div');
    const title = document.createElement('strong'); title.textContent = $('homeworkTitle').value.trim();
    const details = document.createElement('small'); details.textContent = `New sample assignment · Due ${$('homeworkDue').value || 'not set'}`;
    const tag = document.createElement('span'); tag.className = 'tag next'; tag.textContent = 'Draft';
    row.append(title, details, tag); $('homeworkRecords').prepend(row);
    $('homeworkTitle').value = ''; $('homeworkInstructions').value = '';
    toast('Homework draft added to this prototype only.');
  });
  function renderStudents(query='') {
    const filtered = demoStudents.filter(s => `${s.name} ${s.admissionNo}`.toLowerCase().includes(query.toLowerCase()));
    $('studentTable').innerHTML = filtered.map((s,i) => `<tr><td>${s.name}</td><td>${s.admissionNo}</td><td><span class="tag ${i%7===0?'next':'done'}">${i%7===0?'Review':'Regular'}</span></td><td><span class="tag done">On track</span></td></tr>`).join('');
  }
  renderStudents(); $('studentSearch').addEventListener('input', e => renderStudents(e.target.value));
})();
