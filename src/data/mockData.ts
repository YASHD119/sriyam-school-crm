import { UserSession, Lead, StudentRecord, ProtectedDocument, FeeInvoice, Notice, SecurityAuditLog, Course, Question, Assignment, LiveClass, AttendanceSession, CalendarEvent } from '../types';

export const INITIAL_USERS: UserSession[] = [
  {
    id: 'user-admin-1',
    name: 'Dr. V. R. Sharma',
    email: 'principal@sriyamschool.edu.in',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-teacher-1',
    name: 'Prof. Sunita Nair',
    email: 'sunita.nair@sriyamschool.edu.in',
    role: 'TEACHER',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-student-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@student.sriyamschool.edu.in',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    studentDetails: {
      rollNo: 'SRI-2026-1042',
      grade: 'Grade 10',
      section: 'Section A',
      guardianName: 'Rajesh Sharma',
      guardianPhone: '+91 98201 44521',
      guardianEmail: 'rajesh.sharma@gmail.com',
      attendancePercent: 94.6,
      feeStatus: 'PAID',
      ipAddress: '115.112.44.82 (Chennai, IN)',
      enrolledDate: '10 June 2024',
      emergencyContact: '+91 98201 44522',
      bloodGroup: 'B+'
    }
  },
  {
    id: 'user-student-2',
    name: 'Riya Patel',
    email: 'riya.patel@student.sriyamschool.edu.in',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    studentDetails: {
      rollNo: 'SRI-2026-1208',
      grade: 'Grade 12',
      section: 'Section B',
      guardianName: 'Manoj Patel',
      guardianPhone: '+91 94432 19823',
      guardianEmail: 'manoj.patel@outlook.com',
      attendancePercent: 88.2,
      feeStatus: 'PENDING',
      ipAddress: '182.73.18.90 (Bangalore, IN)',
      enrolledDate: '15 June 2023',
      emergencyContact: '+91 94432 19824',
      bloodGroup: 'O+'
    }
  }
];

export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1',
    studentName: 'Aarav Sharma',
    guardianName: 'Rajesh Sharma',
    email: 'aarav.sharma@student.sriyamschool.edu.in',
    phone: '+91 98201 44521',
    gradeApplying: 'Grade 10 (Science & Math)',
    status: 'ENROLLED',
    source: 'WEBSITE',
    createdAt: '2026-11-10',
    lastContacted: '2026-11-18',
    notes: 'Full enrollment fee paid. 1-Month secure course safe access is active.',
    priority: 'HIGH',
    paymentStatus: 'PAID',
    paidDate: '2026-11-18',
    assignedCourseId: 'crs-1',
    amount: 38500
  },
  {
    id: 'lead-2',
    studentName: 'Riya Patel',
    guardianName: 'Manoj Patel',
    email: 'riya.patel@student.sriyamschool.edu.in',
    phone: '+91 94432 19823',
    gradeApplying: 'Grade 12 (Advanced Chemistry)',
    status: 'ENROLLED',
    source: 'REFERRAL',
    createdAt: '2026-09-20',
    lastContacted: '2026-10-15',
    notes: 'Initial fee was paid over a month ago. Safe access is now expired awaiting renewal.',
    priority: 'HIGH',
    paymentStatus: 'PAID',
    paidDate: '2026-10-15', // Expired (> 30 days)
    assignedCourseId: 'crs-3',
    amount: 42000
  },
  {
    id: 'lead-3',
    studentName: 'Ananya Deshmukh',
    guardianName: 'Vikram Deshmukh',
    email: 'vikram.d@corporate.in',
    phone: '+91 98112 33445',
    gradeApplying: 'Grade 11 (Science-PCM)',
    status: 'TEST_SCHEDULED',
    source: 'WEBSITE',
    createdAt: '2026-11-12',
    lastContacted: '2026-11-25',
    notes: 'Inquired about JEE coaching integration. Payment pending verification.',
    priority: 'HIGH',
    paymentStatus: 'UNPAID',
    assignedCourseId: 'crs-2',
    amount: 45000
  },
  {
    id: 'lead-4',
    studentName: 'Kabir Malhotra',
    guardianName: 'Sanjay Malhotra',
    email: 'sanjay.m@gmail.com',
    phone: '+91 99302 44112',
    gradeApplying: 'Grade 9',
    status: 'OFFER_MADE',
    source: 'REFERRAL',
    createdAt: '2026-11-05',
    lastContacted: '2026-11-26',
    notes: 'Transfer from Delhi Public School. Admission test passed with 89%. Paid admission fee today.',
    priority: 'HIGH',
    paymentStatus: 'PAID',
    paidDate: '2026-11-26',
    assignedCourseId: 'crs-1',
    amount: 36000
  },
  {
    id: 'lead-5',
    studentName: 'Ishaani Sen',
    guardianName: 'Dr. Debasish Sen',
    email: 'dsen.aiims@med.org',
    phone: '+91 97182 99001',
    gradeApplying: 'Grade 11 (Science-PCB)',
    status: 'CAMPUS_TOUR',
    source: 'EDUCATION_FAIR',
    createdAt: '2026-11-14',
    lastContacted: '2026-11-24',
    notes: 'Looking for modern biology and chemistry laboratory facilities. Campus tour attended.',
    priority: 'MEDIUM',
    paymentStatus: 'UNPAID',
    assignedCourseId: 'crs-4',
    amount: 44000
  },
  {
    id: 'lead-6',
    studentName: 'Devansh Kulkarni',
    guardianName: 'Anjali Kulkarni',
    email: 'kulkarni.anjali@fintech.co',
    phone: '+91 98801 12349',
    gradeApplying: 'Grade 10',
    status: 'NEW_INQUIRY',
    source: 'WEBSITE',
    createdAt: '2026-11-22',
    lastContacted: '2026-11-26',
    notes: 'Submitted online contact form regarding mid-term transfer feasibility and syllabus compatibility.',
    priority: 'HIGH',
    paymentStatus: 'UNPAID',
    amount: 38500
  }
];

