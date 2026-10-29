export type Category = { id: number; name: string };
export type Book = {
  id: number;
  categoryId: number;
  categoryName: string;
  title: string;
  author: string;
  description: string;
  recommendation: string;
  createdAt: string;
};
export type NewBook = Pick<Book, 'categoryId' | 'title' | 'author' | 'description' | 'recommendation'>;
export type FieldErrors = Partial<Record<keyof NewBook, string>>;

export class ApiError extends Error {
  constructor(message: string, public status: number, public fieldErrors: FieldErrors = {}) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      cache: 'no-store',
      signal: AbortSignal.timeout(60000),
      headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
    });
  } catch {
    throw new ApiError('연결이 원활하지 않아요. 잠시 후 다시 시도해 주세요.', 0);
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const fallback = response.status === 404 ? '이 책을 찾을 수 없어요.' : '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.';
    throw new ApiError(typeof payload?.message === 'string' ? payload.message : fallback, response.status, payload?.fieldErrors || {});
  }
  if (payload === null) throw new ApiError('내용을 불러오지 못했어요. 다시 시도해 주세요.', response.status);
  return payload as T;
}

export const getBooks = () => request<Book[]>('/books');
export const getBook = (id: string) => request<Book>(`/books/${encodeURIComponent(id)}`);
export const getCategories = () => request<Category[]>('/categories');
export const createBook = (book: NewBook) => request<Book>('/books', { method: 'POST', body: JSON.stringify(book) });
