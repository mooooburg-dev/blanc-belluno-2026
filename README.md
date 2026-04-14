# Blanc Belluno 2026

프리미엄 이벤트 스타일링 포트폴리오 웹사이트

## 기술 스택

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** — 커스텀 파스텔 팔레트, 글래스모피즘 효과
- **Supabase** — PostgreSQL 데이터베이스 + 이미지 스토리지
- **@dnd-kit** — 관리자 드래그앤드롭 정렬

## 시작하기

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 환경 변수

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Instagram Graph API
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_USER_ID=

# 카카오 알림톡 (선택)
KAKAO_REST_API_KEY=
KAKAO_ALIMTALK_SENDER_KEY=
KAKAO_ALIMTALK_TEMPLATE_CODE=
ADMIN_PHONE=
```

## 주요 기능

- **홈페이지** — 히어로 슬라이더, 서비스 소개, 갤러리, 상담 문의폼, 인스타그램 피드
- **포트폴리오** — 카테고리별(Wedding, Baby Shower, Party, Corporate) 작업물 갤러리
- **관리자 페이지** (`/admin`) — 포트폴리오/히어로 슬라이드 관리, 사이트 설정

## 명령어

```bash
yarn dev         # 개발 서버
yarn build       # 프로덕션 빌드
yarn start       # 프로덕션 서버
yarn lint        # ESLint 검사
```

## 배포

Vercel에 배포 가능합니다. 환경 변수를 Vercel 프로젝트 설정에 추가하세요.