export const MOCK_STUDENTS: StudentRecord[] = [
  {
    id: 'stu-1',
    rollNo: 'SRI-2026-1042',
    name: 'Aarav Sharma',
    grade: 'Grade 10',
    section: 'A',
    guardianName: 'Rajesh Sharma',
    phone: '+91 98201 44521',
    email: 'aarav.sharma@student.sriyamschool.edu.in',
    attendance: 94.6,
    gpa: '9.4 / 10',
    feeStatus: 'PAID',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'stu-2',
    rollNo: 'SRI-2026-1208',
    name: 'Riya Patel',
    grade: 'Grade 12',
    section: 'B',
    guardianName: 'Manoj Patel',
    phone: '+91 94432 19823',
    email: 'riya.patel@student.sriyamschool.edu.in',
    attendance: 88.2,
    gpa: '8.8 / 10',
    feeStatus: 'PENDING',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'stu-3',
    rollNo: 'SRI-2026-1015',
    name: 'Siddharth Verma',
    grade: 'Grade 10',
    section: 'A',
    guardianName: 'Sunil Verma',
    phone: '+91 98223 90112',
    email: 'siddharth.v@student.sriyamschool.edu.in',
    attendance: 96.0,
    gpa: '9.8 / 10',
    feeStatus: 'PAID',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'stu-4',
    rollNo: 'SRI-2026-1029',
    name: 'Meera Nambiar',
    grade: 'Grade 10',
    section: 'B',
    guardianName: 'Radha Nambiar',
    phone: '+91 94110 55219',
    email: 'meera.n@student.sriyamschool.edu.in',
    attendance: 91.5,
    gpa: '9.1 / 10',
    feeStatus: 'PARTIAL',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'stu-5',
    rollNo: 'SRI-2026-1188',
    name: 'Rohan Joshi',
    grade: 'Grade 11',
    section: 'A',
    guardianName: 'Kishore Joshi',
    phone: '+91 98450 77123',
    email: 'rohan.j@student.sriyamschool.edu.in',
    attendance: 79.4,
    gpa: '7.6 / 10',
    feeStatus: 'OVERDUE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    active: true
  }
];

