import React from "react";
import { X, ChevronLeft } from "lucide-react";

interface StickerSelectorProps {
  onClose: () => void;
  onBack: () => void;
}

const StickerSelector: React.FC<StickerSelectorProps> = ({
  onClose,
  onBack,
}) => {
  // Sử dụng link từ OpenMoji - Bộ emoji mã nguồn mở cực đẹp và ổn định
  const getEmojiUrl = (hex: string) =>
    `https://openmoji.org/data/color/svg/${hex}.svg`;

  const basicStickers = [
    getEmojiUrl("2705"), // Check
    getEmojiUrl("2764"), // Heart
    getEmojiUrl("26A0"), // Warning
    getEmojiUrl("231B"), // Clock
    getEmojiUrl("1F600"), // Smile
    getEmojiUrl("1F609"), // Wink
    getEmojiUrl("1F615"), // Confused
    getEmojiUrl("1F622"), // Sad
    getEmojiUrl("1F44D"), // Thumbs up
    getEmojiUrl("1F44E"), // Thumbs down
    getEmojiUrl("2B50"), // Star
    getEmojiUrl("1F680"), // Rocket
  ];

  const tacoStickers = [
    getEmojiUrl("1F3AE"), // Gamepad (Thay cho Taco robot)
    getEmojiUrl("1F436"), // Dog face (Thay cho Taco)
    getEmojiUrl("1F60D"), // Heart eyes
    getEmojiUrl("1F60E"), // Cool
    getEmojiUrl("1F621"), // Angry
    getEmojiUrl("1F389"), // Celebrate
    getEmojiUrl("1F4D6"), // Reading
    getEmojiUrl("1F634"), // Sleeping
  ];

  return (
    <div className="fixed top-0 right-0 w-[340px] h-full bg-white shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded text-gray-500 border border-black/10 shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-semibold text-gray-700 text-sm">Các nhãn dán</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {basicStickers.map((url, i) => (
            <div
              key={`basic-${i}`}
              className="aspect-square flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-all hover:scale-110"
            >
              <img
                src={url}
                alt="sticker"
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-800 text-sm px-1">
            Taco & Friends
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {tacoStickers.map((url, i) => (
              <div
                key={`taco-${i}`}
                className="aspect-square flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-all hover:scale-110"
              >
                <img
                  src={url}
                  alt="taco"
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickerSelector;
