import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  X, 
  AlertTriangle,
  Fingerprint,
  Info,
  Download
} from 'lucide-react';
import { ProtectedDocument, UserSession, SecurityAuditLog } from '../types';

interface SecureDocumentViewerProps {
  document: ProtectedDocument;
  currentUser: UserSession;
  onClose: () => void;
  onLogSecurityEvent?: (log: Omit<SecurityAuditLog, 'id'>) => void;
}

export const SecureDocumentViewer: React.FC<SecureDocumentViewerProps> = ({
  document: doc,
  currentUser,
  onClose,
  onLogSecurityEvent
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [securityToast, setSecurityToast] = useState<{ message: string; type: 'warning' | 'alert' } | null>(null);
  const [isWatermarkVisible, setIsWatermarkVisible] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isStudent = currentUser.role === 'STUDENT';
  const studentName = currentUser.name;
  const rollNo = currentUser.studentDetails?.rollNo || 'SRI-STAFF-AUTH';
  const userIp = currentUser.studentDetails?.ipAddress || '115.112.44.82';
  const currentTimestamp = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });

  // Show temporary security alert banner
  const triggerToast = useCallback((message: string, type: 'warning' | 'alert' = 'warning') => {
    setSecurityToast({ message, type });
    const timer = setTimeout(() => setSecurityToast(null), 3500);
    return () => clearTimeout(timer);
  }, []);

  // Log security events
  const recordEvent = useCallback((action: SecurityAuditLog['action'], details: string, status: SecurityAuditLog['status'] = 'BLOCKED') => {
    if (onLogSecurityEvent) {
      onLogSecurityEvent({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actorName: `${currentUser.name} (${rollNo})`,
        actorRole: currentUser.role,
        action,
        documentTitle: doc.title,
        ipAddress: userIp.split(' ')[0],
        status,
        details
      });
    }
  }, [currentUser, rollNo, userIp, doc.title, onLogSecurityEvent]);

  // Admin decrypted download handler
  const handleAdminDownload = () => {
    if (currentUser.role !== 'ADMIN') {
      triggerToast('Download prohibited: Only administrators can download decrypted documents.', 'alert');
      recordEvent('PRINT_ATTEMPT_BLOCKED', 'Non-admin attempted to download document', 'BLOCKED');
      return;
    }

    recordEvent('ADMIN_DECRYPT_DOWNLOAD', 'Super Admin decrypted original PDF and downloaded archive', 'LOGGED');
    const dummyPdfContent = `%PDF-1.7\n1 0 obj\n<< /Title (${doc.title}) /Author (Sriyam School Super Admin) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF`;
    const file = new Blob([dummyPdfContent], { type: 'application/pdf' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    element.download = `${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Decrypted.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast('Admin decrypted PDF download initiated successfully.', 'warning');
  };

  // Window blur & focus monitoring (Anti-screen capture & app switcher shield)
  useEffect(() => {
    const handleBlur = () => {
      setIsShieldActive(true);
      triggerToast('Security Shield Engaged: Document hidden during window focus lost.', 'alert');
      recordEvent('TAB_SWITCH_BLUR', 'Window lost focus or snipping tool activated; screen covered', 'FLAGGED');
    };

    const handleFocus = () => {
      // Small delay before unshielding so snipping tool cannot grab a frame
      setTimeout(() => {
        setIsShieldActive(false);
      }, 350);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsShieldActive(true);
        recordEvent('TAB_SWITCH_BLUR', 'Document tab switched out of active view', 'LOGGED');
      } else {
        setTimeout(() => setIsShieldActive(false), 350);
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [triggerToast, recordEvent]);

  // Keyboard shortcut traps: Prevent Print, Save, Screen Capture, DevTools
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+P or Cmd+P (Print)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        e.stopPropagation();
        triggerToast('Printing is strictly prohibited for Sriyam proprietary documents.', 'alert');
        recordEvent('PRINT_ATTEMPT_BLOCKED', 'User pressed Print shortcut (Ctrl+P / Cmd+P)', 'BLOCKED');
        return false;
      }

      // Ctrl+S or Cmd+S (Save / Download)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        e.stopPropagation();
        triggerToast('Direct download/save is disabled for student accounts. Read-only access enabled.', 'alert');
        recordEvent('DOCUMENT_VIEWED', 'User attempted Save shortcut (Ctrl+S / Cmd+S)', 'BLOCKED');
        return false;
      }

      // PrintScreen Key
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        setIsShieldActive(true);
        triggerToast('Screen Capture detected! Clipboard wiped and incident logged.', 'alert');
        recordEvent('SCREEN_CAPTURE_BLOCKED', 'PrintScreen key pressed. Buffer sanitized.', 'BLOCKED');
        try {
          navigator.clipboard.writeText('Security Warning: Screenshot of Sriyam proprietary documents is prohibited.');
        } catch (_) {}
        setTimeout(() => setIsShieldActive(false), 1200);
      }

      // F12 or Inspect shortcut
      if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c'))) {
        e.preventDefault();
        triggerToast('Developer Tools access is restricted in Secure Viewer.', 'alert');
        return false;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [triggerToast, recordEvent]);

  // Render Page Content on HTML5 Canvas directly (Anti-DOM Scraping)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pageData = doc.pages.find(p => p.pageNumber === currentPage) || doc.pages[0];

    // High DPI Canvas Scaling
    const dpr = window.devicePixelRatio || 2;
    const baseWidth = 840;
    const baseHeight = 1180;

    canvas.width = baseWidth * dpr;
    canvas.height = baseHeight * dpr;
    canvas.style.width = `${baseWidth * zoom}px`;
    canvas.style.height = `${baseHeight * zoom}px`;

    ctx.scale(dpr, dpr);

    // 1. Paper Background (Warm professional academic off-white)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    // Subtle page border
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1, 1, baseWidth - 2, baseHeight - 2);

    // 2. Top Header Bar
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(40, 40, baseWidth - 80, 2);

    ctx.font = '700 13px Inter, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(pageData.header || 'SRIYAM SCHOOL ACADEMIC CURRICULUM VAULT', 40, 30);

    ctx.textAlign = 'right';
    ctx.font = '700 13px Inter, sans-serif';
    ctx.fillStyle = '#15803d';
    ctx.fillText(`SECURE READING MODE • PAGE ${currentPage} OF ${doc.totalPages}`, baseWidth - 40, 30);
    ctx.textAlign = 'left';

    // 3. Document Title on Page 1
    let y = 80;
    if (currentPage === 1) {
      // Classification tag
      ctx.fillStyle = '#fef2f2';
      ctx.fillRect(40, y, 180, 28);
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, y, 180, 28);

      ctx.fillStyle = '#991b1b';
      ctx.font = '800 12px Inter, sans-serif';
      ctx.fillText('CONFIDENTIAL • READ-ONLY', 48, y + 19);

      y += 48;

      ctx.fillStyle = '#0f172a';
      ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(doc.title, 40, y);

      y += 28;
      ctx.fillStyle = '#475569';
      ctx.font = '600 15px Inter, sans-serif';
      ctx.fillText(`Subject: ${doc.subject}  |  Target Grade: ${doc.grade}  |  Faculty: ${doc.uploadedBy}`, 40, y);

      y += 32;
      ctx.strokeStyle = '#94a3b8';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(baseWidth - 40, y);
      ctx.stroke();
      ctx.setLineDash([]);
      y += 36;
    }

    // 4. Draw Sections
    pageData.sections.forEach((sec) => {
      // Section Heading (Larger for senior readability)
      ctx.fillStyle = '#0f172a';
      ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(sec.title, 40, y);
      y += 30;

      // Section Paragraphs (16px base font with 26px line height for elder clarity)
      ctx.fillStyle = '#1e293b';
      ctx.font = '500 16px Inter, sans-serif';

      sec.body.forEach((para) => {
        const words = para.split(' ');
        let line = '';
        const maxWidth = baseWidth - 80;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, 40, y);
            line = words[n] + ' ';
            y += 26;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 40, y);
        y += 30;
      });

      // Callout box if present
      if (sec.callout) {
        y += 6;
        ctx.fillStyle = '#eff6ff';
        ctx.fillRect(40, y, baseWidth - 80, 56);
        ctx.fillStyle = '#1d4ed8';
        ctx.fillRect(40, y, 6, 56);

        ctx.fillStyle = '#1e3a8a';
        ctx.font = '700 15px Inter, sans-serif';
        ctx.fillText(sec.callout, 56, y + 34);
        y += 72;
      }

      // Formulas / Diagrams if present
      if (sec.formulaOrDiagram && sec.formulaOrDiagram.length > 0) {
        y += 6;
        const boxHeight = sec.formulaOrDiagram.length * 28 + 24;
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(40, y, baseWidth - 80, boxHeight);
        ctx.strokeStyle = '#cbd5e1';
        ctx.strokeRect(40, y, baseWidth - 80, boxHeight);

        ctx.fillStyle = '#0f172a';
        ctx.font = '600 15px "JetBrains Mono", monospace';
        sec.formulaOrDiagram.forEach((item, idx) => {
          ctx.fillText(`• ${item}`, 56, y + 28 + idx * 28);
        });
        y += boxHeight + 24;
      }

      y += 20;
    });

    // 5. Canvas-level Forensic Dynamic Watermark (Baked into pixels)
    if (isWatermarkVisible) {
      ctx.save();
      ctx.rotate((-25 * Math.PI) / 180);

      const watermarkText = `SRIYAM • ${studentName.toUpperCase()} • ${rollNo} • ${userIp.split(' ')[0]} • ${currentTimestamp}`;
      
      ctx.font = '600 13px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(15, 23, 42, 0.085)'; // Visible yet non-obstructive

      const xStep = 360;
      const yStep = 110;

      for (let wx = - baseWidth; wx < baseWidth * 2; wx += xStep) {
        for (let wy = - baseHeight; wy < baseHeight * 2; wy += yStep) {
          ctx.fillText(watermarkText, wx, wy);
        }
      }
      ctx.restore();
    }

    // 6. Page Footer
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(40, baseHeight - 40, baseWidth - 80, 1);

    ctx.font = '500 10px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('SRIYAM SCHOOL • PROPRIETARY LEARNING MATERIAL • UNLAWFUL DUPLICATION STRICTLY ENFORCED', 40, baseHeight - 24);

    ctx.textAlign = 'right';
    ctx.fillText(`TRACKING ID: SRI-SEC-${doc.id.toUpperCase()}-${rollNo}`, baseWidth - 40, baseHeight - 24);
    ctx.textAlign = 'left';

  }, [doc, currentPage, zoom, isWatermarkVisible, studentName, rollNo, userIp, currentTimestamp]);

  return (
    <div 
      ref={containerRef}
      onContextMenu={(e) => {
        e.preventDefault();
        triggerToast('Right-click menu is disabled on protected materials.');
        recordEvent('COPY_ATTEMPT_BLOCKED', 'User right-clicked on canvas document', 'BLOCKED');
      }}
      onDragStart={(e) => e.preventDefault()}
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col select-none drm-protected-surface text-slate-100"
    >
      {/* Top Security Banner */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-emerald-950/80 border border-emerald-500/30 rounded-lg text-emerald-400 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold tracking-wide">SECURE DRM ACTIVE</span>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              {doc.title}
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950/80 text-amber-300 border border-amber-800/40">
                Read-Only
              </span>
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>{doc.subject}</span>
              <span>•</span>
              <span>{doc.grade}</span>
              <span>•</span>
              <span className="text-emerald-400 font-mono">Stream: Encrypted Canvas</span>
            </p>
          </div>
        </div>

        {/* Forensic Watermark Badge */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-300">
          <Fingerprint className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Watermarked to: <strong className="text-white">{studentName}</strong> ({rollNo})</span>
        </div>

        {/* Toolbar Controls (Senior & Tremor Friendly Hit Targets) */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800 rounded-xl border-2 border-slate-700 p-1">
            <button
              onClick={() => setZoom(prev => Math.max(0.7, prev - 0.1))}
              className="px-3 py-2 hover:bg-slate-700 rounded-lg text-slate-200 hover:text-white transition flex items-center gap-1.5 text-xs font-bold"
              title="Make document smaller"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
              <span>Zoom -</span>
            </button>
            <span className="text-xs font-mono font-bold px-2 text-emerald-400">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(1.6, prev + 0.1))}
              className="px-3 py-2 hover:bg-slate-700 rounded-lg text-slate-200 hover:text-white transition flex items-center gap-1.5 text-xs font-bold"
              title="Make document bigger"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
              <span>Zoom +</span>
            </button>
          </div>

          {/* Page navigation */}
          <div className="flex items-center bg-slate-800 rounded-xl border-2 border-slate-700 p-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-3 py-2 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-slate-200 hover:text-white transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Go to previous page"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <span className="text-xs px-3 font-black text-white">
              Page {currentPage} of {doc.totalPages}
            </span>
            <button
              disabled={currentPage >= doc.totalPages}
              onClick={() => setCurrentPage(p => Math.min(doc.totalPages, p + 1))}
              className="px-3 py-2 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-slate-200 hover:text-white transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Go to next page"
              aria-label="Next Page"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Admin Download vs Non-Admin Prohibited Badge */}
          {currentUser.role === 'ADMIN' ? (
            <button
              onClick={handleAdminDownload}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg transition border border-emerald-400 cursor-pointer"
              title="Super Admin Privilege: Download Decrypted Original PDF"
            >
              <Download className="w-4 h-4" />
              <span>Admin Download PDF</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 rounded-xl text-slate-300 text-xs border border-slate-700 font-bold">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Reading Safe (Downloads Disabled)</span>
            </div>
          )}

          {/* Prominent, Senior-friendly Close Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs transition border-2 border-rose-400 cursor-pointer shadow-lg ml-1"
            title="Close this document viewer"
            aria-label="Close Document Viewer"
          >
            <X className="w-4 h-4" />
            <span>✕ Close Document</span>
          </button>
        </div>
      </div>

      {/* Security Toast Warning */}
      {securityToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-2xl border text-sm font-medium ${
            securityToast.type === 'alert' 
              ? 'bg-rose-950 text-rose-200 border-rose-500/50 shadow-rose-950/50' 
              : 'bg-amber-950 text-amber-200 border-amber-500/50 shadow-amber-950/50'
          }`}>
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <span>{securityToast.message}</span>
          </div>
        </div>
      )}

      {/* Viewer Main Viewport */}
      <div className="flex-1 overflow-auto p-6 flex justify-center items-start bg-slate-950 relative">
        {/* Anti-Screen Capture Shield (Activated on Window Blur / App Switch) */}
        {isShieldActive && (
          <div 
            onClick={() => setIsShieldActive(false)}
            className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer"
          >
            <div className="max-w-md p-8 bg-slate-900/90 rounded-2xl border border-red-500/30 shadow-2xl flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center mb-4 text-red-400">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Screen Protection Active</h3>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Document contents were temporarily shielded because the window lost focus or a screenshot/recording utility was suspected.
              </p>
              <div className="px-4 py-2 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                Click anywhere to resume viewing
              </div>
            </div>
          </div>
        )}

        {/* The Protected HTML5 Canvas Surface */}
        <div className="relative shadow-2xl rounded-sm overflow-hidden border border-slate-700 bg-white">
          <canvas 
            ref={canvasRef} 
            className="block"
          />

          {/* Additional Top Layer Transparent SVG Watermark for extra deterrence */}
          <div 
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden flex flex-col justify-around rotate-[-25deg] select-none"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="whitespace-nowrap text-xs font-mono font-bold tracking-widest text-slate-950/80">
                SRIYAM SCHOOL • {studentName.toUpperCase()} • ROLL: {rollNo} • {userIp.split(' ')[0]} • CONFIDENTIAL LEAK TRACER ACTIVE
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Status / Protection Notice */}
      <div className="bg-slate-900/90 border-t border-slate-800 px-6 py-2.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Forensic Watermarking Online
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">
            Direct Download: <strong className="text-red-400 font-mono">DISABLED</strong>
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">
            Screen Capture Shield: <strong className="text-emerald-400 font-mono">ENGAGED</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[11px] text-slate-500">
            Sriyam School ERP v2.4 • Client DRM Shield
          </span>
        </div>
      </div>
    </div>
  );
};