export const MOCK_PROTECTED_DOCUMENTS: ProtectedDocument[] = [
  {
    id: 'doc-phys-101',
    title: 'Advanced Mechanics & Gravitational Dynamics (Vol. 1)',
    subject: 'Physics',
    grade: 'Grade 10 & 11',
    uploadedBy: 'Prof. Sunita Nair (Sr. Physics Lead)',
    uploadedAt: '14 Nov 2026',
    type: 'CURRICULUM_NOTES',
    classification: 'CONFIDENTIAL',
    totalPages: 3,
    viewsCount: 342,
    fileSize: '4.8 MB (Encrypted Canvas Stream)',
    pages: [
      {
        pageNumber: 1,
        header: 'SRIYAM ACADEMIC COUNCIL • DEPARTMENT OF PHYSICAL SCIENCES',
        sections: [
          {
            title: '1. Newton’s Laws & Non-Inertial Reference Frames',
            body: [
              'When analyzing motion in an accelerating reference frame (such as an elevator accelerating upwards with acceleration "a"), fictitious pseudo-forces must be introduced to preserve the formal validity of Newton’s Second Law.',
              'The effective gravitational field inside an upward accelerating frame becomes g_eff = g + a, increasing the apparent weight of any suspended or resting mass.'
            ],
            callout: 'CRITICAL CONCEPT: Always sketch the Free Body Diagram (FBD) from an inertial ground observer first before converting to the non-inertial accelerating frame.',
            formulaOrDiagram: [
              'Σ F_real - m * a_frame = m * a_relative',
              'Apparent Weight: N = m * (g ± a)',
              'Centrifugal Pseudo-Force: F_cf = -m * (ω × (ω × r))'
            ]
          },
          {
            title: '2. Conservative Forces and Potential Energy Gradient',
            body: [
              'A force field is conservative if and only if the work done in moving a particle between two points is completely independent of the path taken.',
              'Mathematically, the force vector is the negative spatial gradient of the scalar potential field: F = -∇U.'
            ]
          }
        ]
      },
      {
        pageNumber: 2,
        header: 'SRIYAM ACADEMIC COUNCIL • CHAPTER 4: GRAVITATIONAL DYNAMICS',
        sections: [
          {
            title: '3. Escape Velocity and Orbital Mechanics',
            body: [
              'To completely escape the gravitational well of a planet of mass M and radius R, the total mechanical energy (Kinetic + Gravitational Potential) must be at least zero at infinity.',
              'Derivation from Conservation of Mechanical Energy: E_initial = (1/2) * m * v_esc² - (G * M * m) / R = 0.',
              'Solving yields the fundamental escape speed formula: v_esc = √(2 * G * M / R) = √(2 * g * R).'
            ],
            callout: 'EXAM NOTE: For Earth (R ≈ 6,400 km, g ≈ 9.8 m/s²), v_esc equals approximately 11.2 km/s regardless of the projectile mass or launch angle (ignoring atmospheric drag).',
            formulaOrDiagram: [
              'Escape Velocity: v_esc = √(2GM / R) ≈ 11.2 km/s',
              'Orbital Velocity at low orbit: v_orb = √(GM / R) ≈ 7.9 km/s',
              'Ratio: v_esc / v_orb = √2 ≈ 1.414'
            ]
          },
          {
            title: '4. Kepler’s Third Law of Planetary Motion',
            body: [
              'The square of the orbital period T of a planet is directly proportional to the cube of the semi-major axis "a" of its elliptical orbit: T² = (4π² / GM) * a³.'
            ]
          }
        ]
      },
      {
        pageNumber: 3,
        header: 'SRIYAM ACADEMIC COUNCIL • PROBLEM SOLVING & MOCK QUESTIONS',
        sections: [
          {
            title: 'Worked Exemplar 1 (Model Question for Term Exam)',
            body: [
              'Question: A satellite is orbiting Earth at an altitude h = 2R above the surface, where R is Earth radius. If its propulsion engine is fired to transfer it into an escape trajectory, calculate the minimum percentage increase in kinetic energy required.',
              'Solution Steps:',
              '1. Initial orbital radius r1 = R + 2R = 3R. Initial kinetic energy K1 = (1/2) * (G * M * m) / (3R).',
              '2. Potential energy at r1 = - (G * M * m) / (3R). Total initial energy E1 = - (G * M * m) / (6R).',
              '3. For escape, total energy must reach E2 = 0. Therefore new kinetic energy K2 = (G * M * m) / (3R) = 2 * K1.',
              '4. Percentage increase in Kinetic Energy = ((K2 - K1) / K1) * 100% = 100% increase.'
            ],
            callout: 'DO NOT SHARE OUTSIDE SRIYAM: This exact derivation appears in Section C of the upcoming Semester Mid-Term Examination.'
          }
        ]
      }
    ]
  },
  {
    id: 'doc-math-204',
    title: 'Grade 10 Board Exam Final Revision: Quadratic Calculus & Triangles',
    subject: 'Mathematics',
    grade: 'Grade 10',
    uploadedBy: 'Dr. V. R. Sharma (HOD Mathematics)',
    uploadedAt: '12 Nov 2026',
    type: 'QUESTION_BANK',
    classification: 'CONFIDENTIAL',
    totalPages: 2,
    viewsCount: 512,
    fileSize: '3.2 MB (Protected Stream)',
    pages: [
      {
        pageNumber: 1,
        header: 'SRIYAM SCHOOL • CONFIDENTIAL QUESTION VAULT - SET A',
        sections: [
          {
            title: 'Section I: Discriminant Analysis & Nature of Roots',
            body: [
              'Given a quadratic polynomial ax² + bx + c = 0 with real coefficients (a ≠ 0), the nature of roots is determined strictly by the discriminant D = b² - 4ac.',
              'Case A: D > 0 (Two distinct real roots)',
              'Case B: D = 0 (Two equal real roots / perfect square polynomial)',
              'Case C: D < 0 (Complex conjugate non-real roots)'
            ],
            callout: 'TRAP ALERT: If a and c have opposite signs (ac < 0), then -4ac is strictly positive, guaranteeing that D > 0 and the equation ALWAYS possesses two distinct real roots.',
            formulaOrDiagram: [
              'Roots: x = (-b ± √(b² - 4ac)) / (2a)',
              'Sum of roots: α + β = -b/a',
              'Product of roots: α * β = c/a'
            ]
          }
        ]
      },
      {
        pageNumber: 2,
        header: 'SRIYAM SCHOOL • GEOMETRIC THEOREMS & RIGOROUS PROOFS',
        sections: [
          {
            title: 'Section II: Basic Proportionality Theorem (Thales Theorem)',
            body: [
              'Statement: If a line is drawn parallel to one side of a triangle intersecting the other two sides in distinct points, then the other two sides are divided in the exact same ratio.',
              'Standard Verification Setup: In ΔABC, DE || BC. Draw altitudes DM ⊥ AC and EN ⊥ AB. Join BE and CD.',
              'Ratio of areas: Area(ΔADE) / Area(ΔBDE) = AD / DB.',
              'Equating areas on the same base DE between parallels DE and BC yields AD/DB = AE/EC.'
            ],
            callout: 'MANDATORY PROOF IN EXAM: Marks are deducted if the base altitude construction diagram is omitted.'
          }
        ]
      }
    ]
  },
  {
    id: 'doc-chem-302',
    title: 'Organic Reaction Mechanisms & Stereochemistry Master Guide',
    subject: 'Chemistry',
    grade: 'Grade 11 & 12',
    uploadedBy: 'Dr. Ananya Roy (Chemistry Faculty)',
    uploadedAt: '10 Nov 2026',
    type: 'CURRICULUM_NOTES',
    classification: 'STRICT_INTERNAL',
    totalPages: 2,
    viewsCount: 289,
    fileSize: '5.1 MB (Encrypted)',
    pages: [
      {
        pageNumber: 1,
        header: 'SRIYAM SCHOOL • DEPARTMENT OF CHEMICAL SCIENCES',
        sections: [
          {
            title: 'Nucleophilic Substitution: SN1 vs SN2 Mechanistic Pathways',
            body: [
              'The SN1 pathway proceeds via a two-step mechanism through a planar carbocation intermediate, leading to racemization with slight net inversion due to front-side ion pairing.',
              'The SN2 pathway is a concerted single-step bimolecular substitution characterized by backside nucleophilic attack, producing 100% Walden inversion of stereochemical configuration.'
            ],
            formulaOrDiagram: [
              'SN1 Rate = k [Substrate]',
              'SN2 Rate = k [Substrate] [Nucleophile]',
              'Substrate reactivity order (SN1): 3° > 2° > 1° > Methyl',
              'Substrate reactivity order (SN2): Methyl > 1° > 2° > 3° (Steric hindrance dominant)'
            ]
          }
        ]
      },
      {
        pageNumber: 2,
        header: 'SRIYAM SCHOOL • STEREOCHEMICAL CONVERSIONS',
        sections: [
          {
            title: 'Cahn-Ingold-Prelog (CIP) Priority Rules for R/S Assignment',
            body: [
              '1. Prioritize atoms directly attached to stereocenter strictly by decreasing atomic number (Z).',
              '2. If atoms are identical, proceed outward along the chain to the first point of difference.',
              '3. Orient the molecule so that the lowest priority group (4) points away from the viewer (dashed wedge).',
              '4. Trace 1 → 2 → 3: Clockwise indicates (R) Rectus; Counter-clockwise indicates (S) Sinister.'
            ]
          }
        ]
      }
    ]
  }
];

