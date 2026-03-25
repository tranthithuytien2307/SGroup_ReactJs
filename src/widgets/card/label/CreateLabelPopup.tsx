import LabelForm from "./LabelForm";
import PopupLayout from "./PopupLayout";

type CreateLabelPopupProps = {
  onBack: () => void;
  onClose: () => void;
  setTitleLabel: (title: string) => void;
  titleLabel: string;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  onCreateLabel: () => void;
};

export default function CreateLabelPopup({
  onBack,
  onClose,
  setTitleLabel,
  titleLabel,
  selectedColor,
  setSelectedColor,
  onCreateLabel,
}: CreateLabelPopupProps) {
  return (
    <PopupLayout
      title="Tạo nhãn mới"
      onBack={onBack}
      onClose={onClose}
      footer={
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm"
          onClick={onCreateLabel}
        >
          Tạo mới
        </button>
      }
    >
      <LabelForm
        title={titleLabel}
        onChangeTitle={setTitleLabel}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
      />
    </PopupLayout>
  );
}
