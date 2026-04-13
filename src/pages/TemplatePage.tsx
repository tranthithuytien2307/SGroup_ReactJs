import HeaderContent from "../shared/ui/ContentHeader";
import TemplateGrid from "../widgets/template/TemplateGrid";

export default function TemplatePage() {
  return (
    <div className="flex-1">
      <div className="flex flex-col h-screen">
        <HeaderContent headerContent="Templates" />
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Choose a Template
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Get started quickly by creating a board from one of our pre-built
              templates.
            </p>
          </div>
          <TemplateGrid />
        </div>
      </div>
    </div>
  );
}
