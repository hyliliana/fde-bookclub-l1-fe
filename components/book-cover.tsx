import type { Book } from '@/lib/api';

export function BookCover({ book, large = false }: { book: Book; large?: boolean }) {
  const palette = ((Number(book.id) || 1) - 1) % 6;
  return (
    <div className={`cover-stage${large ? ' cover-stage-large' : ''}`} aria-hidden="true">
      <div className={`book-cover cover-color-${palette}`}>
        <span className="cover-category">{book.categoryName}</span>
        <span className="cover-title">{book.title}</span>
        <span className="cover-rule" />
        <span className="cover-author">{book.author}</span>
        <span className="cover-mark">MOIM BOOKS</span>
      </div>
    </div>
  );
}
