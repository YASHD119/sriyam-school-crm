import { UserSession, Lead, StudentRecord, ProtectedDocument, FeeInvoice, Notice, SecurityAuditLog } from '../types';

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
    studentName: 'Ananya Deshmukh',
    guardianName: 'Vikram Deshmukh',
    email: 'vikram.d@corporate.in',
    phone: '+91 98112 33445',
    gradeApplying: 'Grade 11 (Science-PCM)',
    status: 'TEST_SCHEDULED',
    source: 'WEBSITE',
    createdAt: '2026-11-12',
    lastContacted: '2026-11-16',
    notes: 'Inquired about JEE coaching integration with school curriculum. Test scheduled for Nov 22.',
    priority: 'HIGH'
  },
  {
    id: 'lead-2',
    studentName: 'Kabir Malhotra',
    guardianName: 'Sanjay Malhotra',
    email: 'sanjay.m@gmail.com',
    phone: '+91 99302 44112',
    gradeApplying: 'Grade 9',
    status: 'OFFER_MADE',
    source: 'REFERRAL',
    createdAt: '2026-11-05',
    lastContacted: '2026-11-17',
    notes: 'Transfer from Delhi Public School. Admission test passed with 89%. Fee invoice generated.',
    priority: 'HIGH'
  },
  {
    id: 'lead-3',
    studentName: 'Ishaani Sen',
    guardianName: 'Dr. Debasish Sen',
    email: 'dsen.aiims@med.org',
    phone: '+91 97182 99001',
    gradeApplying: 'Grade 11 (Science-PCB)',
    status: 'CAMPUS_TOUR',
    source: 'EDUCATION_FAIR',
    createdAt: '2026-11-14',
    lastContacted: '2026-11-15',
    notes: 'Looking for modern biology and chemistry laboratory facilities. Campus tour attended on Nov 15.',
    priority: 'MEDIUM'
  },
  {
    id: 'lead-4',
    studentName: 'Devansh Kulkarni',
    guardianName: 'Anjali Kulkarni',
    email: 'kulkarni.anjali@fintech.co',
    phone: '+91 98801 12349',
    gradeApplying: 'Grade 10',
    status: 'NEW_INQUIRY',
    source: 'WEBSITE',
    createdAt: '2026-11-17',
    lastContacted: '2026-11-17',
    notes: 'Submitted online contact form regarding mid-term transfer feasibility and syllabus compatibility.',
    priority: 'HIGH'
  },
  {
    id: 'lead-5',
    studentName: 'Tanvi Iyer',
    guardianName: 'Ramesh Iyer',
    email: 'iyer.ramesh@tech.com',
    phone: '+91 99200 48831',
    gradeApplying: 'Grade 6',
    status: 'ENROLLED',
    source: 'WALK_IN',
    createdAt: '2026-10-28',
    lastContacted: '2026-11-10',
    notes: 'Admission confirmed. Welcome kit and LMS/Portal credentials dispatched.',
    priority: 'LOW'
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

