import type { Metadata } from 'next';
import { BookDetail } from '@/components/book-detail';

export const metadata: Metadata = { title: '책 이야기' };

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookDetail id={id} />;
}
