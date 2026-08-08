AARIKA Login Foundation for GitHub Pages.
Upload contents into your existing /aarika/ folder.
Open https://www.baljyoti.com/aarika/
Google Client ID is already included.
Allowed domain: @baljyoti.com.
Demo mapping: info@baljyoti.com=SUPER_ADMIN, admin@baljyoti.com=SCHOOL_ADMIN, teacher@baljyoti.com=TEACHER.
Important: client-side role mapping is DEMO ONLY. Production requires secure server/Firebase role verification.

NEXT FUNCTIONAL LAYER:
- Super Admin > Schools/Tenants is now functional.
- Add School stores demo tenant records in browser localStorage.
- School Details shows the tenant and School Admin.
- Enter School sets selectedSchool and opens School Admin dashboard.
- This is still demo/browser storage; production requires Firebase/backend persistence and secure role checks.


Firebase-ready backend adapter has been added under js/firebase.js and firebase/.

## v2 additions
- Firebase user service
- Users & Access page
- Standard AARIKA role model
- Roles & Permissions page
- System Settings / Firebase status
- Secure architecture notes

The pages are safe to upload before Firebase configuration; Firebase-dependent data operations will show a configuration-pending state.

## v3 School Admin Foundation
School Admin now has a mobile-first ERP shell with all major operational modules visible and clickable:
Students, Teachers, Parents, Attendance, Academics, Timetable, Examinations, Fees & Finance, Admissions, Communication, Transport, Library, Inventory, Reports and School Settings.

These pages are authenticated for SCHOOL_ADMIN. The next development layer should make each module database-backed one at a time.

## v4 Student Management
Students is now the first functional School Admin module:
- Demo student registry
- Search
- Student count / active / Class X metrics
- Add Student
- Admission number validation
- Student profile
- Parent/guardian information
- Student service shortcuts
- Delete demo record
- Authentication and School Admin shell retained
- Data layer is isolated in js/student-service.js for later Firestore integration

## v5 Parent Management
Parents is now functional on top of the student master:
- Parent/guardian registry
- Search
- Add Parent
- Mobile/contact/email/occupation
- Student linking
- Parent profile
- Linked student navigation
- Parent service shortcuts
- Browser persistence for demo

## v6 Academic Structure
Classes & Sections is now a functional master module:
- Class/section registry
- Class teacher and room
- Capacity
- Student count by section
- Class profile
- Linked student list
- Shortcuts to attendance, timetable, examinations and academics
- Browser persistence for demo

## v7 Teachers & Staff
Functional faculty master:
- Teacher registry and search
- Add teacher
- Employee number validation
- Designation, gender, mobile and email
- Subject assignment
- Class/section allocation
- Teacher profile
- Links to allocated class profiles
- Attendance, timetable, academics and communication shortcuts

## v8 Attendance
Functional daily attendance:
- Date and class/section selection
- Students loaded from class master
- Present / Absent / Late
- Mark all present/absent
- Live summary
- Browser persistence
- Student profile links

## v9 Academics
Functional academic master:
- Subject registry
- Add subject
- Subject code/type
- Class-wise subject assignment
- Suggested teacher mapping from teacher master
- Subject profile
- Assigned class links
- Teacher links
- Browser persistence

## v10 Timetable
Functional timetable:
- Weekly class timetable
- Monday-Saturday
- 8 periods/day
- Class/section selection
- Subject and teacher allocation
- Room
- Duplicate period protection
- Delete timetable entry
- Browser persistence

## v11 Examinations
Functional assessment module:
- Examination master
- Class/section selection
- Subject selection
- Date range
- Examination profile
- Subject-wise marks entry
- Student-wise marks
- Marks saved in browser storage

## v12 Fees & Finance
Functional finance module:
- Fee head master
- Add fee head
- Student-wise fee assignment
- Due date
- Collection/payment entry
- Receipt number
- Student fee account
- Outstanding balance
- Finance dashboard totals
- Browser persistence

