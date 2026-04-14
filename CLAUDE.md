# CLAUDE.md

Blanc Belluno — 프리미엄 이벤트 스타일링 포트폴리오 웹사이트

## 개발 명령어

```bash
yarn dev         # 개발 서버 (http://localhost:3000)
yarn build       # 프로덕션 빌드
yarn start       # 프로덕션 서버
yarn lint        # ESLint 검사
```

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript (strict 모드)
- **스타일링**: Tailwind CSS 4 (별도 config 없이 `globals.css`의 `@theme` 디렉티브 사용)
- **React**: React 19
- **DB/스토리지**: Supabase (PostgreSQL + Storage)
- **드래그앤드롭**: @dnd-kit
- **외부 API**: Instagram Graph API, 카카오 알림톡

## 프로젝트 구조

- `app/` — Next.js App Router 페이지 및 레이아웃
  - `page.tsx` — 홈페이지 (히어로, 서비스, 갤러리, 문의폼, 인스타 피드)
  - `layout.tsx` — 루트 레이아웃 (Geist 폰트)
  - `globals.css` — 전역 스타일 + Tailwind 테마 변수 (파스텔 팔레트)
  - `components/` — UI 컴포넌트 (Header, Hero, Services, Gallery, ContactForm, Footer 등)
  - `admin/` — 관리자 대시보드 (포트폴리오, 히어로 슬라이드, 사이트 설정)
  - `portfolio/` — 포트폴리오 페이지
  - `api/` — REST API 라우트
    - `portfolio/` — 포트폴리오 CRUD + 순서 변경
    - `hero-slides/` — 히어로 슬라이드 CRUD + 순서 변경
    - `settings/` — 사이트 설정 조회/수정
    - `inquiry/` — 상담 문의 접수
    - `instagram/` — 인스타그램 피드 및 스토리 프록시
- `lib/` — 비즈니스 로직 및 유틸리티
  - `supabase.ts` — Supabase 클라이언트 초기화 + 스토리지 URL 헬퍼
  - `portfolio.ts` — 포트폴리오 CRUD (카테고리: WEDDING, BABY SHOWER, PARTY, CORPORATE)
  - `hero-slides.ts` — 히어로 슬라이드 CRUD
  - `settings.ts` — 사이트 설정 관리
  - `instagram.ts` — Instagram Graph API 연동
  - `kakao-alimtalk.ts` — 카카오 알림톡 발송
- `data/` — JSON 폴백 데이터 (settings.json, portfolio.json)
- `public/` — 정적 파일

## 코드 스타일

- 경로 별칭: `@/*` → 프로젝트 루트 (예: `@/lib/supabase`)
- 컴포넌트: `app/components/`에 단일 파일로 관리
- API 라우트: `route.ts`에서 GET/POST/PATCH/DELETE/PUT 핸들러 export
- 색상: stone 팔레트 기반 (관리자), 커스텀 파스텔 팔레트 (프론트)
- Tailwind CSS 4: `bg-gradient-to-*` 대신 `bg-linear-to-*` 사용
