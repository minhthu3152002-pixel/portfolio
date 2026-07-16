import { content } from '@/lib/content';

/** Home hero band. Text comes from content.hero. */
export function Hero() {
  const h = content.hero;
  return (
    <header className="relative overflow-hidden pb-[90px] pt-[110px]">
      {/* soft glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-[220px] h-[600px] w-[600px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255,122,69,.13), transparent 65%)',
        }}
      />
      <div className="wrap relative">
        <p className="eyebrow">{h.badge}</p>
        <h1 className="mb-[22px] max-w-[880px] text-[clamp(2.5rem,6.4vw,4.4rem)] font-extrabold tracking-[-0.02em]">
          {h.headline}{' '}
          <em className="headline-gradient not-italic">{h.headlineItalic}</em>{' '}
          {h.headlineTail}
        </h1>
        <p className="max-w-[620px] text-[1.02rem] text-muted">{h.subtitle}</p>
      </div>
    </header>
  );
}
