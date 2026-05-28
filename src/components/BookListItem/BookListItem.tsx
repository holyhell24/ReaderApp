import type { BookListItemProps } from "./types";

export default function BookListItem({
  book,
  isActive,
  onSelect,
}: BookListItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={`w-full rounded-lg border px-4 py-3 text-left transition-colors cursor-pointer ${
          isActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:bg-gray-50"
        }`}
      >
        <p className="font-medium text-gray-900">{book.title}</p>
        {book.author && (
          <p className="text-sm text-gray-600">
            <span className="text-gray-500">Author: {book.author}</span>
          </p>
        )}
        {book.description && (
          <p className="mt-1 line-clamp-4 text-sm text-gray-600">
            {book.description}
          </p>
        )}
      </button>
    </li>
  );
}
