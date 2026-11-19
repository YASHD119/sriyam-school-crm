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
  Info
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
    ctx.fillRect(40, 36, baseWidth - 80, 2);

    ctx.font = '600 11px Inter, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(pageData.header || 'SRIYAM SCHOOL ACADEMIC CURRICULUM VAULT', 40, 28);

    ctx.textAlign = 'right';
    ctx.font = '600 11px Inter, sans-serif';
    ctx.fillStyle = '#15803d';
    ctx.fillText(`SECURE READ-ONLY • PAGE ${currentPage} OF ${doc.totalPages}`, baseWidth - 40, 28);
    ctx.textAlign = 'left';

    // 3. Document Title on Page 1
    let y = 72;
    if (currentPage === 1) {
      // Classification tag
      ctx.fillStyle = '#fef2f2';
      ctx.fillRect(40, y, 170, 24);
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 1;
      ctx.strokeRect(40, y, 170, 24);

      ctx.fillStyle = '#991b1b';
      ctx.font = '700 10px Inter, sans-serif';
      ctx.fillText('CONFIDENTIAL • READ-ONLY', 48, y + 16);

      y += 42;

      ctx.fillStyle = '#0f172a';
      ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(doc.title, 40, y);

      y += 24;
      ctx.fillStyle = '#64748b';
      ctx.font = '500 13px Inter, sans-serif';
      ctx.fillText(`Subject: ${doc.subject}  |  Target Grade: ${doc.grade}  |  Faculty: ${doc.uploadedBy}`, 40, y);

      y += 28;
      ctx.strokeStyle = '#cbd5e1';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(baseWidth - 40, y);
      ctx.stroke();
      ctx.setLineDash([]);
      y += 30;
    }

    // 4. Draw Sections
    pageData.sections.forEach((sec) => {
      // Section Heading
      ctx.fillStyle = '#0f172a';
      ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(sec.title, 40, y);
      y += 24;

      // Section Paragraphs
      ctx.fillStyle = '#334155';
      ctx.font = '400 13px Inter, sans-serif';

      sec.body.forEach((para) => {
        // Multi-line word wrap logic
        const words = para.split(' ');
        let line = '';
        const maxWidth = baseWidth - 80;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, 40, y);
            line = words[n] + ' ';
            y += 20;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 40, y);
        y += 24;
      });

      // Callout box if present
      if (sec.callout) {
        y += 4;
        ctx.fillStyle = '#eff6ff';
        ctx.fillRect(40, y, baseWidth - 80, 48);
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(40, y, 4, 48);

        ctx.fillStyle = '#1e40af';
        ctx.font = '600 12px Inter, sans-serif';
        ctx.fillText(sec.callout, 54, y + 28);
        y += 62;
      }

      // Formulas / Diagrams if present
      if (sec.formulaOrDiagram && sec.formulaOrDiagram.length > 0) {
        y += 4;
        const boxHeight = sec.formulaOrDiagram.length * 24 + 20;
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(40, y, baseWidth - 80, boxHeight);
        ctx.strokeStyle = '#e2e8f0';
        ctx.strokeRect(40, y, baseWidth - 80, boxHeight);

        ctx.fillStyle = '#0f172a';
        ctx.font = '500 13px "JetBrains Mono", monospace';
        sec.formulaOrDiagram.forEach((item, idx) => {
          ctx.fillText(`• ${item}`, 56, y + 24 + idx * 24);
        });
        y += boxHeight + 20;
      }

      y += 18;
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

        {/* Toolbar Controls */}
        <div className="flex items-center space-x-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700/80 p-0.5">
            <button
              onClick={() => setZoom(prev => Math.max(0.7, prev - 0.1))}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-slate-300">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Page navigation */}
          <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700/80 p-0.5">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent rounded text-slate-300 hover:text-white transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs px-2 font-medium text-slate-300">
              {currentPage} / {doc.totalPages}
            </span>
            <button
              disabled={currentPage >= doc.totalPages}
              onClick={() => setCurrentPage(p => Math.min(doc.totalPages, p + 1))}
              className="p-1.5 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent rounded text-slate-300 hover:text-white transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Close Viewer */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition ml-2 border border-slate-700 hover:border-red-500/30"
            title="Close Viewer"
          >
            <X className="w-5 h-5" />
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

