"use client";

const services = [
  {
    icon: "🎂",
    title: "생일파티",
    subtitle: "Birthday Party",
    description:
      "아이부터 어른까지, 생애 가장 특별한 날을 화사한 풍선 아치와 가랜드로 채워드립니다. 테마 맞춤 제작도 가능합니다.",
    tags: ["키즈 파티", "어른 생일", "서프라이즈"],
  },
  {
    icon: "💍",
    title: "웨딩 & 돌잔치",
    subtitle: "Wedding & Doljanchi",
    description:
      "인생의 가장 아름다운 순간을 위한 고급 풍선 장식. 웨딩홀 포토존, 테이블 장식, 입구 아치까지 섬세하게 연출합니다.",
    tags: ["웨딩홀", "포토존", "테이블 세팅"],
  },
  {
    icon: "👶",
    title: "베이비샤워",
    subtitle: "Baby Shower",
    description:
      "새 생명의 탄생을 축하하는 파스텔 풍선 장식. 성별 리빌 파티, 임신 축하 파티 등 특별한 구성을 제안해드립니다.",
    tags: ["젠더 리빌", "임신 축하", "신생아 파티"],
  },
  {
    icon: "🏢",
    title: "기업 & 행사",
    subtitle: "Corporate & Events",
    description:
      "브랜드 컬러에 맞춘 기업 행사 풍선 장식. 론칭 파티, 팝업스토어, 사옥 인테리어까지 스케일에 맞게 제작합니다.",
    tags: ["론칭 파티", "팝업스토어", "기업 행사"],
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="section-padding"
      style={{ background: "#FAF5F0" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className="font-display text-sm tracking-[0.35em] uppercase block mb-3"
            style={{ color: "#C9A96E" }}
          >
            Our Services
          </span>
          <h2
            className="font-display text-4xl md:text-5xl font-light mb-5"
            style={{ color: "#4A2D3E" }}
          >
            어떤 날이든, <span className="italic text-[#D4899A]">특별하게</span>
          </h2>
          <div className="divider-gold" />
          <p
            className="font-body text-base mt-6 max-w-xl mx-auto leading-relaxed"
            style={{ color: "#7A5466" }}
          >
            블랑벨루노는 모든 순간을 소중히 여깁니다. 작은 홈파티부터 대규모 행사까지, 고객의 상상을 현실로 만들어드립니다.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <p
            className="font-body text-sm mb-5"
            style={{ color: "#A8889A" }}
          >
            원하시는 서비스가 없으신가요? 맞춤 상담을 통해 어떤 행사도 가능합니다.
          </p>
          <button
            onClick={() => {
              const el = document.querySelector("#contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-outline"
          >
            맞춤 상담 문의 →
          </button>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const gradients = [
    "linear-gradient(135deg, #FFF0F5, #FAE8F5)",
    "linear-gradient(135deg, #FFF5F0, #FAF0E8)",
    "linear-gradient(135deg, #F5F0FF, #F0E8FF)",
    "linear-gradient(135deg, #F0F8FF, #E8F5FF)",
  ];

  return (
    <div
      className="group rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-default"
      style={{
        background: gradients[index % gradients.length],
        border: "1px solid rgba(201, 160, 188, 0.2)",
        boxShadow: "0 2px 12px rgba(74, 45, 62, 0.05)",
      }}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110"
        style={{
          background: "rgba(255,255,255,0.8)",
          boxShadow: "0 2px 10px rgba(201, 160, 188, 0.2)",
        }}
      >
        {service.icon}
      </div>

      {/* Title */}
      <h3
        className="font-display text-xl font-medium mb-1"
        style={{ color: "#4A2D3E" }}
      >
        {service.title}
      </h3>
      <p
        className="font-display text-xs tracking-[0.2em] italic mb-3"
        style={{ color: "#C9A96E" }}
      >
        {service.subtitle}
      </p>

      {/* Description */}
      <p
        className="font-body text-sm leading-relaxed mb-4"
        style={{ color: "#7A5466" }}
      >
        {service.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {service.tags.map((tag) => (
          <span
            key={tag}
            className="font-body text-xs px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.8)",
              color: "#A8889A",
              border: "1px solid rgba(201, 160, 188, 0.3)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
