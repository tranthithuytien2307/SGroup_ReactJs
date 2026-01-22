type CardItemProps = {
  title: string;
  description?: string;
  avatars?: string[];
  onClick?: () => void;
};

export default function CardItem({
  title,
  description,
  avatars = [],
  onClick,
}: CardItemProps) {
  return (
    <div
      onClick={onClick}
      className="
        cursor-pointer
        bg-white rounded-xl p-4
        shadow-md border border-gray-100
        hover:shadow-lg transition mt-3
      "
    >
      <p className="font-medium">{title}</p>

      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}

      {avatars.length > 0 && (
        <div className="flex mt-4">
          {avatars.map((src, index) => (
            <img
              key={index}
              src={src}
              className={`w-7 h-7 rounded-full border-2 border-white -ml-2 ${
                index === 0 ? "ml-0" : ""
              }`}
              alt="avatar"
            />
          ))}
        </div>
      )}
    </div>
  );
}
