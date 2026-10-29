import type { Metadata } from 'next';
import Link from 'next/link';
import { BookIcon, PlusIcon } from '@/components/icons';
import './globals.css';

export const metadata: Metadata = {
  title: { default: '모임책장 · 함께 읽는 책', template: '%s · 모임책장' },
  description: '우리 독서모임의 추천 도서와 함께 읽고 싶은 이유를 한곳에 모읍니다.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <a className="skip-link" href="#main">본문으로 건너뛰기</a>
        <header className="site-header">
          <div className="header-inner">
            <Link href="/" className="brand" aria-label="모임책장, 책 목록으로">
              <span className="brand-symbol"><BookIcon /></span>
              <span className="brand-name">모임책장<span className="brand-description">우리 독서모임이 함께 읽는 책</span></span>
            </Link>
            <nav aria-label="주 메뉴">
              <Link className="header-library" href="/">우리의 책</Link>
              <Link className="button button-primary header-add" href="/books/new"><PlusIcon />책 등록</Link>
            </nav>
          </div>
        </header>
        <main id="main" className="main-shell">{children}</main>
        <footer className="site-footer">
          <span>모임책장</span>
          <p>이 책장은 가상 도서를 사용하는 실습 공간입니다.</p>
        </footer>
      </body>
    </html>
  );
}
