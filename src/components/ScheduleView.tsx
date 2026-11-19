import React from 'react';
import { Calendar, Clock, MapPin, BookOpen, AlertCircle } from 'lucide-react';
import { UserSession } from '../types';

interface ScheduleViewProps {
  currentUser: UserSession;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ currentUser }) => {
  const isStudent = currentUser.role === 'STUDENT';
  const grade = currentUser.studentDetails?.grade || 'Grade 10';

  const timetable = [
    { day: 'Monday', slots: [
      { time: '08:30 - 09:30 AM', subject: 'Physics (Mechanics)', faculty: 'Prof. Sunita Nair', room: 'Hall 201' },
      { time: '09:45 - 10:45 AM', subject: 'Mathematics (Calculus)', faculty: 'Dr. V. R. Sharma', room: 'Hall 201' },
      { time: '11:00 - 12:00 PM', subject: 'Chemistry (Organic)', faculty: 'Dr. Ananya Roy', room: 'Lab 3' },
      { time: '01:00 - 02:00 PM', subject: 'English Literature', faculty: 'Ms. Kavita Menon', room: 'Hall 201' },
    ]},
    { day: 'Tuesday', slots: [
      { time: '08:30 - 09:30 AM', subject: 'Mathematics (Coordinate Geo)', faculty: 'Dr. V. R. Sharma', room: 'Hall 201' },
      { time: '09:45 - 10:45 AM', subject: 'Physics Practical Lab', faculty: 'Prof. Sunita Nair', room: 'Physics Lab 1' },
      { time: '11:00 - 12:00 PM', subject: 'Biology & Genetics', faculty: 'Dr. Sneha Paul', room: 'Biology Lab 2' },
      { time: '01:00 - 02:00 PM', subject: 'Computer Science (Python)', faculty: 'Mr. Arvind Saxena', room: 'IT Lab A' },
    ]},
    { day: 'Wednesday', slots: [
      { time: '08:30 - 09:30 AM', subject: 'Chemistry Lab Practical', faculty: 'Dr. Ananya Roy', room: 'Chem Lab 2' },
      { time: '09:45 - 10:45 AM', subject: 'Physics (Optics)', faculty: 'Prof. Sunita Nair', room: 'Hall 201' },
      { time: '11:00 - 12:00 PM', subject: 'Mathematics (Problem Session)', faculty: 'Dr. V. R. Sharma', room: 'Hall 201' },
      { time: '01:00 - 02:00 PM', subject: 'Physical Education / Sports', faculty: 'Coach Rawat', room: 'Ground' },
    ]}
  ];

  const exams = [
    { date: 'Dec 02, 2026', subject: 'Advanced Physics (Term 2)', timing: '09:00 AM - 12:00 PM', syllabus: 'Mechanics, Gravitation, Fluid Dynamics' },
    { date: 'Dec 05, 2026', subject: 'Mathematics Core', timing: '09:00 AM - 12:00 PM', syllabus: 'Quadratic Equations, Geometry, Trigonometry' },
    { date: 'Dec 08, 2026', subject: 'Chemistry (Inorganic & Organic)', timing: '09:00 AM - 12:00 PM', syllabus: 'Reaction Mechanisms, Periodic Trends' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Weekly Class Timetable & Mock Exam Schedule</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            {grade}
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Synchronized schedule for lectures, laboratory sessions, and upcoming semester examinations.
        </p>
      </div>

      {/* Upcoming Exams Alert */}
      <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-amber-900">Semester Mock Examinations Notification</h4>
          <p className="text-xs text-amber-800 mt-0.5">
            Revision question banks have been published to the <strong>Protected Study Notes</strong> section in read-only mode. Ensure you review the notes before examination day.
          </p>
        </div>
      </div>

      {/* Exam Schedule Grid */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>Upcoming Examination Dates</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exams.map((exam, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {exam.date}
              </span>
              <h4 className="font-bold text-slate-900 text-xs">{exam.subject}</h4>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{exam.timing}</span>
              </div>
              <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                Syllabus: {exam.syllabus}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Timetable Days */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Weekly Lecture Schedule ({grade})
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {timetable.map((t, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="font-bold text-xs text-emerald-800 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>{t.day}</span>
                <span className="text-[10px] font-normal text-slate-400">{t.slots.length} Lectures</span>
              </div>

              <div className="space-y-2.5">
                {t.slots.map((slot, sIdx) => (
                  <div key={sIdx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>{slot.time}</span>
                      <span className="font-sans font-semibold text-slate-600">{slot.room}</span>
                    </div>
                    <div className="font-bold text-slate-900">{slot.subject}</div>
                    <div className="text-[11px] text-slate-500">{slot.faculty}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

