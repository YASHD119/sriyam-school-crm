import React, { useState } from 'react';
import { 
  FileQuestion, 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  X,
  Code2,
  PenTool,
  Check
} from 'lucide-react';
import { Question, UserSession } from '../types';

interface QuestionBankViewProps {
  questions: Question[];
  currentUser: UserSession;
  onAddQuestion?: (question: Question) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  questions,
  currentUser,
  onAddQuestion
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [importedNotice, setImportedNotice] = useState<string | null>(null);

  const isStudent = currentUser.role === 'STUDENT';

  // New question form state
  const [newQ, setNewQ] = useState<Omit<Question, 'id'>>({
    subject: 'Physics',
    department: 'Physical Sciences',
    type: 'MCQ',
    difficulty: 'MEDIUM',
    text: '',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 'Option A',
    marks: 4
  });

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = 
      q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || q.type === selectedType;
    const matchesDiff = selectedDifficulty === 'ALL' || q.difficulty === selectedDifficulty;
    const matchesDept = selectedDept === 'ALL' || q.department.includes(selectedDept);
    return matchesSearch && matchesType && matchesDiff && matchesDept;
  });

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["ID,Subject,Department,Type,Difficulty,Marks,QuestionText"]
      .concat(filteredQuestions.map(q => `"${q.id}","${q.subject}","${q.department}","${q.type}","${q.difficulty}",${q.marks},"${q.text.replace(/"/g, '""')}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sriyam_question_bank_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulateImport = (format: string) => {
    setImportedNotice(`Successfully parsed and validated 15 questions from ${format} upload.`);
    setTimeout(() => setImportedNotice(null), 3000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQ.text) return;
    if (onAddQuestion) {
      onAddQuestion({
        ...newQ,
        id: `q-${Date.now()}`
      });
    }
    setIsAddModalOpen(false);
    setNewQ({
      subject: 'Physics',
      department: 'Physical Sciences',
      type: 'MCQ',
      difficulty: 'MEDIUM',
      text: '',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
      marks: 4
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header matching edulateral LMS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Assessment Question Bank</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {filteredQuestions.length} Authored
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse, filter, and author questions across colleges, departments, subjects, and semesters.
          </p>
        </div>

        {!isStudent && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSimulateImport('Excel/CSV')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition"
              title="Import questions from spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Import Excel/CSV</span>
            </button>

            <button
              onClick={() => handleSimulateImport('PDF Document')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>Import PDF</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Question</span>
            </button>
          </div>
        )}
      </div>

      {/* Import Toast Notice */}
      {importedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{importedNotice}</span>
        </div>
      )}

      {/* Filter and Hierarchy Bar matching edulateral LMS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-emerald-600" />
          <span>Filter & Hierarchy Scope</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search text */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Department */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Departments</option>
              <option value="Physical">Physical Sciences</option>
              <option value="Mathematical">Mathematical Sciences</option>
              <option value="Chemical">Chemical Sciences</option>
              <option value="Computer">Computer Science & IT</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Question Types</option>
              <option value="MCQ">Multiple Choice (MCQ)</option>
              <option value="ESSAY">Essay / Descriptive</option>
              <option value="CODING">CodeLab Coding</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-emerald-400 transition space-y-3"
          >
            {/* Top row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-slate-400">
                  #{idx + 1}
                </span>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  q.type === 'MCQ' ? 'bg-blue-100 text-blue-800' :
                  q.type === 'CODING' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {q.type}
                </span>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  q.difficulty === 'HARD' ? 'bg-rose-100 text-rose-800' :
                  q.difficulty === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {q.difficulty}
                </span>

                <span className="text-xs text-slate-500 font-medium">
                  {q.subject} • {q.department}
                </span>
              </div>

              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {q.marks} Marks
              </span>
            </div>

            {/* Question body */}
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
              {q.text}
            </p>

            {/* MCQ Options if available */}
            {q.options && q.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {q.options.map((opt, oIdx) => (
                  <div
                    key={oIdx}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                      !isStudent && opt === q.correctAnswer
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold'
                        : 'bg-slate-50 border-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                    {!isStudent && opt === q.correctAnswer && (
                      <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Correct</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Question Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-emerald-600" />
                <span>Author New Question</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Question Text *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newQ.text}
                  onChange={(e) => setNewQ({ ...newQ, text: e.target.value })}
                  placeholder="State the mathematical derivation, multiple-choice prompt, or problem statement..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Type
                  </label>
                  <select
                    value={newQ.type}
                    onChange={(e) => setNewQ({ ...newQ, type: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="ESSAY">Essay</option>
                    <option value="CODING">Coding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newQ.difficulty}
                    onChange={(e) => setNewQ({ ...newQ, difficulty: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Marks
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={newQ.marks}
                    onChange={(e) => setNewQ({ ...newQ, marks: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
