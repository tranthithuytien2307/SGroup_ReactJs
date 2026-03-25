import { ArrowLeft, X } from "lucide-react";

export default function PopupLayout({
  title,
  onBack,
  onClose,
  children,
  footer,
}: {
  title: string;
  onBack: () => void;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="absolute top-12 left-0 w-[320px] bg-white shadow-xl rounded-lg border z-50 h-[70vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button onClick={onBack}>
          <ArrowLeft size={18} />
        </button>

        <p className="font-medium">{title}</p>

        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">{children}</div>

      {/* Footer */}
      <div className="px-4 pb-4 border-t pt-3">{footer}</div>
    </div>
  );
}