## v13 Admissions
Functional admissions CRM:
- New enquiry capture
- Application number generation
- Class applied
- Parent/contact details
- Lead source
- Admission pipeline: Enquiry -> Applied -> Shortlisted -> Admitted
- Document checklist
- Applicant profile
- Delete application
- Browser persistence

## v14 Communication
Functional communication module:
- Message dashboard
- WhatsApp / SMS / Email channel selection
- Recipient groups
- Reusable templates
- Message history
- Recipient count
- Browser persistence

## v15 Transport
Functional transport module:
- Route master
- Stops
- Vehicle master
- Driver details
- Student transport assignment
- Pickup/drop times
- Transport dashboard
- Browser persistence

## v16 Library
Functional library module:
- Book master
- Author / ISBN / category
- Multiple copies
- Issue book
- Due date
- Return book
- Student circulation history
- Overdue count
- Available copy tracking
- Browser persistence

## v17 Inventory
Functional inventory module:
- Item master
- Item code/category/unit
- Opening stock
- Minimum stock level
- Low-stock indicator
- Stock in
- Stock out with validation
- Department/person tracking
- Transaction history
- Browser persistence

## v18 Reports & Analytics
Functional reports module:
- Live school KPI dashboard
- Student strength
- Admissions
- Library circulation and overdue
- Inventory and low stock
- Transport routes and assignments
- Communication volume
- Search/filter
- CSV export
- Reads data from module localStorage

## v19 School Settings
Functional administration module:
- School profile
- School code
- Academic year
- Address / phone / email
- Timezone
- Date format
- Currency
- Notification preference
- Academic configuration view
- Browser persistence

## v20 Academics & Assessments
Functional academics module:
- Assessment master
- Class and subject
- Assessment types
- Maximum marks
- Student marks entry
- Automatic percentage
- Automatic grade
- Marks update
- Student report card view
- Browser persistence

## v21 Attendance
Functional attendance module:
- Daily attendance
- Present / absent / late / leave
- Class and section
- Date-based records
- Update existing student/date record
- Attendance dashboard KPIs
- Student-wise monthly summary
- Attendance percentage
- Browser persistence

## v22 Students & Parents
Functional module:
- Student master
- Admission number
- Class and section
- DOB and gender
- Parent/guardian details
- Phone/email/address
- Student status
- Search and filter
- Student profile
- Edit student
- Parent/guardian consolidated view
- Browser persistence

## v23 Teachers & Staff
Functional module:
- Employee master
- Employee number
- Department
- Designation
- Joining date
- Phone/email/address
- Active/inactive/on-leave status
- Search/filter
- Staff profile
- Edit staff
- Browser persistence

## v24 Classes & Sections
Functional module:
- Academic year
- Class master
- Section master
- Class teacher
- Student capacity
- Active/inactive status
- Search/filter
- Class/section profile
- Edit class/section
- Browser persistence

## v25 Admissions
Functional module:
- Admission enquiry/application master
- Application number
- Student and parent details
- Class applied
- Lead source
- Application status pipeline
- Document checklist
- Notes
- Search/filter
- Admission profile
- Edit application
- Convert admitted applicant to student master
- Browser persistence

## v26 Fees & Finance
Functional module:
- Fee invoice / receipt records
- Fee heads
- Student fee assignment
- Amount and due date
- Paid / unpaid / partial / waived status
- Payment mode
- Transaction reference
- Collection and outstanding dashboard
- Search/filter
- Fee profile
- Edit fee record
- Browser persistence

## v27 Communication
Functional module:
- Announcements
- SMS / WhatsApp / Email / Notice message records
- Parent/student/staff targeting
- Class-specific recipients
- Draft / Ready / Scheduled / Sent status
- Scheduled date
- Message history
- Search/filter
- Message profile
- Edit communication
- Browser persistence

