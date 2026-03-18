"use client";

import { useState } from "react";

const eventTypes = [
  "생일파티 (아이)",
  "생일파티 (어른)",
  "웨딩",
  "돌잔치",
  "베이비샤워",
  "젠더 리빌",
  "기업행사 / 팝업",
  "홈파티",
  "기타",
];

type FormData = {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  location: string;
  budget: string;
  message: string;
};

const initialForm: FormData = {
  name: "",
  phone: "",
  email: "",
  eventType: "",
  eventDate: "",
  location: "",
  budget: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: 실제 폼 제출 로직 구현
    // 옵션 1: app/api/contact/route.ts 생성 후 이메일 발송 (nodemailer)
    // 옵션 2: Formspree (https://formspree.io) 연동
    // 옵션 3: 카카오 채널 API 연동
    await new Promise((r) => setTimeout(r, 1200)); // 시뮬레이션

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section
        id="contact"
        className="section-padding"
        style={{ background: "linear-gradient(160deg, #FFF0F5, #FFF8F0)" }}
      >
        <div className="max-w-xl mx-auto text-center py-16">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
            style={{
              background: "linear-gradient(135deg, #F8E8EE, #EDD5E1)",
              boxShadow: "0 4px 20px rgba(212, 137, 154, 0.2)",
            }}
          >
            💌
          </div>
          <h3
            className="font-display text-3xl font-light mb-3"
            style={{ color: "#4A2D3E" }}
          >
            상담 신청이 완료됐어요!
          </h3>
          <p className="font-body text-base mb-2" style={{ color: "#7A5466" }}>
            빠른 시일 내에 연락드리겠습니다.
          </p>
          <p className="font-body text-sm" style={{ color: "#A8889A" }}>
            보통 영업일 기준 1~2일 내 답변을 드립니다.
          </p>
          <div className="divider-gold mt-8 mb-8" />
          <button
            onClick={() => setSubmitted(false)}
            className="btn-outline"
          >
            다시 문의하기
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="section-padding"
      style={{ background: "linear-gradient(160deg, #FFF0F5, #FFF8F0)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span
            className="font-display text-sm tracking-[0.35em] uppercase block mb-3"
            style={{ color: "#C9A96E" }}
          >
            Contact
          </span>
          <h2
            className="font-display text-4xl md:text-5xl font-light mb-5"
            style={{ color: "#4A2D3E" }}
          >
            상담 <span className="italic text-[#D4899A]">신청하기</span>
          </h2>
          <div className="divider-gold" />
          <p
            className="font-body text-base mt-6 max-w-lg mx-auto leading-relaxed"
            style={{ color: "#7A5466" }}
          >
            간단한 정보를 남겨주시면 맞춤 견적과 함께 연락드립니다. 어떤 행사든 환영해요 🎈
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ContactInfoCard
              emoji="💬"
              title="카카오채널 문의"
              desc="@blancbelluno 로 채팅 문의주시면 빠른 답변이 가능합니다."
              link="https://pf.kakao.com"
              linkLabel="카카오 채널 바로가기"
            />
            <ContactInfoCard
              emoji="📸"
              title="인스타그램 DM"
              desc="인스타그램 DM으로도 문의 가능합니다. 사진 참고 자료를 함께 보내주시면 더 정확한 견적이 가능합니다."
              link="https://instagram.com/blancbelluno"
              linkLabel="@blancbelluno"
            />
            <ContactInfoCard
              emoji="📞"
              title="전화 문의"
              desc="평일 10:00 – 18:00\n주말·공휴일은 DM 또는 폼을 이용해주세요."
              link="tel:010-0000-0000"
              linkLabel="010-0000-0000"
            />
          </div>

          {/* Right Form */}
          <div
            className="lg:col-span-3 rounded-3xl p-8 md:p-10"
            style={{
              background: "white",
              boxShadow: "0 8px 40px rgba(74, 45, 62, 0.08)",
              border: "1px solid rgba(237, 213, 225, 0.4)",
            }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Row: 이름 + 연락처 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="이름 *" required>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="홍길동"
                    required
                    className="input-belluno"
                  />
                </FormField>
                <FormField label="연락처 *" required>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="010-0000-0000"
                    required
                    className="input-belluno"
                  />
                </FormField>
              </div>

              {/* 이메일 */}
              <FormField label="이메일">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="input-belluno"
                />
              </FormField>

              {/* Row: 행사 종류 + 예정일 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="행사 종류 *" required>
                  <select
                    name="eventType"
                    value={form.eventType}
                    onChange={handleChange}
                    required
                    className="input-belluno"
                  >
                    <option value="">선택해주세요</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="행사 예정일 *" required>
                  <input
                    name="eventDate"
                    type="date"
                    value={form.eventDate}
                    onChange={handleChange}
                    required
                    className="input-belluno"
                  />
                </FormField>
              </div>

              {/* Row: 장소 + 예산 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="행사 장소">
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="예) 서울 강남구"
                    className="input-belluno"
                  />
                </FormField>
                <FormField label="예산 범위">
                  <select
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className="input-belluno"
                  >
                    <option value="">선택 (선택사항)</option>
                    <option value="10만원 미만">10만원 미만</option>
                    <option value="10~30만원">10~30만원</option>
                    <option value="30~50만원">30~50만원</option>
                    <option value="50~100만원">50~100만원</option>
                    <option value="100만원 이상">100만원 이상</option>
                    <option value="협의">협의 가능</option>
                  </select>
                </FormField>
              </div>

              {/* 메시지 */}
              <FormField label="문의 내용">
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="행사에 대해 자유롭게 말씀해주세요. 참고하고 싶은 스타일이나 컬러가 있다면 알려주세요 😊"
                  className="input-belluno resize-none"
                />
              </FormField>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    전송 중...
                  </>
                ) : (
                  <>✦ 상담 신청하기</>
                )}
              </button>

              <p className="font-body text-xs text-center" style={{ color: "#A8889A" }}>
                * 표시 항목은 필수 입력 사항입니다.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="font-body text-sm font-medium"
        style={{ color: "#7A5466" }}
      >
        {label}
        {required && (
          <span className="ml-0.5" style={{ color: "#D4899A" }}>
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function ContactInfoCard({
  emoji,
  title,
  desc,
  link,
  linkLabel,
}: {
  emoji: string;
  title: string;
  desc: string;
  link: string;
  linkLabel: string;
}) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "white",
        border: "1px solid rgba(237, 213, 225, 0.5)",
        boxShadow: "0 2px 12px rgba(74, 45, 62, 0.05)",
      }}
    >
      <div className="flex items-start gap-3 mb-2">
        <span className="text-xl">{emoji}</span>
        <div>
          <p className="font-body font-medium text-sm" style={{ color: "#4A2D3E" }}>
            {title}
          </p>
          <p
            className="font-body text-sm mt-1 leading-relaxed whitespace-pre-line"
            style={{ color: "#A8889A" }}
          >
            {desc}
          </p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm font-medium mt-2 inline-block hover:underline"
            style={{ color: "#D4899A" }}
          >
            {linkLabel} →
          </a>
        </div>
      </div>
    </div>
  );
}
