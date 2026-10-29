# 모임책장 — Level 1 프론트엔드

상태: 공개배포 · **공개 주소 핵심 사용 경로 검증 완료 / 제출 전**

- 웹앱: [https://fde-bookclub-l1-fe.vercel.app](https://fde-bookclub-l1-fe.vercel.app)
- 백엔드: [https://fde-bookclub-l1-be.onrender.com](https://fde-bookclub-l1-be.onrender.com)
- 공개 소스: [hyliliana/fde-bookclub-l1-fe](https://github.com/hyliliana/fde-bookclub-l1-fe)
- 백엔드 소스: [hyliliana/fde-bookclub-l1-be](https://github.com/hyliliana/fde-bookclub-l1-be)

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

이 프론트엔드는 위 공개 GitHub 저장소의 소스를 ZIP으로 묶어 Vercel **Drop to Deploy**에 올려 배포했습니다. Git 연동 배포가 아니므로 GitHub에 push해도 Vercel이 자동으로 갱신되지 않습니다.

배포용 `.env.production`에는 아래 공개 API 주소만 포함했습니다. DB 주소·비밀번호는 넣지 않습니다.

```text
NEXT_PUBLIC_API_URL=https://fde-bookclub-l1-be.onrender.com
```

소스 변경 후 Vercel에서 별도 재배포가 필요하며 실제 주소를 다시 확인해야 합니다. `NEXT_PUBLIC_` 값은 빌드 시 화면 코드에 포함되므로 주소를 바꿀 때도 재배포가 필요합니다. 설치는 `pnpm install --frozen-lockfile`, 빌드는 `pnpm build`를 사용합니다.

Render 백엔드의 `FRONTEND_URL`은 `https://fde-bookclub-l1-fe.vercel.app`로 설정했습니다. 무료 Render 서버가 대기 중이면 첫 요청에 시간이 걸릴 수 있습니다. 두 앱이 공유하는 Singapore 지역 무료 PostgreSQL의 만료 예정일은 **2026년 11월 28일**입니다.

## 현재 검증 상태

- 로컬 프론트엔드 빌드와 타입 검사를 통과했습니다.
- 로컬 화면과 실제 Render DB를 연결해 목록·상세·등록·입력 오류와 모바일 화면을 확인했습니다.
- 공개 배포와 공개 GitHub 저장소 생성·push를 완료했습니다.
- 공식 Playwright MCP로 로그인하지 않은 PC·모바일 환경에서 공개 목록과 상세 화면을 확인했습니다.
- 공개 화면에서 입력 오류 안내와 신규 가상 도서 등록(201) → 상세 표시 → 새 브라우저 세션 재접속 후 데이터 보존을 확인했습니다.
- 현재 상태는 **공개 주소 핵심 사용 경로 검증 완료 / 제출 전**이며 최종 제출은 제출자가 직접 진행합니다.

기능·화면·데이터 요구사항은 [기획서.md](./기획서.md)를 참고하세요.

## 실습 범위

로그인 없이 가상 도서를 등록하는 학습용 앱입니다. 실제 개인정보는 넣지 않습니다. 도서 표지는 외부 사진 대신 CSS로 표현합니다.