export const MOCK_FEES: FeeInvoice[] = [
  {
    id: 'inv-101',
    studentId: 'stu-1',
    studentName: 'Aarav Sharma',
    rollNo: 'SRI-2026-1042',
    grade: 'Grade 10',
    term: 'Term 2 (Oct 2026 - Jan 2027)',
    amount: 38500,
    dueDate: '2026-10-15',
    status: 'PAID',
    receiptNo: 'REC-SRI-2026-8812',
    paidOn: '2026-10-11',
    paymentMethod: 'Net Banking (HDFC)'
  },
  {
    id: 'inv-102',
    studentId: 'stu-2',
    studentName: 'Riya Patel',
    rollNo: 'SRI-2026-1208',
    grade: 'Grade 12',
    term: 'Term 2 (Oct 2026 - Jan 2027)',
    amount: 45000,
    dueDate: '2026-11-25',
    status: 'PENDING'
  },
  {
    id: 'inv-103',
    studentId: 'stu-5',
    studentName: 'Rohan Joshi',
    rollNo: 'SRI-2026-1188',
    grade: 'Grade 11',
    term: 'Term 1 (Jun 2026 - Sep 2026)',
    amount: 42000,
    dueDate: '2026-09-30',
    status: 'OVERDUE'
  },
  {
    id: 'inv-104',
    studentId: 'stu-3',
    studentName: 'Siddharth Verma',
    rollNo: 'SRI-2026-1015',
    grade: 'Grade 10',
    term: 'Term 2 (Oct 2026 - Jan 2027)',
    amount: 38500,
    dueDate: '2026-10-15',
    status: 'PAID',
    receiptNo: 'REC-SRI-2026-8840',
    paidOn: '2026-10-08',
    paymentMethod: 'UPI (GPay)'
  }
];

