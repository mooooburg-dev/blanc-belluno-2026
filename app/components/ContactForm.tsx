"use client";

import { useState } from "react";

interface SiteSettings {
  instagram: string;
  kakaoChannel: string;
  naverBlog: string;
  naverSmartStore: string;
  phone: string;
  email: string;
  businessHours: string;
  brandDescription: string;
}

const eventTypes = [
  "생일파티 (아이)",
  "생일파티 (어른)",
  "웨딩",
  "돌잔치",
  "베이비샤워",
  "기업행사 / 브랜드 팝업",
  "프라이빗 파티",
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

export default function ContactForm({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "상담 신청에 실패했습니다.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "상담 신청에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section id="contact" className="section-padding bg-blanc-base">
        <div className="max-w-md mx-auto text-center py-16">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-blanc-surface border border-blanc-champagne relative overflow-hidden">
            <div className="absolute inset-0 bg-blanc-blush opacity-20" />
            <span className="font-display text-2xl italic text-blanc-gold">
              B.
            </span>
          </div>
          <h3 className="font-display text-3xl md:text-4xl font-light text-blanc-text-primary mb-4 tracking-tight">
            상담 신청이{" "}
            <span className="italic text-blanc-text-secondary">
              완료되었습니다
            </span>
          </h3>
          <p className="font-body text-sm text-blanc-text-secondary font-light leading-relaxed mb-10">
            소중한 문의를 남겨주셔서 감사합니다.
            <br />
            영업일 기준 1~2일 내에 꼼꼼히 확인 후 연락드리겠습니다.
          </p>
          <div className="divider-gold mb-10" />
          <button
            onClick={() => setSubmitted(false)}
            className="btn-outline px-10"
          >
            새로운 문의하기
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="section-padding relative overflow-hidden bg-blanc-base"
    >
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-linear-to-bl from-blanc-blush/40 to-transparent opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-linear-to-tr from-blanc-champagne/40 to-transparent opacity-50 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 md:mb-16">
          <span className="font-display text-[10px] sm:text-xs tracking-[0.4em] uppercase text-blanc-gold block mb-5">
            Inquiry
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-blanc-text-primary tracking-tight mb-6">
            상담{" "}
            <span className="italic text-blanc-text-secondary">신청하기</span>
          </h2>
          <div className="divider-gold" />
          <p className="font-body text-sm md:text-base mt-8 max-w-lg mx-auto leading-relaxed text-blanc-text-secondary font-light">
            특별한 날을 위한 완벽한 공간 연출,
            <br className="hidden md:block" />
            아래 폼을 통해 편하게 문의해 주세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Info Column */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            <div>
              <h3 className="font-display text-xl text-blanc-text-primary mb-4">
                Contact Info
              </h3>
              <p className="font-body text-sm text-blanc-text-secondary font-light leading-relaxed">
                급한 일정이시거나 빠른 확인이 필요하신 경우 카카오톡 채널을
                이용해주시면 더욱 신속한 답변이 가능합니다.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {settings.kakaoChannel && (
                <ContactLink
                  title="KAKAO CHANNEL"
                  value={settings.kakaoChannel}
                  href="https://pf.kakao.com"
                  desc="실시간 채팅 상담"
                />
              )}
              {settings.instagram && (
                <ContactLink
                  title="INSTAGRAM"
                  value={`@${settings.instagram}`}
                  href={`https://instagram.com/${settings.instagram}`}
                  desc="다양한 레퍼런스 확인"
                />
              )}
              {settings.naverSmartStore && (
                <ContactLink
                  title="NAVER SMARTSTORE"
                  value="블랑벨루노 스토어"
                  href={settings.naverSmartStore}
                  desc="파티 용품 구매"
                />
              )}
              {settings.businessHours && (
                <ContactLink
                  title="HOURS"
                  value={settings.businessHours}
                  desc="주말 및 공휴일 휴무"
                />
              )}
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-8">
            <div className="bg-blanc-surface p-6 sm:p-8 md:p-10 border border-blanc-champagne/30 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)]">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="성함 (Name) *">
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="input-belluno"
                    />
                  </FormField>
                  <FormField label="연락처 (Phone) *">
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

                <FormField label="이메일 (Email)">
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input-belluno"
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="행사 종류 *">
                    <div className="relative">
                      <select
                        name="eventType"
                        value={form.eventType}
                        onChange={handleChange}
                        required
                        className="input-belluno appearance-none"
                      >
                        <option value="" disabled className="text-blanc-text-muted">
                          선택해주세요
                        </option>
                        {eventTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blanc-gold text-[10px]">
                        ▼
                      </div>
                    </div>
                  </FormField>
                  <FormField label="행사 일자 *">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="장소 (지역 및 베뉴)">
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="ex) 서울 잠실 OOO호텔"
                      className="input-belluno"
                    />
                  </FormField>
                  <FormField label="예상 예산">
                    <div className="relative">
                      <select
                        name="budget"
                        value={form.budget}
                        onChange={handleChange}
                        className="input-belluno appearance-none"
                      >
                        <option value="" disabled className="text-blanc-text-muted">
                          선택 (선택사항)
                        </option>
                        <option value="협의 가능">협의</option>
                        <option value="30만원 내외">30만원 내외</option>
                        <option value="50만원 내외">50만원 내외</option>
                        <option value="100만원 이상">100만원 이상</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blanc-gold text-[10px]">
                        ▼
                      </div>
                    </div>
                  </FormField>
                </div>

                <FormField label="상세 내용">
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="원하시는 분위기, 메인 컬러, 참고하신 시안 링크 등을 남겨주시면 더욱 정확한 상담이 가능합니다."
                    className="input-belluno resize-none"
                  />
                </FormField>

                {error && (
                  <p className="font-body text-sm text-red-500 bg-red-50 px-4 py-3 border border-red-200">
                    {error}
                  </p>
                )}

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-blanc-champagne/40 mt-2">
                  <p className="font-body text-[10px] uppercase tracking-widest text-blanc-text-muted">
                    * 필수 입력 (Required)
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full sm:w-auto px-10 disabled:opacity-70"
                  >
                    {loading ? "SUBMITTING..." : "SUBMIT INQUIRY"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-body text-[11px] tracking-[0.1em] text-blanc-text-secondary uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}

const channelIcons: Record<string, React.ReactNode> = {
  "KAKAO CHANNEL": (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.724 1.8 5.113 4.508 6.463-.2.744-.723 2.694-.828 3.112-.13.518.19.51.4.372.164-.108 2.61-1.774 3.67-2.492.728.104 1.48.158 2.25.158 5.523 0 10-3.463 10-7.613C22 6.463 17.523 3 12 3z"/>
    </svg>
  ),
  INSTAGRAM: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  "NAVER SMARTSTORE": (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z"/>
    </svg>
  ),
  HOURS: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

function ContactLink({
  title,
  value,
  desc,
  href,
}: {
  title: string;
  value: string;
  desc: string;
  href?: string;
}) {
  const icon = channelIcons[title];
  const content = (
    <div className="group flex items-start gap-4">
      {icon && (
        <div className="w-8 h-8 rounded-full border border-blanc-champagne flex items-center justify-center shrink-0 text-blanc-gold">
          {icon}
        </div>
      )}
      <div className="border-l border-blanc-gold pl-5 py-1">
        <p className="font-display text-[10px] tracking-[0.3em] text-blanc-text-muted uppercase mb-1">
          {title}
        </p>
        <p className="font-body text-sm text-blanc-text-primary tracking-wide mb-1 transition-colors group-hover:text-blanc-text-secondary">
          {value}
        </p>
        <p className="font-body text-[11px] text-blanc-text-muted font-light">
          {desc}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-fit"
      >
        {content}
      </a>
    );
  }

  return content;
}
