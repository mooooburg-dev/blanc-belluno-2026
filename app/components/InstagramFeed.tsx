import Image from 'next/image';
import { getInstagramFeed, type InstagramPost } from '@/lib/instagram';

interface SiteSettings {
  instagram: string;
  kakaoChannel: string;
  naverBlog: string;
  phone: string;
  email: string;
  businessHours: string;
  brandDescription: string;
}

const placeholderPosts = [
  { id: 1, gradient: 'from-[#f8e8ee] to-[#f2ebe1]' },
  { id: 2, gradient: 'from-[#f2ebe1] to-[#e8eef5]' },
  { id: 3, gradient: 'from-[#e8eef5] to-[#f5f0ea]' },
  { id: 4, gradient: 'from-[#f5f0ea] to-[#f0e2e8]' },
  { id: 5, gradient: 'from-[#f0e2e8] to-[#eedcd4]' },
  { id: 6, gradient: 'from-[#eedcd4] to-[#f8e8ee]' },
];

export default async function InstagramFeed({
  settings,
}: {
  settings: SiteSettings;
}) {
  const handle = settings.instagram || 'blancbelluno';
  const posts = await getInstagramFeed(6);
  const hasRealPosts = posts.length > 0;

  return (
    <section id="instagram" className="section-padding bg-blanc-surface">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-14">
          <span className="font-display text-[10px] sm:text-xs tracking-[0.4em] uppercase text-blanc-gold block mb-5">
            Follow Us
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-blanc-text-primary tracking-tight mb-6">
            인스타그램에서{' '}
            <span className="italic text-blanc-text-secondary">만나요</span>
          </h2>
          <div className="divider-gold" />
          <p className="font-body text-sm md:text-base mt-8 text-blanc-text-secondary font-light">
            매일 업데이트되는 블랑벨루노의 작업물을 가장 먼저 확인하세요.
          </p>
        </div>

        {/* Instagram handle badge */}
        <div className="flex justify-center mb-10">
          <a
            href={`https://instagram.com/${handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-2.5 rounded-full border border-blanc-champagne hover:bg-blanc-blush-light transition-all duration-300 group"
          >
            <InstagramIcon
              className="text-blanc-text-primary transition-transform group-hover:scale-110"
              size={16}
            />
            <span className="font-body text-xs tracking-[0.15em] text-blanc-text-primary uppercase">
              @{handle}
            </span>
          </a>
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {hasRealPosts
            ? posts.map((post) => <RealPost key={post.id} post={post} />)
            : placeholderPosts.map((post) => (
                <PlaceholderPost
                  key={post.id}
                  gradient={post.gradient}
                  handle={handle}
                />
              ))}
        </div>

        {/* Follow CTA */}
        <div className="text-center mt-14">
          <a
            href={`https://instagram.com/${handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex gap-3 px-10"
          >
            <InstagramIcon size={14} />
            FOLLOW ON INSTAGRAM
          </a>
        </div>
      </div>
    </section>
  );
}

function RealPost({ post }: { post: InstagramPost }) {
  const imageUrl =
    post.mediaType === 'VIDEO'
      ? post.thumbnailUrl || post.mediaUrl
      : post.mediaUrl;

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group aspect-square relative overflow-hidden"
    >
      <Image
        src={imageUrl}
        alt={post.caption?.slice(0, 100) || 'Instagram post'}
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-blanc-text-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
        <InstagramIcon className="text-white drop-shadow-md" size={28} />
      </div>
    </a>
  );
}

function PlaceholderPost({
  gradient,
  handle,
}: {
  gradient: string;
  handle: string;
}) {
  return (
    <a
      href={`https://instagram.com/${handle}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group aspect-square relative overflow-hidden flex items-center justify-center"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-700 group-hover:scale-105`}
      />
      <span className="font-display text-[9px] tracking-[0.2em] text-blanc-text-muted/50 uppercase relative z-10">
        Instagram Post
      </span>
      <div className="absolute inset-0 bg-blanc-text-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
        <InstagramIcon className="text-white drop-shadow-md" size={28} />
      </div>
    </a>
  );
}

function InstagramIcon({
  className = '',
  size = 20,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}
