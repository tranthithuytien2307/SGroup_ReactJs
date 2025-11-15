type Header = {
  headerContent: string;
};

export default function HeaderContent({ headerContent }: Header) {
  return (
    <div className="pl-4 border-b">
      <p className="text-lg font-semibold text-gray-900 p-4">{headerContent}</p>
    </div>
  );
}
