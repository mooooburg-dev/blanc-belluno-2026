import Image from "next/image";
import { getPortfolioItems } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default function PortfolioPage() {
  const items = getPortfolioItems();

  return (
    <div className="min-h-screen bg-white">
      <header className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16">
        {items.length === 0 ? (
          <p className="text-gray-400 text-center py-20">
            등록된 포트폴리오가 없습니다.
          </p>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="break-inside-avoid rounded-lg overflow-hidden"
              >
                <Image
                  src={`/uploads/${item.filename}`}
                  alt={item.originalName}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