## v28 Timetable & Academic Scheduling
Functional module:
- Academic year
- Day and period
- Class and section
- Subject
- Teacher assignment
- Room assignment
- Start/end time
- Search/filter
- Timetable entry profile
- Edit timetable entry
- Browser persistence
- Mobile-first UI

## v29 Students Management
Functional module:
- Central student master
- Admission and roll number
- Student name, DOB and gender
- Class and section allocation
- Parent/guardian and relationship
- Phone and email
- Address and notes
- Active/inactive/alumni/transferred status
- Search/filter
- Student profile
- Edit student
- Admissions -> Student conversion compatibility
- Browser persistence
- Mobile-first UI

## v30 Parents & Guardians
Functional module:
- Parent / guardian master
- Relationship
- Primary and alternate phone
- Email
- Occupation
- Primary contact flag
- Linked student names and admission numbers
- Address and notes
- Search/filter
- Parent profile
- Edit parent
- Browser persistence
- Mobile-first UI

## v31 Attendance Management
Functional module:
- Daily attendance date
- Student and admission number
- Class and section
- Present / Absent / Late / Half Day / Leave
- Time and remarks
- Daily summary counts
- Class and student search
- Attendance profile
- Edit attendance
- Browser persistence
- Mobile-first UI

## v32 Academics & Subjects
Functional module:
- Subject master
- Subject code and name
- Core / elective / language / co-curricular type
- Academic year
- Class and section allocation
- Teacher ownership
- Periods per week
- Description
- Search/filter
- Subject profile
- Edit subject
- Browser persistence
- Mobile-first UI

## v33 Examinations & Results
Functional module:
- Examination master
- Unit / periodic / term / pre-board / board / other types
- Academic year
- Subject, class and section
- Date and time
- Maximum and passing marks
- Room
- Draft / Scheduled / Completed / Published / Cancelled status
- Instructions
- Search/filter
- Examination profile
- Edit examination
- Browser persistence
- Mobile-first UI

## v34 Transport Management
Functional module:
- Route master
- Route code and name
- Vehicle number and type
- Driver and phone
- Attendant
- Capacity
- Pickup/drop stop
- Pickup/drop time
- Active/inactive/maintenance status
- Notes
- Search/filter
- Transport profile
- Edit route
- Browser persistence
- Mobile-first UI

## v35 Fees & Finance
Functional module:
- Fee record master
- Academic year and term
- Student and admission number
- Class
- Fee head
- Amount, paid and due calculation
- Due date
- DUE / PARTIAL / PAID / WAIVED / CANCELLED status
- Payment mode and payment date
- Receipt number
- Remarks
- Search/filter
- Financial summary counters
- Fee profile
- Edit fee record
- Browser persistence
- Mobile-first UI

## v36 Admissions Management
Functional module:
- Admission application master
- Application number and date
- Academic year
- Class applied
- Student profile basics
- Parent/guardian and contact
- Previous school
- Address and remarks
- NEW / CONTACTED / APPOINTMENT / ASSESSMENT / APPROVED / WAITLISTED / REJECTED / ENROLLED workflow
- Search/filter
- Admission profile
- Edit application
- Browser persistence
- Mobile-first UI

## v37 Communication & Notifications
Functional module:
- Communication master
- WhatsApp / SMS / Email / App Notification / Notice channels
- Audience targeting
- Message title and body
- Priority
- Schedule
- Draft / Scheduled / Sent / Cancelled workflow
- Search/filter
- Communication profile
- Edit communication
- Browser persistence
- Mobile-first UI

## v38 Library & Inventory
Library:
- Book catalogue
- ISBN, author, publisher, category and shelf
- Available / issued / lost / damaged status
- Issue and due dates
- Issued-to tracking
- Search, profile and edit
Inventory:
- Item master
- Category and location
- Quantity and unit
- Reorder level
- Supplier
- Stock status
- Search, profile and edit
- Browser persistence
- Mobile-first UI
