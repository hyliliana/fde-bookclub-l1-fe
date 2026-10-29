import type { Metadata } from 'next';
import { BookForm } from '@/components/book-form';

export const metadata: Metadata = { title: '새 책 등록' };

export default function NewBookPage() {
  return <BookForm />;
}
