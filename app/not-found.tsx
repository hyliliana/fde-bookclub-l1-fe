import Link from 'next/link';
import { BookIcon } from '@/components/icons';

export default function NotFound() {
  return <section className="state-panel"><BookIcon /><h1>페이지를 찾을 수 없어요</h1><p>주소를 확인하거나 책 목록에서 다시 찾아 주세요.</p><Link className="button button-primary" href="/">책 목록으로</Link></section>;
}
