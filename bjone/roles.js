/**
 * EDUSUITE PRO ERP - ROLE & PERMISSION MATRIX
 * Defines system access tiers, navigation menus, default dashboards,
 * dynamic quick actions, and contextual widgets for all 50 stakeholders.
 */

const ROLE_PERMISSIONS = {
    // ----------------------------------------------------------------------
    // 1. EXECUTIVE & BOARD DIRECTORS (Tiers 1 & 2)
    // ----------------------------------------------------------------------
    super_admin: {
        id: "super_admin",
        name: "Super Administrator",
        category: "Executive & IT",
        badge: "Tier 0 • Full Control",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        email: "superadmin@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Executive Dashboard", icon: "fa-solid fa-chart-line" },
            { id: "admissions", label: "Admissions CRM", icon: "fa-solid fa-user-plus" },
            { id: "sis", label: "Student Information System", icon: "fa-solid fa-id-card" },
            { id: "hrms", label: "HRMS & Payroll", icon: "fa-solid fa-users-gear" },
            { id: "finance", label: "Finance & Accounts", icon: "fa-solid fa-sack-dollar" },
            { id: "academic", label: "Academic Control", icon: "fa-solid fa-book-open" },
            { id: "examination", label: "Examination Cell", icon: "fa-solid fa-file-pen" },
            { id: "transport", label: "Transport & Fleet", icon: "fa-solid fa-bus" },
            { id: "inventory", label: "Procurement & Assets", icon: "fa-solid fa-boxes-stacked" },
            { id: "security", label: "Gate & Visitor Security", icon: "fa-solid fa-shield-halved" },
            { id: "analytics", label: "AI & BI Analytics", icon: "fa-solid fa-brain" },
            { id: "settings", label: "System Architecture", icon: "fa-solid fa-sliders" }
        ],
        quickActions: [
            { label: "Add Student", icon: "fa-solid fa-user-plus", action: "modal_add_student" },
            { label: "Hire Staff", icon: "fa-solid fa-user-tie", action: "modal_hire_staff" },
            { label: "Post Notice", icon: "fa-solid fa-bullhorn", action: "modal_post_notice" },
            { label: "Generate Fee Voucher", icon: "fa-solid fa-file-invoice", action: "modal_fee_voucher" }
        ]
    },

    school_owner: {
        id: "school_owner",
        name: "School Owner / Founder",
        category: "Executive Governance",
        badge: "Board Level",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        email: "owner@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Owner Insights", icon: "fa-solid fa-chart-pie" },
            { id: "finance", label: "Group Cashflow & P&L", icon: "fa-solid fa-coins" },
            { id: "admissions", label: "Enrollment Analytics", icon: "fa-solid fa-user-group" },
            { id: "expansion", label: "Infrastructure Projects", icon: "fa-solid fa-building-flag" },
            { id: "audit", label: "Governance & Audits", icon: "fa-solid fa-clipboard-check" }
        ],
        quickActions: [
            { label: "View P&L Report", icon: "fa-solid fa-file-pdf", action: "report_pl" },
            { label: "Approve Capex", icon: "fa-solid fa-check-double", action: "approve_capex" }
        ]
    },

    chairman: {
        id: "chairman",
        name: "Chairman of the Board",
        category: "Executive Governance",
        badge: "Board Level",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        email: "chairman@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Strategic Overview", icon: "fa-solid fa-chess" },
            { id: "finance", label: "Financial Health", icon: "fa-solid fa-vault" },
            { id: "academic_outcomes", label: "Board Results & Ranking", icon: "fa-solid fa-trophy" },
            { id: "board_meetings", label: "Trustee Resolutions", icon: "fa-solid fa-gavel" }
        ],
        quickActions: [
            { label: "Schedule Trustee Meeting", icon: "fa-solid fa-calendar-plus", action: "schedule_trustee" }
        ]
    },

    vice_chairman: {
        id: "vice_chairman",
        name: "Vice Chairman",
        category: "Executive Governance",
        badge: "Board Level",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        email: "vice.chairman@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Operations Strategy", icon: "fa-solid fa-chart-line" },
            { id: "finance", label: "Budget Allocation", icon: "fa-solid fa-wallet" },
            { id: "admissions", label: "Admissions CRM", icon: "fa-solid fa-bullseye" }
        ],
        quickActions: [{ label: "Approve Annual Budget", icon: "fa-solid fa-stamp", action: "approve_budget" }]
    },

    trustee: {
        id: "trustee",
        name: "Board Trustee",
        category: "Executive Governance",
        badge: "Board Level",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        email: "trustee@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Trustee Portal", icon: "fa-solid fa-shield" },
            { id: "audit", label: "Financial Audits", icon: "fa-solid fa-receipt" }
        ],
        quickActions: [{ label: "Download Audit Log", icon: "fa-solid fa-download", action: "dl_audit" }]
    },

    managing_director: {
        id: "managing_director",
        name: "Managing Director",
        category: "Executive Governance",
        badge: "Executive Director",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
        email: "md@dps.edu.in",
        menus: [
            { id: "dashboard", label: "MD Cockpit", icon: "fa-solid fa-gauge-high" },
            { id: "finance", label: "Treasury & Payroll", icon: "fa-solid fa-scale-balanced" },
            { id: "hrms", label: "Key Personnel HR", icon: "fa-solid fa-user-check" }
        ],
        quickActions: [{ label: "Authorize Payroll Batch", icon: "fa-solid fa-money-check-dollar", action: "auth_payroll" }]
    },

    ceo: {
        id: "ceo",
        name: "Chief Executive Officer",
        category: "Executive Leadership",
        badge: "C-Suite",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        email: "ceo@dps.edu.in",
        menus: [
            { id: "dashboard", label: "CEO Command Center", icon: "fa-solid fa-compass" },
            { id: "kpi", label: "Institutional KPIs", icon: "fa-solid fa-chart-column" },
            { id: "finance", label: "Revenue & Operations", icon: "fa-solid fa-chart-pie" }
        ],
        quickActions: [{ label: "Broadcast Message", icon: "fa-solid fa-paper-plane", action: "broadcast_msg" }]
    },

    director: {
        id: "director",
        name: "Director of Schools",
        category: "Executive Leadership",
        badge: "C-Suite",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
        email: "director@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Director Portal", icon: "fa-solid fa-briefcase" },
            { id: "academic", label: "Curriculum Compliance", icon: "fa-solid fa-graduation-cap" }
        ],
        quickActions: [{ label: "Review Curriculum", icon: "fa-solid fa-book-bookmark", action: "review_curriculum" }]
    },

    // ----------------------------------------------------------------------
    // 2. ACADEMIC LEADERSHIP & ADMINISTRATION (Tiers 3 & 4)
    // ----------------------------------------------------------------------
    principal: {
        id: "principal",
        name: "Dr. Ananya Roy",
        category: "Academic Leadership",
        badge: "Head of Institution",
        avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80",
        email: "principal@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Principal Cockpit", icon: "fa-solid fa-chart-line" },
            { id: "sis", label: "Student Directory", icon: "fa-solid fa-users" },
            { id: "academic", label: "Academic Oversight", icon: "fa-solid fa-graduation-cap" },
            { id: "examination", label: "Exams & Results", icon: "fa-solid fa-square-poll-vertical" },
            { id: "hrms", label: "Faculty Management", icon: "fa-solid fa-chalkboard-user" },
            { id: "attendance", label: "Attendance Insights", icon: "fa-solid fa-user-check" },
            { id: "complaints", label: "Escalations & Redressal", icon: "fa-solid fa-circle-exclamation" }
        ],
        quickActions: [
            { label: "Approve Staff Leave", icon: "fa-solid fa-calendar-check", action: "approve_leave" },
            { label: "Publish Exam Result", icon: "fa-solid fa-upload", action: "publish_results" },
            { label: "Issue Emergency Circular", icon: "fa-solid fa-triangle-exclamation", action: "emergency_circular" }
        ]
    },

    vice_principal: {
        id: "vice_principal",
        name: "Vice Principal",
        category: "Academic Leadership",
        badge: "Senior Administration",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        email: "vice.principal@dps.edu.in",
        menus: [
            { id: "dashboard", label: "VP Dashboard", icon: "fa-solid fa-chart-line" },
            { id: "timetable", label: "Master Timetable", icon: "fa-solid fa-calendar-days" },
            { id: "discipline", label: "Student Discipline", icon: "fa-solid fa-gavel" },
            { id: "substitution", label: "Teacher Substitution", icon: "fa-solid fa-people-arrows" }
        ],
        quickActions: [{ label: "Assign Substitution", icon: "fa-solid fa-user-clock", action: "assign_sub" }]
    },

    head_mistress: {
        id: "head_mistress",
        name: "Head Mistress (Primary)",
        category: "Academic Leadership",
        badge: "Wing Incharge",
        avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80",
        email: "hm.primary@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Wing Overview", icon: "fa-solid fa-child" },
            { id: "primary_academic", label: "Primary Activity Log", icon: "fa-solid fa-shapes" }
        ],
        quickActions: [{ label: "Log Primary Event", icon: "fa-solid fa-star", action: "log_event" }]
    },

    academic_director: {
        id: "academic_director",
        name: "Academic Director",
        category: "Academic Leadership",
        badge: "Curriculum Head",
        avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
        email: "academic.director@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Academic Audit", icon: "fa-solid fa-book-open-reader" },
            { id: "lms", label: "Curriculum & LMS Control", icon: "fa-solid fa-laptop-code" }
        ],
        quickActions: [{ label: "Audit Syllabus Progress", icon: "fa-solid fa-list-check", action: "audit_syllabus" }]
    },

    academic_coordinator: {
        id: "academic_coordinator",
        name: "Academic Coordinator",
        category: "Academic Support",
        badge: "Coordination Cell",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
        email: "coord.senior@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Coordinator Desk", icon: "fa-solid fa-network-wired" },
            { id: "lesson_plans", label: "Lesson Plan Approvals", icon: "fa-solid fa-file-signature" }
        ],
        quickActions: [{ label: "Verify Lesson Plan", icon: "fa-solid fa-check", action: "verify_plan" }]
    },

    section_coordinator: {
        id: "section_coordinator",
        name: "Section Coordinator (Grade 9-10)",
        category: "Academic Support",
        badge: "Coordination Cell",
        avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80",
        email: "coord.g9@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Section Status", icon: "fa-solid fa-cubes" },
            { id: "attendance", label: "Grade Attendance", icon: "fa-solid fa-user-check" }
        ],
        quickActions: [{ label: "Send Absence Alert", icon: "fa-solid fa-bell", action: "send_absent_alert" }]
    },

    hod: {
        id: "hod",
        name: "HOD Mathematics",
        category: "Academic Leadership",
        badge: "Department Head",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        email: "hod.math@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Department Dashboard", icon: "fa-solid fa-calculator" },
            { id: "question_bank", label: "Question Bank & Assessments", icon: "fa-solid fa-database" },
            { id: "dept_teachers", label: "Faculty Evaluation", icon: "fa-solid fa-ranking-star" }
        ],
        quickActions: [{ label: "Approve Question Paper", icon: "fa-solid fa-file-shield", action: "approve_qp" }]
    },

    // ----------------------------------------------------------------------
    // 3. EXAMINATION CELL & CONTROLLER (Tier 4)
    // ----------------------------------------------------------------------
    examination_controller: {
        id: "examination_controller",
        name: "Controller of Examinations",
        category: "Examination Cell",
        badge: "Exam Controller",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        email: "coe@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Control Dashboard", icon: "fa-solid fa-square-poll-vertical" },
            { id: "exam_schedules", label: "Date Sheets & Schedules", icon: "fa-solid fa-calendar-day" },
            { id: "cbse_report", label: "CBSE Report Card Generator", icon: "fa-solid fa-award" },
            { id: "grading", label: "Grading Scale & Moderation", icon: "fa-solid fa-sliders" }
        ],
        quickActions: [
            { label: "Lock Marks Entry", icon: "fa-solid fa-lock", action: "lock_marks" },
            { label: "Generate Hall Tickets", icon: "fa-solid fa-ticket", action: "gen_hall_tickets" }
        ]
    },

    examination_cell: {
        id: "examination_cell",
        name: "Exam Cell Executive",
        category: "Examination Cell",
        badge: "Exam Admin",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        email: "examcell@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Exam Operations", icon: "fa-solid fa-list-check" },
            { id: "seating", label: "Seating Arrangement", icon: "fa-solid fa-border-all" }
        ],
        quickActions: [{ label: "Print Seating Plan", icon: "fa-solid fa-print", action: "print_seating" }]
    },

    // ----------------------------------------------------------------------
    // 4. IT & ERP SYSTEM ADMINISTRATION (Tier 1)
    // ----------------------------------------------------------------------
    erp_administrator: {
        id: "erp_administrator",
        name: "ERP System Architect",
        category: "IT Infrastructure",
        badge: "Super Tech Control",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        email: "erpadmin@dps.edu.in",
        menus: [
            { id: "dashboard", label: "System Health & Config", icon: "fa-solid fa-server" },
            { id: "permissions", label: "RBAC Permission Matrix", icon: "fa-solid fa-user-lock" },
            { id: "custom_fields", label: "Data Schema & Custom Fields", icon: "fa-solid fa-diagram-project" },
            { id: "audit_logs", label: "System Audit Logs", icon: "fa-solid fa-receipt" }
        ],
        quickActions: [
            { label: "Flush Cache & Sync", icon: "fa-solid fa-rotate", action: "flush_cache" },
            { label: "Run Database Backup", icon: "fa-solid fa-database", action: "db_backup" }
        ]
    },

    it_administrator: {
        id: "it_administrator",
        name: "IT Infrastructure Manager",
        category: "IT Infrastructure",
        badge: "IT Security",
        avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
        email: "itadmin@dps.edu.in",
        menus: [
            { id: "dashboard", label: "IT Assets & Network", icon: "fa-solid fa-network-wired" },
            { id: "cctv_logs", label: "CCTV & Hardware Health", icon: "fa-solid fa-video" },
            { id: "biometric", label: "Biometric Devices Sync", icon: "fa-solid fa-fingerprint" }
        ],
        quickActions: [{ label: "Sync Biometric Logs", icon: "fa-solid fa-sync", action: "sync_biometric" }]
    },

    // ----------------------------------------------------------------------
    // 5. FINANCE, ACCOUNTING & PAYROLL (Tier 3)
    // ----------------------------------------------------------------------
    finance_manager: {
        id: "finance_manager",
        name: "Chief Financial Officer (CFO)",
        category: "Finance & Accounts",
        badge: "Finance Controller",
        avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80",
        email: "cfo@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Financial Cockpit", icon: "fa-solid fa-chart-pie" },
            { id: "fee_structure", label: "Fee Master & Discounts", icon: "fa-solid fa-money-check" },
            { id: "ledger", label: "General Ledger & T-Accounts", icon: "fa-solid fa-book-journal-whills" },
            { id: "payroll", label: "Staff Salary Engine", icon: "fa-solid fa-file-invoice-dollar" }
        ],
        quickActions: [{ label: "Generate Tax Report", icon: "fa-solid fa-file-contract", action: "gen_tax" }]
    },

    accountant: {
        id: "accountant",
        name: "Senior Accountant",
        category: "Finance & Accounts",
        badge: "Accounting Officer",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        email: "accounts@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Accounts Desk", icon: "fa-solid fa-calculator" },
            { id: "student_fees", label: "Fee Collection & Dues", icon: "fa-solid fa-hand-holding-dollar" },
            { id: "vouchers", label: "Expense Vouchers", icon: "fa-solid fa-receipt" }
        ],
        quickActions: [{ label: "Collect Online Fee", icon: "fa-solid fa-credit-card", action: "collect_fee" }]
    },

    cashier: {
        id: "cashier",
        name: "Front Desk Cashier",
        category: "Finance & Accounts",
        badge: "Cash Desk",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        email: "cashier@dps.edu.in",
        menus: [
            { id: "dashboard", label: "POS Cash Counter", icon: "fa-solid fa-cash-register" },
            { id: "receipts", label: "Print Receipt & Challan", icon: "fa-solid fa-print" }
        ],
        quickActions: [{ label: "Issue Fee Receipt", icon: "fa-solid fa-receipt", action: "issue_receipt" }]
    },

    // ----------------------------------------------------------------------
    // 6. HUMAN RESOURCES & STAFF MANAGEMENT (Tier 3)
    // ----------------------------------------------------------------------
    hr_manager: {
        id: "hr_manager",
        name: "Head of Human Resources",
        category: "Human Resources",
        badge: "HR Head",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        email: "hr@dps.edu.in",
        menus: [
            { id: "dashboard", label: "HR Control Hub", icon: "fa-solid fa-users-gear" },
            { id: "recruitment", label: "Staff Recruitment", icon: "fa-solid fa-user-plus" },
            { id: "staff_attendance", label: "Biometric & Leaves", icon: "fa-solid fa-clipboard-user" },
            { id: "appraisals", label: "Performance Appraisals", icon: "fa-solid fa-medal" }
        ],
        quickActions: [{ label: "Post Job Opening", icon: "fa-solid fa-briefcase", action: "post_job" }]
    },

    // ----------------------------------------------------------------------
    // 7. INVENTORY, PROCUREMENT & LOGISTICS (Tier 4)
    // ----------------------------------------------------------------------
    purchase_officer: {
        id: "purchase_officer",
        name: "Procurement Manager",
        category: "Procurement & Assets",
        badge: "Purchase Officer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        email: "purchase@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Purchase Desk", icon: "fa-solid fa-cart-flatbed" },
            { id: "vendor_mgmt", label: "Vendor Management", icon: "fa-solid fa-truck-field" },
            { id: "po_orders", label: "Purchase Orders (PO)", icon: "fa-solid fa-file-invoice" }
        ],
        quickActions: [{ label: "Create PO Order", icon: "fa-solid fa-plus-circle", action: "create_po" }]
    },

    inventory_manager: {
        id: "inventory_manager",
        name: "Stock & Inventory Storekeeper",
        category: "Procurement & Assets",
        badge: "Inventory Admin",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        email: "store@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Store Stock Level", icon: "fa-solid fa-boxes-stacked" },
            { id: "stock_issue", label: "Uniform & Stationery Issue", icon: "fa-solid fa-box-open" }
        ],
        quickActions: [{ label: "Issue Stock Items", icon: "fa-solid fa-hand-holding-box", action: "issue_stock" }]
    },

    transport_manager: {
        id: "transport_manager",
        name: "Transport Manager",
        category: "Logistics & Security",
        badge: "Fleet Controller",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        email: "transport@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Live GPS Fleet Tracking", icon: "fa-solid fa-bus-simple" },
            { id: "bus_routes", label: "Routes & Drivers", icon: "fa-solid fa-route" },
            { id: "vehicle_maint", label: "Vehicle Fuel & Maintenance", icon: "fa-solid fa-screwdriver-wrench" }
        ],
        quickActions: [{ label: "Locate Bus GPS", icon: "fa-solid fa-location-crosshairs", action: "track_bus" }]
    },

    hostel_warden: {
        id: "hostel_warden",
        name: "Chief Hostel Warden",
        category: "Residential & Life",
        badge: "Hostel Admin",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        email: "warden@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Hostel Occupancy", icon: "fa-solid fa-hotel" },
            { id: "room_alloc", label: "Room Allocation & Mess", icon: "fa-solid fa-bed" },
            { id: "out_pass", label: "Student Out-Pass System", icon: "fa-solid fa-passport" }
        ],
        quickActions: [{ label: "Issue Out-Pass", icon: "fa-solid fa-id-card-clip", action: "issue_outpass" }]
    },

    librarian: {
        id: "librarian",
        name: "Head Librarian",
        category: "Academic Support",
        badge: "Library Controller",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
        email: "library@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Library Automation", icon: "fa-solid fa-book-bookmark" },
            { id: "book_catalog", label: "Book Catalog Search", icon: "fa-solid fa-book" },
            { id: "issue_return", label: "Book Issue & Returns", icon: "fa-solid fa-barcode" }
        ],
        quickActions: [{ label: "Issue Book (Barcode)", icon: "fa-solid fa-barcode", action: "issue_book" }]
    },

    lab_incharge: {
        id: "lab_incharge",
        name: "Senior Science Lab Specialist",
        category: "Academic Support",
        badge: "Lab Manager",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        email: "lab@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Lab Equipment & Chemicals", icon: "fa-solid fa-flask-vial" },
            { id: "lab_schedule", label: "Lab Slots Booking", icon: "fa-solid fa-calendar-check" }
        ],
        quickActions: [{ label: "Log Chemical Stock", icon: "fa-solid fa-vial", action: "log_lab_stock" }]
    },

    sports_coordinator: {
        id: "sports_coordinator",
        name: "Sports Director",
        category: "Co-Curricular",
        badge: "Athletic Head",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        email: "sports@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Sports & Tournaments", icon: "fa-solid fa-trophy" },
            { id: "teams", label: "School Teams & Training", icon: "fa-solid fa-person-running" }
        ],
        quickActions: [{ label: "Register Tournament", icon: "fa-solid fa-medal", action: "reg_tournament" }]
    },

    event_coordinator: {
        id: "event_coordinator",
        name: "Events & Cultural Manager",
        category: "Co-Curricular",
        badge: "Events Head",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        email: "events@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Annual Events Calendar", icon: "fa-solid fa-calendar-star" },
            { id: "auditorium", label: "Auditorium Bookings", icon: "fa-solid fa-icons" }
        ],
        quickActions: [{ label: "Create Event Flyer", icon: "fa-solid fa-bullhorn", action: "create_event" }]
    },

    counsellor: {
        id: "counsellor",
        name: "Lead Child Psychologist & Counsellor",
        category: "Student Wellness",
        badge: "Mental Health",
        avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80",
        email: "counsellor@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Counselling Sessions", icon: "fa-solid fa-heart-pulse" },
            { id: "behavioral_notes", label: "Confidential Case Notes", icon: "fa-solid fa-user-doctor" }
        ],
        quickActions: [{ label: "Book Case Session", icon: "fa-solid fa-calendar-plus", action: "book_session" }]
    },

    medical_officer: {
        id: "medical_officer",
        name: "Resident School Doctor",
        category: "Student Wellness",
        badge: "Health Desk",
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
        email: "infirmary@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Infirmary & Health Records", icon: "fa-solid fa-kit-medical" },
            { id: "medical_incidents", label: "Emergency Health Logs", icon: "fa-solid fa-stethoscope" }
        ],
        quickActions: [{ label: "Record Health Check", icon: "fa-solid fa-notes-medical", action: "health_check" }]
    },

    // ----------------------------------------------------------------------
    // 8. FRONT OFFICE & ADMISSIONS CRM (Tier 4)
    // ----------------------------------------------------------------------
    receptionist: {
        id: "receptionist",
        name: "Front Office Desk Officer",
        category: "Front Desk & Public",
        badge: "Front Desk",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
        email: "reception@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Front Desk Operations", icon: "fa-solid fa-headset" },
            { id: "visitor_pass", label: "Visitor Gate Pass Entry", icon: "fa-solid fa-address-card" },
            { id: "phone_calls", label: "Inbound Call Register", icon: "fa-solid fa-phone" }
        ],
        quickActions: [{ label: "Issue Gate Pass", icon: "fa-solid fa-id-badge", action: "issue_visitor_pass" }]
    },

    front_office_executive: {
        id: "front_office_executive",
        name: "Public Relations Executive",
        category: "Front Desk & Public",
        badge: "PR Desk",
        avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80",
        email: "pr@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Enquiry Management", icon: "fa-solid fa-comments" },
            { id: "dispatch", label: "Postal & Dispatch Desk", icon: "fa-solid fa-envelope-open-text" }
        ],
        quickActions: [{ label: "Log Enquiry", icon: "fa-solid fa-pen-to-square", action: "log_enquiry" }]
    },

    admission_counselor: {
        id: "admission_counselor",
        name: "Chief Admissions Officer",
        category: "Admissions & Marketing",
        badge: "CRM Lead",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
        email: "admissions@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Admissions CRM Pipeline", icon: "fa-solid fa-filter-circle-dollar" },
            { id: "lead_management", label: "Lead Funnel & Prospects", icon: "fa-solid fa-user-plus" },
            { id: "entrance_tests", label: "Entrance Test Evaluation", icon: "fa-solid fa-file-circle-check" }
        ],
        quickActions: [{ label: "Add Lead Candidate", icon: "fa-solid fa-user-plus", action: "add_lead" }]
    },

    marketing_executive: {
        id: "marketing_executive",
        name: "Digital Marketing Specialist",
        category: "Admissions & Marketing",
        badge: "Growth Desk",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        email: "marketing@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Marketing Campaigns", icon: "fa-solid fa-rectangle-ad" },
            { id: "campaign_analytics", label: "Social & Ad Analytics", icon: "fa-solid fa-chart-line-up" }
        ],
        quickActions: [{ label: "Launch Campaign", icon: "fa-solid fa-paper-plane", action: "launch_campaign" }]
    },

    // ----------------------------------------------------------------------
    // 9. FACULTY & TEACHERS (Tier 5)
    // ----------------------------------------------------------------------
    teacher: {
        id: "teacher",
        name: "Senior Faculty Member",
        category: "Academic Faculty",
        badge: "Teaching Staff",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        email: "teacher@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Teacher Dashboard", icon: "fa-solid fa-chalkboard" },
            { id: "attendance", label: "Take Attendance", icon: "fa-solid fa-user-check" },
            { id: "lesson_plan", label: "Lesson Planning", icon: "fa-solid fa-book-open" },
            { id: "homework", label: "Homework & Assignments", icon: "fa-solid fa-pen-ruler" },
            { id: "marks_entry", label: "Marks & Grades Entry", icon: "fa-solid fa-file-circle-plus" },
            { id: "timetable", label: "My Schedule", icon: "fa-solid fa-calendar-days" }
        ],
        quickActions: [
            { label: "Mark Today's Attendance", icon: "fa-solid fa-user-check", action: "mark_attendance" },
            { label: "Assign Homework", icon: "fa-solid fa-plus", action: "assign_homework" },
            { label: "Enter Exam Marks", icon: "fa-solid fa-pen", action: "enter_marks" }
        ]
    },

    class_teacher: {
        id: "class_teacher",
        name: "Class Teacher (Grade 10-A)",
        category: "Academic Faculty",
        badge: "Class Incharge",
        avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80",
        email: "classteacher.10a@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Class 10-A Cockpit", icon: "fa-solid fa-chalkboard-user" },
            { id: "my_class_students", label: "My Class Roster", icon: "fa-solid fa-users" },
            { id: "attendance", label: "Daily Class Attendance", icon: "fa-solid fa-clipboard-user" },
            { id: "report_card_draft", label: "Report Card Review", icon: "fa-solid fa-award" }
        ],
        quickActions: [{ label: "Send Class Notification", icon: "fa-solid fa-paper-plane", action: "class_notify" }]
    },

    subject_teacher: {
        id: "subject_teacher",
        name: "Physics Subject Faculty",
        category: "Academic Faculty",
        badge: "Subject Expert",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        email: "physics@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Subject Workstation", icon: "fa-solid fa-atom" },
            { id: "marks_entry", label: "Physics Marks Entry", icon: "fa-solid fa-pen" }
        ],
        quickActions: [{ label: "Upload Assignment", icon: "fa-solid fa-upload", action: "upload_assign" }]
    },

    substitute_teacher: {
        id: "substitute_teacher",
        name: "Visiting / Substitute Faculty",
        category: "Academic Faculty",
        badge: "Visiting Staff",
        avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
        email: "sub.faculty@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Substitution Schedule", icon: "fa-solid fa-clock-rotate-left" },
            { id: "attendance", label: "Quick Class Rollcall", icon: "fa-solid fa-check-double" }
        ],
        quickActions: [{ label: "View Assigned Class", icon: "fa-solid fa-eye", action: "view_class" }]
    },

    activity_teacher: {
        id: "activity_teacher",
        name: "Arts & Crafts Instructor",
        category: "Academic Faculty",
        badge: "Activity Specialist",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        email: "art@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Arts Studio Desk", icon: "fa-solid fa-palette" },
            { id: "gallery", label: "Student Portfolio Upload", icon: "fa-solid fa-image" }
        ],
        quickActions: [{ label: "Upload Artwork", icon: "fa-solid fa-camera", action: "upload_art" }]
    },

    coach: {
        id: "coach",
        name: "Head Football Coach",
        category: "Co-Curricular",
        badge: "Sports Staff",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        email: "coach.football@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Team Performance & Fitness", icon: "fa-solid fa-football" },
            { id: "attendance", label: "Practice Attendance", icon: "fa-solid fa-clipboard-check" }
        ],
        quickActions: [{ label: "Log Fitness Drill", icon: "fa-solid fa-heart-pulse", action: "log_fitness" }]
    },

    // ----------------------------------------------------------------------
    // 10. STUDENTS & PARENTS (Tier 6)
    // ----------------------------------------------------------------------
    student: {
        id: "student",
        name: "Aarav Sharma (10-A, Roll #12)",
        category: "Student & Parent",
        badge: "Class 10-A",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        email: "aarav.sharma@student.dps.edu.in",
        menus: [
            { id: "dashboard", label: "Student Hub", icon: "fa-solid fa-graduation-cap" },
            { id: "timetable", label: "Today's Classes", icon: "fa-solid fa-clock" },
            { id: "homework", label: "Homework & Deadlines", icon: "fa-solid fa-book-bookmark" },
            { id: "attendance", label: "My Attendance", icon: "fa-solid fa-user-check" },
            { id: "results", label: "Report Cards & Tests", icon: "fa-solid fa-award" },
            { id: "library", label: "Issued Books", icon: "fa-solid fa-book" }
        ],
        quickActions: [
            { label: "Submit Homework", icon: "fa-solid fa-upload", action: "submit_hw" },
            { label: "View Date Sheet", icon: "fa-solid fa-calendar", action: "view_datesheet" }
        ]
    },

    parent: {
        id: "parent",
        name: "Vikram Sharma (Father of Aarav)",
        category: "Student & Parent",
        badge: "Guardian Access",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        email: "vikram.sharma@gmail.com",
        menus: [
            { id: "dashboard", label: "Parent Desk", icon: "fa-solid fa-house-user" },
            { id: "child_progress", label: "Child Progress & Analytics", icon: "fa-solid fa-chart-line" },
            { id: "fee_payment", label: "Online Fee Payment", icon: "fa-solid fa-credit-card" },
            { id: "bus_track", label: "Live Bus Tracking", icon: "fa-solid fa-bus" },
            { id: "teacher_comm", label: "Connect with Teachers", icon: "fa-solid fa-comments" }
        ],
        quickActions: [
            { label: "Pay School Fees", icon: "fa-solid fa-money-bill-wave", action: "pay_fee_now" },
            { label: "Apply Leave Application", icon: "fa-solid fa-file-pen", action: "apply_child_leave" }
        ]
    },

    alumni: {
        id: "alumni",
        name: "Priya Malhotra (Batch of 2020)",
        category: "Alumni & Guests",
        badge: "Alumnus",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        email: "priya.2020@alumni.dps.edu.in",
        menus: [
            { id: "dashboard", label: "Alumni Network", icon: "fa-solid fa-user-graduate" },
            { id: "reunion", label: "Reunion & Mentorship", icon: "fa-solid fa-handshake" },
            { id: "tc_request", label: "Transcript & Certificate Request", icon: "fa-solid fa-file-certificate" }
        ],
        quickActions: [{ label: "Request Transcript", icon: "fa-solid fa-file-export", action: "request_transcript" }]
    },

    visitor: {
        id: "visitor",
        name: "Rajesh Kumar (Guest / Parent)",
        category: "Alumni & Guests",
        badge: "Temporary Visitor",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        email: "visitor@gmail.com",
        menus: [
            { id: "dashboard", label: "Visitor Self Service", icon: "fa-solid fa-id-badge" },
            { id: "appointment", label: "Appointment Status", icon: "fa-solid fa-calendar-check" }
        ],
        quickActions: [{ label: "Check In Gate Status", icon: "fa-solid fa-door-open", action: "check_gate" }]
    },

    // ----------------------------------------------------------------------
    // 11. SECURITY, CAMPUS & AUXILIARY SERVICES (Tier 6)
    // ----------------------------------------------------------------------
    security_guard: {
        id: "security_guard",
        name: "Security Chief (Gate 1)",
        category: "Auxiliary Staff",
        badge: "Gate Control",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        email: "security.gate1@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Gate Scanner & Passes", icon: "fa-solid fa-shield-cat" },
            { id: "visitor_scan", label: "Scan Visitor QR Code", icon: "fa-solid fa-qrcode" },
            { id: "student_outpass_scan", label: "Student Outpass Verification", icon: "fa-solid fa-person-walking-arrow-right" }
        ],
        quickActions: [{ label: "Scan QR Gate Pass", icon: "fa-solid fa-qrcode", action: "scan_qr" }]
    },

    housekeeping_supervisor: {
        id: "housekeeping_supervisor",
        name: "Facility & Sanitation Supervisor",
        category: "Auxiliary Staff",
        badge: "Campus Operations",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        email: "sanitation@dps.edu.in",
        menus: [
            { id: "dashboard", label: "Campus Cleaning Schedules", icon: "fa-solid fa-broom" },
            { id: "sanitation_check", label: "Washroom Hygiene Checklist", icon: "fa-solid fa-list-check" }
        ],
        quickActions: [{ label: "Log Cleaning Inspection", icon: "fa-solid fa-check", action: "log_cleaning" }]
    },

    vendor: {
        id: "vendor",
        name: "Supreme Books & Stationery Vendor",
        category: "External Partners",
        badge: "External Partner",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
        email: "vendor.supreme@gmail.com",
        menus: [
            { id: "dashboard", label: "Vendor Supply Portal", icon: "fa-solid fa-truck-ramp-box" },
            { id: "po_orders", label: "Assigned Purchase Orders", icon: "fa-solid fa-file-invoice" },
            { id: "vendor_invoices", label: "Invoice Submission", icon: "fa-solid fa-receipt" }
        ],
        quickActions: [{ label: "Submit Delivery Invoice", icon: "fa-solid fa-file-upload", action: "submit_invoice" }]
    }
};

/**
 * Helper function to retrieve all roles grouped by category for dropdowns
 */
function getGroupedRoles() {
    const categories = {};
    Object.values(ROLE_PERMISSIONS).forEach(role => {
        if (!categories[role.category]) {
            categories[role.category] = [];
        }
        categories[role.category].push(role);
    });
    return categories;
}