export const MOCK_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'Mid-Term Board Preparation Mock Schedule & Examination Guidelines',
    category: 'EXAM',
    targetAudience: 'ALL',
    publishedDate: '15 Nov 2026',
    publishedBy: 'Controller of Examinations',
    priority: 'URGENT',
    content: 'All students of Grades 9 to 12 are hereby notified that Mid-Term Mock Examinations will commence from December 2, 2026. Hall tickets will be issued digitally through the student portal. Proprietary revision documents and model solutions are uploaded to the Secure Document Vault for registered students only.'
  },
  {
    id: 'not-2',
    title: 'Strict Intellectual Property & Digital Material Policy for Students',
    category: 'CIRCULAR',
    targetAudience: 'STUDENTS',
    publishedDate: '10 Nov 2026',
    publishedBy: 'School Management & Legal Council',
    priority: 'HIGH',
    content: 'All study notes, question banks, and curriculum slides provided via the Sriyam School Student Portal are strictly confidential intellectual property. Downloading, capturing screens, recording, or redistributing materials is strictly prohibited and monitored with dynamic forensic watermark technology. Violations lead to immediate suspension.'
  },
  {
    id: 'not-3',
    title: 'Annual Inter-House Athletics Meet & Cultural Fest 2026',
    category: 'EVENT',
    targetAudience: 'ALL',
    publishedDate: '08 Nov 2026',
    publishedBy: 'Sports & Cultural Committee',
    priority: 'NORMAL',
    content: 'Sriyam School will host its 18th Annual Sports & Cultural Meet on December 18-19 at the central stadium. House captains are requested to submit participant rosters before November 25.'
  }
];

