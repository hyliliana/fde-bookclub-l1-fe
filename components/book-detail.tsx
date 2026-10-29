'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ApiError, getBook, type Book } from '@/lib/api';
import { ArrowIcon, CheckIcon } from './icons';
import { BookCover } from './book-cover';
import { ErrorState, LoadingState } from './states';

export function BookDetail({ id }: { id: string }) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [missing, setMissing] = useState(false);
  const [created, setCreated] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setCreated(new URLSearchParams(window.location.search).get('created') === '1');
    setLoading(true); setError(''); setMissing(false);
    getBook(id).then((data) => { if (active) setBook(data); }).catch((err: Error) => {
      if (!active) return;
      setError(err.message); setMissing(err instanceof ApiError && (err.status === 404 || err.status === 400));
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, attempt]);

  return <div className="detail-page">
    <Link className="back-link" href="/"><ArrowIcon back />책 목록으로</Link>
    {loading ? <LoadingState message="책 이야기를 불러오고 있어요" /> : missing ? <section className="state-panel"><h1>이 책을 찾을 수 없어요</h1><p>책 목록에서 다른 책을 살펴보세요.</p><Link className="button button-primary" href="/">책 목록으로</Link></section> : error ? <ErrorState message={error} onRetry={() => setAttempt((value) => value + 1)} /> : book && <>
      {created && <div className="success-notice" role="status"><CheckIcon /><span>책장에 새 책을 등록했어요. 함께 읽을 이야기가 하나 더 생겼네요.</span></div>}
      <article className="book-detail">
        <div className="detail-cover-column"><BookCover book={book} large /><span className="cover-caption">실습을 위해 만든 가상 도서입니다.</span></div>
        <div className="detail-content">
          <span className="category-label">{book.categoryName}</span><h1>{book.title}</h1><p className="detail-author">{book.author} 지음</p>
          <section className="recommendation-box" aria-labelledby="recommendation-heading"><h2 id="recommendation-heading">함께 읽고 싶은 이유</h2><p>{book.recommendation}</p></section>
          <section className="description-section" aria-labelledby="description-heading"><h2 id="description-heading">이 책은요</h2><p>{book.description?.trim() || '아직 책 소개가 등록되지 않았어요. 추천 이유를 읽고 함께 이야기를 시작해 보세요.'}</p></section>
          <div className="detail-bottom"><span>우리의 책장에서</span><Link href="/" className="text-link">다른 책도 살펴보기 <ArrowIcon /></Link></div>
        </div>
      </article>
    </>}
  </div>;
}
