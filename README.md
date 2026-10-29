# 모임책장 — Level 1 프론트엔드

추천 도서를 모아 보고 새 책을 등록하는 Next.js 웹앱입니다. 실제 데이터는 별도 NestJS 백엔드의 PostgreSQL에 저장합니다. 화면에서 샘플 데이터로 대체하지 않습니다.

## 실행

Node.js 20.9 이상과 pnpm이 필요합니다.

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

http://localhost:3000 에 접속합니다. 백엔드는 기본적으로 http://localhost:4000 에서 실행해야 합니다.

## 환경 변수

| 이름 | 값 |
|---|---|
| NEXT_PUBLIC_API_URL | 실제 NestJS 백엔드 주소. 끝에 `/`를 붙이지 않습니다. |

이 값은 공개되는 서버 주소입니다. DB 비밀번호나 DB 연결 주소를 이 프로젝트에 넣으면 안 됩니다. `NEXT_PUBLIC_` 변수는 빌드 시 포함되므로 변경한 뒤 다시 배포해야 합니다.

## 화면

- `/`: 책 목록과 상세 이동
- `/books/[id]`: 소개와 추천 이유
- `/books/new`: 분야 선택과 새 책 등록

로딩·빈 목록·오류·등록 성공을 구분합니다. 입력값 검사는 화면과 백엔드에서 각각 수행합니다. 서버 오류가 발생해도 입력한 내용은 유지합니다.

## 검사와 운영 실행

```bash
pnpm typecheck
pnpm build
pnpm start
```

## Vercel 배포

1. 이 폴더만 프론트엔드 GitHub 저장소로 올립니다. 기획서.md와 pnpm-lock.yaml도 포함합니다.
2. Vercel에서 해당 저장소를 가져오고 Framework Preset은 Next.js를 사용합니다.
3. `NEXT_PUBLIC_API_URL`에 Render 백엔드의 실제 HTTPS 주소를 설정합니다.
4. 빌드 명령은 `pnpm build`, 설치 명령은 `pnpm install --frozen-lockfile`입니다.
5. 백엔드의 `FRONTEND_URL`에도 실제 Vercel 주소를 등록합니다.
6. 배포된 화면에서 목록·상세·등록·오류 안내를 다시 확인합니다.

이 README는 준비 방법입니다. 계정 연결·실제 배포·실제 DB 연결 여부를 대신 증명하지 않습니다.

## 실습 범위

로그인 없이 가상 도서를 등록하는 학습용 앱입니다. 실제 개인정보는 넣지 않습니다. 도서 표지는 외부 사진 대신 CSS로 표현합니다.