export const INITIAL_AUDIT_LOGS: SecurityAuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-11-18 13:42:10',
    actorName: 'Aarav Sharma (SRI-2026-1042)',
    actorRole: 'STUDENT',
    action: 'DOCUMENT_VIEWED',
    documentTitle: 'Advanced Mechanics & Gravitational Dynamics (Vol. 1)',
    ipAddress: '115.112.44.82',
    status: 'LOGGED',
    details: 'Canvas page rendered with personalized forensic watermark.'
  },
  {
    id: 'log-2',
    timestamp: '2026-11-18 13:43:05',
    actorName: 'Aarav Sharma (SRI-2026-1042)',
    actorRole: 'STUDENT',
    action: 'PRINT_ATTEMPT_BLOCKED',
    documentTitle: 'Advanced Mechanics & Gravitational Dynamics (Vol. 1)',
    ipAddress: '115.112.44.82',
    status: 'BLOCKED',
    details: 'Intercepted Ctrl+P shortcut. Screen blacked out and print stylesheet triggered zero-visibility.'
  },
  {
    id: 'log-3',
    timestamp: '2026-11-18 13:43:22',
    actorName: 'Aarav Sharma (SRI-2026-1042)',
    actorRole: 'STUDENT',
    action: 'SCREEN_CAPTURE_BLOCKED',
    documentTitle: 'Advanced Mechanics & Gravitational Dynamics (Vol. 1)',
    ipAddress: '115.112.44.82',
    status: 'FLAGGED',
    details: 'Window lost focus / Snipping tool blur triggered. Clipboard purged of potential screenshot buffer.'
  },
  {
    id: 'log-4',
    timestamp: '2026-11-18 12:15:00',
    actorName: 'Riya Patel (SRI-2026-1208)',
    actorRole: 'STUDENT',
    action: 'COPY_ATTEMPT_BLOCKED',
    documentTitle: 'Organic Reaction Mechanisms & Stereochemistry',
    ipAddress: '182.73.18.90',
    status: 'BLOCKED',
    details: 'Right-click context menu and text selection blocked on secure canvas layer.'
  },
  {
    id: 'log-5',
    timestamp: '2026-11-18 09:30:11',
    actorName: 'Dr. V. R. Sharma',
    actorRole: 'ADMIN',
    action: 'STUDENT_LOGIN',
    ipAddress: '10.0.1.5',
    status: 'LOGGED',
    details: 'Super Admin authenticated via secure 2FA dashboard.'
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'crs-1',
    title: 'Advanced Mechanics & Gravitational Dynamics',
    code: 'PHY-101',
    department: 'Department of Physical Sciences',
    semester: 'Grade 10 & 11 • Semester I',
    instructor: 'Prof. Sunita Nair',
    enrolledCount: 142,
    modulesCount: 8,
    status: 'ACTIVE',
    price: 38500,
    description: 'Newtonian dynamics, rotating frames of reference, central gravitational potentials, and orbital mechanics with problem solving exemplars.',
    materials: [
      {
        id: 'mat-phy-01',
        title: 'Advanced Mechanics & Non-Inertial Dynamics (Vol. 1)',
        fileName: 'PHY101_Mechanics_Proprietary_Vol1.pdf',
        fileSize: '4.8 MB',
        totalPages: 3,
        uploadedAt: '18 Nov 2026',
        encryptionAlgorithm: 'AES-256-GCM',
        encryptionChecksum: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        documentRefId: 'doc-phys-101',
        downloadUrl: '/sample-curriculum.pdf'
      },
      {
        id: 'mat-phy-02',
        title: 'Gravitational Potential Fields & Keplerian Orbits (Vol. 2)',
        fileName: 'PHY101_Gravitation_Complete_Notes.pdf',
        fileSize: '6.2 MB',
        totalPages: 3,
        uploadedAt: '20 Nov 2026',
        encryptionAlgorithm: 'AES-256-GCM',
        encryptionChecksum: 'sha256-9f833a10c88e8bc584b39f20b017ae5b41297d04156c4801a3fb3a4cb76f4158',
        documentRefId: 'doc-phys-101',
        downloadUrl: '/sample-curriculum.pdf'
      }
    ]
  },
  {
    id: 'crs-2',
    title: 'Differential Calculus & Coordinate Geometry',
    code: 'MTH-201',
    department: 'Department of Mathematical Sciences',
    semester: 'Grade 10 • Semester II',
    instructor: 'Dr. V. R. Sharma',
    enrolledCount: 168,
    modulesCount: 10,
    status: 'ACTIVE',
    price: 45000,
    description: 'Quadratic roots, Cartesian coordinate geometry, conic sections, limits, continuity, and introductory differential calculus.',
    materials: [
      {
        id: 'mat-mth-01',
        title: 'Differential Calculus & Real Analysis Core Handbook',
        fileName: 'MTH201_Calculus_Proofs_Encrypted.pdf',
        fileSize: '5.1 MB',
        totalPages: 3,
        uploadedAt: '12 Nov 2026',
        encryptionAlgorithm: 'AES-256-GCM',
        encryptionChecksum: 'sha256-785f397e1088dd61f4642545ba2f1ff394149639e826fb3b5220ef5424e9826f',
        documentRefId: 'doc-math-201',
        downloadUrl: '/sample-curriculum.pdf'
      }
    ]
  },
  {
    id: 'crs-3',
    title: 'Organic Reaction Mechanisms & Stereochemistry',
    code: 'CHM-301',
    department: 'Department of Chemical Sciences',
    semester: 'Grade 11 & 12 • Semester I',
    instructor: 'Dr. Ananya Roy',
    enrolledCount: 118,
    modulesCount: 6,
    status: 'ACTIVE',
    price: 42000,
    description: 'Electrophilic and nucleophilic pathways (SN1/SN2), carbocation rearrangements, CIP priority rules, and aromatic substitution reactions.',
    materials: [
      {
        id: 'mat-chm-01',
        title: 'Organic Stereochemistry & Reaction Pathways',
        fileName: 'CHM301_Reaction_Stereochem_Safe.pdf',
        fileSize: '8.4 MB',
        totalPages: 3,
        uploadedAt: '05 Nov 2026',
        encryptionAlgorithm: 'AES-256-GCM',
        encryptionChecksum: 'sha256-ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
        documentRefId: 'doc-chem-301',
        downloadUrl: '/sample-curriculum.pdf'
      }
    ]
  },
  {
    id: 'crs-4',
    title: 'Cellular Biology, Genetics & Evolution',
    code: 'BIO-401',
    department: 'Department of Biological Sciences',
    semester: 'Grade 11 & 12 • Semester I',
    instructor: 'Dr. Sneha Paul',
    enrolledCount: 94,
    modulesCount: 7,
    status: 'ACTIVE',
    price: 44000,
    description: 'Mendelian heredity, DNA replication fidelity, cellular respiration pathways, and modern CRISPR gene editing principles.',
    materials: [
      {
        id: 'mat-bio-01',
        title: 'Molecular Biology & Genetics Comprehensive Notes',
        fileName: 'BIO401_CRISPR_Genetics_Encrypted.pdf',
        fileSize: '7.3 MB',
        totalPages: 3,
        uploadedAt: '10 Nov 2026',
        encryptionAlgorithm: 'AES-256-GCM',
        encryptionChecksum: 'sha256-5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        documentRefId: 'doc-bio-401',
        downloadUrl: '/sample-curriculum.pdf'
      }
    ]
  }
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q-1',
    subject: 'Physics',
    department: 'Physical Sciences',
    type: 'MCQ',
    difficulty: 'HARD',
    text: 'A satellite orbits at altitude h = 2R above Earth. What percentage increase in kinetic energy is required to put it into a parabolic escape trajectory?',
    options: ['50%', '100%', '141.4%', '200%'],
    correctAnswer: '100%',
    marks: 4
  },
  {
    id: 'q-2',
    subject: 'Chemistry',
    department: 'Chemical Sciences',
    type: 'MCQ',
    difficulty: 'MEDIUM',
    text: 'Which substrate reacts fastest via SN2 nucleophilic substitution with aqueous KOH?',
    options: ['1-Bromopropane (Primary)', '2-Bromopropane (Secondary)', '2-Bromo-2-methylpropane (Tertiary)', 'Bromobenzene'],
    correctAnswer: '1-Bromopropane (Primary)',
    marks: 3
  },
  {
    id: 'q-3',
    subject: 'Mathematics',
    department: 'Mathematical Sciences',
    type: 'ESSAY',
    difficulty: 'MEDIUM',
    text: 'State and prove the Basic Proportionality Theorem (Thales Theorem). Include the altitude construction and area ratio derivation.',
    marks: 5
  },
  {
    id: 'q-4',
    subject: 'Computer Science',
    department: 'Computer Science & IT',
    type: 'CODING',
    difficulty: 'HARD',
    text: 'Implement a binary search tree in Python that supports O(log n) average-case insertion, deletion, and in-order traversal.',
    marks: 10
  }
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Numerical Problem Set: Centripetal & Gravitational Force Equations',
    course: 'Advanced Mechanics & Gravitational Dynamics',
    dueDate: '2026-12-05',
    totalMarks: 25,
    submissionsCount: 112,
    totalStudents: 142,
    status: 'ACTIVE',
    description: 'Solve problems 14 through 28 from Volume 1. Show Free Body Diagrams for all non-inertial frame cases.'
  },
  {
    id: 'asg-2',
    title: 'Proof & Exemplars: Coordinate Geometry & Tangent Slopes',
    course: 'Differential Calculus & Coordinate Geometry',
    dueDate: '2026-11-30',
    totalMarks: 20,
    submissionsCount: 154,
    totalStudents: 168,
    status: 'EVALUATED',
    description: 'Calculate equations of tangents and normals to parabolas at prescribed parameter points.'
  },
  {
    id: 'asg-3',
    title: 'Reaction Pathway Diagram: Stereochemical Inversion in Alkyl Halides',
    course: 'Organic Reaction Mechanisms & Stereochemistry',
    dueDate: '2026-12-08',
    totalMarks: 30,
    submissionsCount: 45,
    totalStudents: 118,
    status: 'ACTIVE',
    description: 'Construct detailed reaction coordinate energy curves comparing SN1 carbocation intermediates with SN2 pentacoordinate transition states.'
  }
];

