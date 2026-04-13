import { LayoutTemplate } from "lucide-react";
import { useTemplates } from "../../features/template/hooks/useTemplates";
import TemplateCard from "./TemplateCard";
import LoadingSpinner from "../../shared/ui/LoadingSpinner";

export default function TemplateGrid() {
  const { templates, loading, error } = useTemplates();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-2">
        <LayoutTemplate className="w-10 h-10 text-gray-300" />
        <p className="text-gray-400 text-sm">{error}</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
        <LayoutTemplate className="w-12 h-12 text-gray-300" />
        <p className="text-gray-500 font-medium">No templates available</p>
        <p className="text-gray-400 text-sm max-w-xs">
          Templates will appear here once they are created by an administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
