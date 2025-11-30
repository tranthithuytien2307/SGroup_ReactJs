type CardItemProps = {
  key: number;
  title: string;
  description?: string;
  avatars?: string[];
};

export default function CardItem({
  title,
  description,
  avatars = [],
}: CardItemProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition mt-4">
      <p>{title}</p>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}

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
    </div>
  );
}
