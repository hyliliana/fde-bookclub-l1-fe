'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { ApiError, createBook, getCategories, type Category, type FieldErrors, type NewBook } from '@/lib/api';
import { ArrowIcon, BookIcon, PlusIcon } from './icons';

type FormValues = { categoryId: string; title: string; author: string; description: string; recommendation: string };
const emptyForm: FormValues = { categoryId: '', title: '', author: '', description: '', recommendation: '' };

export function BookForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState('');
  const [categoryAttempt, setCategoryAttempt] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    setCategoryLoading(true); setCategoryError('');
    getCategories().then((data) => { if (active) { setCategories(data); if (!data.length) setCategoryError('등록할 수 있는 분야가 아직 없어요. 잠시 후 다시 확인해 주세요.'); } }).catch((err: Error) => { if (active) setCategoryError(err.message); }).finally(() => { if (active) setCategoryLoading(false); });
    return () => { active = false; };
  }, [categoryAttempt]);

  function update(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || categoryLoading || categoryError) return;
    const payload: NewBook = { categoryId: Number(values.categoryId), title: values.title.trim(), author: values.author.trim(), description: values.description.trim(), recommendation: values.recommendation.trim() };
    const nextErrors: FieldErrors = {};
    if (!payload.title) nextErrors.title = '책 제목을 입력해 주세요.';
    else if (payload.title.length > 120) nextErrors.title = '책 제목은 120자 이내로 입력해 주세요.';
    if (!payload.author) nextErrors.author = '저자를 입력해 주세요.';
    else if (payload.author.length > 120) nextErrors.author = '저자는 120자 이내로 입력해 주세요.';
    if (!categories.some((category) => category.id === payload.categoryId)) nextErrors.categoryId = '책의 분야를 선택해 주세요.';
    if (!payload.recommendation) nextErrors.recommendation = '함께 읽고 싶은 이유를 입력해 주세요.';
    else if (payload.recommendation.length > 500) nextErrors.recommendation = '추천 이유는 500자 이내로 입력해 주세요.';
    if (payload.description.length > 2000) nextErrors.description = '책 소개는 2,000자 이내로 입력해 주세요.';
    setErrors(nextErrors); setFormError('');
    if (Object.keys(nextErrors).length) {
      setFormError('입력한 내용을 한 번 더 확인해 주세요.');
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }
    setPending(true);
    try {
      const saved = await createBook(payload);
      router.push(`/books/${saved.id}?created=1`);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fieldErrors);
        setFormError(err.message);
        document.getElementById(Object.keys(err.fieldErrors)[0] || 'form-error')?.focus();
      } else setFormError('책을 등록하지 못했어요. 입력한 내용은 그대로 있으니 다시 시도해 주세요.');
      setPending(false);
    }
  }

  const fieldError = (name: keyof FormValues) => errors[name] ? <p className="field-error" id={`${name}-error`}>{errors[name]}</p> : null;

  return <div className="form-page">
    <Link className="back-link" href="/"><ArrowIcon back />책 목록으로</Link>
    <div className="form-layout">
      <aside className="form-intro"><span className="eyebrow">책장에 한 권 더</span><h1>어떤 책을<br/> 함께 읽을까요?</h1><p>책의 정보와 추천하는 이유를 남겨 주세요.<br className="desktop-break"/>다음 대화를 시작할 좋은 계기가 될 거예요.</p><div className="form-note"><BookIcon /><p>가상 도서를 자유롭게 등록해 보세요.<br/>실제 개인정보는 적지 않아도 됩니다.</p></div></aside>
      <form className="book-form" onSubmit={submit} noValidate aria-busy={pending}>
        <div className="form-section-heading"><h2>책 정보</h2><span><b aria-hidden="true">*</b> 필수 입력</span></div>
        {formError && <div id="form-error" className="form-error" role="alert" tabIndex={-1}>{formError}</div>}
        <div className="field"><label htmlFor="title">책 제목 <b aria-hidden="true">*</b></label><input id="title" name="title" value={values.title} onChange={(e) => update('title', e.target.value)} placeholder="함께 읽을 책의 제목" maxLength={120} required aria-invalid={!!errors.title} aria-describedby={errors.title ? 'title-error' : undefined} disabled={pending}/>{fieldError('title')}</div>
        <div className="form-row">
          <div className="field"><label htmlFor="author">저자 <b aria-hidden="true">*</b></label><input id="author" name="author" value={values.author} onChange={(e) => update('author', e.target.value)} placeholder="지은이 이름" maxLength={120} required aria-invalid={!!errors.author} aria-describedby={errors.author ? 'author-error' : undefined} disabled={pending}/>{fieldError('author')}</div>
          <div className="field"><label htmlFor="categoryId">분야 <b aria-hidden="true">*</b></label><select id="categoryId" name="categoryId" value={values.categoryId} onChange={(e) => update('categoryId', e.target.value)} required aria-invalid={!!errors.categoryId} aria-describedby={errors.categoryId ? 'categoryId-error' : undefined} disabled={pending || categoryLoading || !!categoryError}><option value="">{categoryLoading ? '분야를 불러오는 중…' : '분야 선택'}</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>{fieldError('categoryId')}</div>
        </div>
        {categoryError && <div className="category-error" role="alert"><p>{categoryError}</p><button type="button" className="text-link" onClick={() => setCategoryAttempt((value) => value + 1)}>분야 다시 불러오기 <ArrowIcon /></button></div>}
        <div className="field"><label htmlFor="description">책 소개 <span className="optional">선택</span></label><textarea id="description" name="description" value={values.description} onChange={(e) => update('description', e.target.value)} placeholder="어떤 이야기를 담고 있는 책인가요?" rows={4} maxLength={2000} aria-invalid={!!errors.description} aria-describedby={errors.description ? 'description-error' : 'description-hint'} disabled={pending}/><div className="field-meta"><span id="description-hint">책의 내용을 짧게 소개해 주세요.</span><span>{values.description.length.toLocaleString()} / 2,000</span></div>{fieldError('description')}</div>
        <div className="field"><label htmlFor="recommendation">함께 읽고 싶은 이유 <b aria-hidden="true">*</b></label><textarea id="recommendation" name="recommendation" value={values.recommendation} onChange={(e) => update('recommendation', e.target.value)} placeholder="우리 모임에 이 책을 추천하는 이유는 무엇인가요?" rows={4} maxLength={500} required aria-invalid={!!errors.recommendation} aria-describedby={errors.recommendation ? 'recommendation-error' : 'recommendation-hint'} disabled={pending}/><div className="field-meta"><span id="recommendation-hint">나누고 싶은 질문이나 생각도 좋아요.</span><span>{values.recommendation.length} / 500</span></div>{fieldError('recommendation')}</div>
        <div className="form-actions"><Link className="button button-quiet" href="/" aria-disabled={pending} onClick={(event) => { if (pending) event.preventDefault(); }}>취소</Link><button className="button button-primary" type="submit" disabled={pending || categoryLoading || !!categoryError}>{pending ? <><span className="spinner small"/>등록하는 중…</> : <><PlusIcon />책장에 등록하기</>}</button></div>
      </form>
    </div>
  </div>;
}
