import { useState } from "react";
import { Kanban, Copy } from "lucide-react";
import { Button } from "../../shared/ui/button";
import CreateFromTemplateModal from "../../shared/ui/modal/CreateFromTemplateModal";
import type { Template } from "../../entities/template/model/templateType";

type TemplateCardProps = {
  template: Template;
};

// Predefined gradient backgrounds for templates without a cover
const GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-700",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600",
];

export default function TemplateCard({ template }: TemplateCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const gradient = GRADIENTS[template.id % GRADIENTS.length];
  const listCount = template.lists?.length ?? 0;

  return (
    <>
      <div className="group relative flex flex-col rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
        {/* Cover / Header area */}
        <div
          className={`relative h-28 flex items-center justify-center bg-gradient-to-br ${gradient}`}
          style={
            template.cover_url
              ? {
                  backgroundImage: `url(${template.cover_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          {!template.cover_url && (
            <Kanban className="w-10 h-10 text-white/70" />
          )}

          {/* Use Template button — appears on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Button
              className="text-sm bg-white text-gray-900 hover:bg-gray-100 font-medium px-4 h-9 rounded-md shadow cursor-pointer"
              onClick={() => setModalOpen(true)}
            >
              <Copy className="w-4 h-4 mr-1.5" />
              Use Template
            </Button>
          </div>
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 p-4 gap-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
            {template.name}
          </h3>

          {template.description && (
            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 min-h-[32px]">
              {template.description}
            </p>
          )}

          <div className="flex items-center gap-1 mt-auto pt-2 text-xs text-gray-400">
            <Kanban className="w-3.5 h-3.5" />
            <span>{listCount === 1 ? `${listCount} list` : `${listCount} lists`}</span>
          </div>
        </div>
      </div>

      <CreateFromTemplateModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        template={template}
      />
    </>
  );
}
