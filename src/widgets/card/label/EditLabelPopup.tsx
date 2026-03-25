import LabelForm from "./LabelForm";
import PopupLayout from "./PopupLayout";

type EditLabelPopupProps = {
  onBack: () => void;
  onClose: () => void;
  titleLabel: string;
  setTitleLabel: (title: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  onUpdateLabel: () => void;
  onDeleteLabel: () => void;
};

export default function EditLabelPopup({
  onBack,
  onClose,
  titleLabel,
  setTitleLabel,
  selectedColor,
  setSelectedColor,
  onUpdateLabel,
  onDeleteLabel,
}: EditLabelPopupProps) {
  return (
    <PopupLayout
      title="Chỉnh sửa nhãn"
      onBack={onBack}
      onClose={onClose}
      footer={
        <div className="space-y-2">
          {/* Save */}
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm"
            onClick={onUpdateLabel}
          >
            Lưu
          </button>

          {/* Delete */}
          <button
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm"
            onClick={onDeleteLabel}
          >
            Xóa
          </button>
        </div>
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