export const MOCK_LIVE_CLASSES: LiveClass[] = [
  {
    id: 'live-1',
    title: 'Live Masterclass: Keplerian Elliptical Orbits & Orbital Energy Analysis',
    course: 'Advanced Mechanics & Gravitational Dynamics',
    instructor: 'Prof. Sunita Nair',
    date: 'Today',
    time: '11:00 AM - 12:30 PM',
    duration: '90 Mins',
    meetUrl: 'https://meet.sriyamschool.edu.in/phy-101-kepler',
    status: 'LIVE'
  },
  {
    id: 'live-2',
    title: 'Interactive Tutorial: Thales Theorem Applications & Board Exam Traps',
    course: 'Differential Calculus & Coordinate Geometry',
    instructor: 'Dr. V. R. Sharma',
    date: 'Tomorrow',
    time: '09:00 AM - 10:15 AM',
    duration: '75 Mins',
    meetUrl: 'https://meet.sriyamschool.edu.in/mth-201-thales',
    status: 'SCHEDULED'
  },
  {
    id: 'live-3',
    title: 'Laboratory Session: Organic Synthesis and Thin Layer Chromatography',
    course: 'Organic Reaction Mechanisms & Stereochemistry',
    instructor: 'Dr. Ananya Roy',
    date: '28 Nov 2026',
    time: '02:00 PM - 03:30 PM',
    duration: '90 Mins',
    meetUrl: 'https://meet.sriyamschool.edu.in/chm-301-lab',
    status: 'SCHEDULED'
  }
];

