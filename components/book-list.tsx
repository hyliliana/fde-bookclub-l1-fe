'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { getBooks, type Book } from '@/lib/api';
import { BookCover } from './book-cover';
import { ArrowIcon, BookIcon, PlusIcon } from './icons';
import { ErrorState, LoadingState } from './states';

export function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getBooks().then((data) => { if (active) setBooks(data); }).catch((err: Error) => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  return <>
    <section className="page-heading library-heading">
      <div><p className="eyebrow">우리의 책</p><h1>책으로 이어지는<br className="mobile-break" /> 우리 이야기</h1><p className="page-intro">함께 읽고 싶은 책, 나누고 싶은 생각을 모았어요.</p></div>
      <span className="intro-note">한 권의 책에서<br/>시작되는 대화.</span>
    </section>
    <section aria-labelledby="books-heading">
      <div className="section-bar"><h2 id="books-heading">함께 읽는 책 {!loading && !error && <span className="book-count">{books.length}</span>}</h2><span className="demo-label">실습용 도서</span></div>
      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={retry} /> : books.length === 0 ? <div className="state-panel"><span className="state-symbol"><BookIcon /></span><h2>첫 번째 책을 기다리고 있어요</h2><p>우리 모임과 함께 읽고 싶은 책을 등록해 보세요.</p><Link className="button button-primary" href="/books/new"><PlusIcon />첫 책 등록하기</Link></div> : <ul className="book-grid">{books.map((book) => <li key={book.id}>
        <Link className="book-card" href={`/books/${book.id}`} aria-label={`${book.title}, ${book.author} 지음. 자세히 보기`}>
          <BookCover book={book} />
          <div className="book-card-body"><span className="category-label">{book.categoryName}</span><h3>{book.title}</h3><p className="book-author">{book.author} 지음</p><p className="book-recommendation">{book.recommendation}</p><span className="card-link">책 이야기 읽기 <ArrowIcon /></span></div>
        </Link>
      </li>)}</ul>}
    </section>
  </>;
}
