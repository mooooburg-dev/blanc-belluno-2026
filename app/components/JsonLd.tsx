import { SITE_NAME, SITE_NAME_KO, SITE_URL, DEFAULT_DESCRIPTION } from "@/lib/seo";

interface JsonLdProps {
  phone?: string;
  instagram?: string;
  naverBlog?: string;
}

export default function JsonLd({ phone, instagram, naverBlog }: JsonLdProps) {
  const sameAs = [
    instagram ? `https://instagram.com/${instagram.replace(/^@/, "")}` : null,
    naverBlog || null,
  ].filter(Boolean);

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    alternateName: SITE_NAME_KO,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/blanc_belluno_logo.jpg`,
    logo: `${SITE_URL}/icon-512.png`,
    ...(phone ? { telephone: phone } : {}),
    priceRange: "₩₩",
    areaServed: { "@type": "Country", name: "대한민국" },
    address: { "@type": "PostalAddress", addressCountry: "KR" },
    ...(sameAs.length > 0 ? { sameAs } : {}),
    knowsAbout: [
      "풍선 장식",
      "풍선 아치",
      "풍선 가랜드",
      "웨딩 풍선",
      "돌잔치 풍선",
      "베이비샤워",
      "젠더 리빌",
      "생일 파티",
      "기업 행사 데코레이션",
    ],
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "웨딩 풍선 장식" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "돌잔치 풍선 장식" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "생일파티 풍선 장식" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "베이비샤워 풍선 장식" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "기업 행사 풍선 장식" } },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
