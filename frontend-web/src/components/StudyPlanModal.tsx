"use client";
import React from "react";
import { createPortal } from "react-dom";
import { X, Printer, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslation } from "react-i18next";

interface StudyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  markdownContent: string | null;
  studentName?: string;
}

export function StudyPlanModal({
  isOpen,
  onClose,
  isLoading,
  markdownContent,
  studentName = "Siswa",
}: StudyPlanModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Rencana_Belajar_${studentName.replace(/\s+/g, '_')}`;
    window.print();
    // Revert back the title after a short delay to ensure print dialog catches it
    setTimeout(() => {
      document.title = originalTitle;
    }, 500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 study-plan-modal-portal">
      {/* Backdrop (hidden when printing) */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm print:hidden transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] print:max-h-none print:w-full print:max-w-none print:shadow-none print:bg-white print:text-black">
        
        {/* Header (hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10 print:hidden">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t("studyPlan.title", "AI Study Plan Generator 🤖")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("studyPlan.subtitle", { studentName, defaultValue: `Rencana Belajar 4 Minggu untuk ${studentName}` })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isLoading && markdownContent && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
              >
                <Printer className="w-4 h-4" />
                <span>{t("studyPlan.print", "Cetak")}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors dark:bg-white/5 dark:text-gray-400 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 print:p-0 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse text-center max-w-xs">
                {t("studyPlan.loading", "AI sedang menganalisis riwayat nilai dan menyusun rencana belajar yang optimal...")}
              </p>
            </div>
          ) : markdownContent ? (
            <div className="prose prose-blue dark:prose-invert max-w-none print:prose-p:text-black print:prose-headings:text-black print:prose-table:text-black">
              {/* Added standard styling for tables in markdown */}
              <style dangerouslySetInnerHTML={{ __html: `
                .prose table {
                  width: 100%;
                  max-width: 100%;
                  border-collapse: collapse;
                  margin-top: 1rem;
                  margin-bottom: 1rem;
                  table-layout: auto;
                }
                .prose th {
                  background-color: #f3f4f6;
                  border: 1px solid #e5e7eb;
                  padding: 0.75rem;
                  text-align: left;
                  word-break: break-word;
                }
                .dark .prose th {
                  background-color: #27272a;
                  border-color: #3f3f46;
                }
                .prose td {
                  border: 1px solid #e5e7eb;
                  padding: 0.75rem;
                  word-break: break-word;
                  overflow-wrap: break-word;
                  white-space: normal;
                }
                .dark .prose td {
                  border-color: #3f3f46;
                }
                @media print {
                  body > *:not(.study-plan-modal-portal) {
                    display: none !important;
                  }
                  .study-plan-modal-portal {
                    position: static !important;
                    display: block !important;
                    padding: 0 !important;
                  }
                  .prose th {
                    background-color: #f3f4f6 !important;
                    -webkit-print-color-adjust: exact;
                  }
                  .prose table {
                    table-layout: fixed;
                  }
                  @page {
                    margin: 1.5cm;
                  }
                }
              `}} />
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-2 text-gray-500 dark:text-gray-400">
              <p>{t("studyPlan.empty", "Tidak ada rencana belajar yang tersedia.")}</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
