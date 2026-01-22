import type { ChangeEvent } from "react";

interface AddItemFormProps {
  value: string;
  placeholder?: string;
  submitLabel?: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  autoFocus?: boolean;
}

const AddItemForm = ({
  value,
  placeholder = "Enter title...",
  submitLabel = "Add",
  onChange,
  onSubmit,
  onCancel,
  autoFocus = true,
}: AddItemFormProps) => {
  return (
    <div className="space-y-2">
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="
          w-full rounded-lg border border-gray-300
          px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-black
        "
      />

      <div className="flex items-center gap-3">
        <button
          onClick={onSubmit}
          className="
            rounded-lg bg-black px-4 py-2
            text-sm font-medium text-white
            hover:bg-gray-800
          "
        >
          {submitLabel}
        </button>

        <button
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddItemForm;