export const MOCK_ATTENDANCE: AttendanceSession[] = [
  {
    id: 'att-1',
    date: '2026-11-25',
    course: 'Advanced Mechanics & Dynamics',
    section: 'Grade 10 - Section A',
    faculty: 'Prof. Sunita Nair',
    presentCount: 38,
    totalCount: 40,
    status: 'SUBMITTED'
  },
  {
    id: 'att-2',
    date: '2026-11-25',
    course: 'Differential Calculus',
    section: 'Grade 10 - Section B',
    faculty: 'Dr. V. R. Sharma',
    presentCount: 41,
    totalCount: 42,
    status: 'SUBMITTED'
  },
  {
    id: 'att-3',
    date: '2026-11-24',
    course: 'Organic Chemistry Lab',
    section: 'Grade 11 - Section A',
    faculty: 'Dr. Ananya Roy',
    presentCount: 34,
    totalCount: 36,
    status: 'SUBMITTED'
  }
];

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Mid-Term Physics Mock Examination',
    date: '2026-12-02',
    type: 'EXAM',
    timing: '09:00 AM - 12:00 PM',
    tag: 'All Grade 10 & 11'
  },
  {
    id: 'evt-2',
    title: 'Mathematics Core Term Paper',
    date: '2026-12-05',
    type: 'EXAM',
    timing: '09:00 AM - 12:00 PM',
    tag: 'Grade 10'
  },
  {
    id: 'evt-3',
    title: 'Assignment 1 Submission Deadline (Physics)',
    date: '2026-12-05',
    type: 'DEADLINE',
    timing: '11:59 PM',
    tag: 'PHY-101'
  },
  {
    id: 'evt-4',
    title: 'Chemistry Laboratory Assessment',
    date: '2026-12-08',
    type: 'EXAM',
    timing: '01:00 PM - 04:00 PM',
    tag: 'Grade 11 & 12'
  },
  {
    id: 'evt-5',
    title: 'Annual Sports & Cultural Meet',
    date: '2026-12-18',
    type: 'HOLIDAY',
    timing: 'Full Day Event',
    tag: 'Whole School'
  }
];


