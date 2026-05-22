import { useRef } from 'react';
import { useCMS } from '../context/CMSContext';
import { FileText, ExternalLink } from 'lucide-react';

// ── Skills data — edit these directly ──────────────────────────────
const SKILLS = {
  Languages:      ['Python', 'TypeScript', 'JavaScript', 'Java', 'C++', 'SQL'],
  Frontend:       ['React', 'Next.js', 'TailwindCSS', 'HTML/CSS', 'Vite', 'Figma'],
  Backend:        ['Node.js', 'Express', 'FastAPI', 'PostgreSQL', 'Redis', 'REST APIs'],
  'AI / ML':      ['PyTorch', 'scikit-learn', 'Hugging Face', 'LangChain', 'NumPy', 'Pandas'],
  'Dev Tools':    ['Git', 'Docker', 'Linux', 'Vercel', 'AWS', 'CI/CD'],
};

// ── Resume — replace with your actual resume URL ───────────────────
// Options:
//   • Google Drive share link (set to "anyone with link can view")
//   • Direct PDF URL (e.g. hosted in /public/resume.pdf)
//   • Any public URL
const RESUME_URL = '/resume.pdf'; // Put your resume.pdf in the /public folder, or replace with a URL

const CURRENTLY_READING = [
  { title: 'The Pragmatic Programmer', author: 'Hunt & Thomas' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman' },
  { title: 'The Years', author: 'Annie Ernaux' },
];

export const AboutPage = () => {
  const { config } = useCMS();
  const resumeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-sienna" />
            <span className="font-mono text-xs text-sienna/80 uppercase tracking-widest">About</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-ink leading-none tracking-tight">
            {config.name}
          </h1>
        </div>

        {/* Bio + Info grid */}
        <div className="grid md:grid-cols-5 gap-12 md:gap-16 mb-16">
          {/* Bio column */}
          <div className="md:col-span-3 space-y-6">
            <p className="font-display text-xl text-ink leading-relaxed">
              {config.bio}
            </p>

            <div className="border-l-2 border-sienna pl-6 py-1">
              <p className="font-body text-ink/70 leading-relaxed italic">
                I believe the best engineers are curious about everything — not just code, but design, people, and the world the software lives in.
              </p>
            </div>

            <div className="space-y-4 font-body text-ink/70 leading-relaxed">
              <p>
                I'm drawn to the intersection of software and real-world impact — building tools that are fast, thoughtful, and actually useful. I care about clean architecture as much as I care about the user on the other end.
              </p>
              <p>
                Outside of building things, I read a lot, think too much about system design, and occasionally convince myself that learning a new programming language is a good use of a Saturday.
              </p>
            </div>
          </div>

          {/* Info column */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-ink/30 mb-3">Based in</p>
              <p className="font-body text-ink">{config.location}</p>
            </div>

            {config.email && (
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-ink/30 mb-3">Email</p>
                <a href={`mailto:${config.email}`} className="font-body text-sienna hover-underline">
                  {config.email}
                </a>
              </div>
            )}

            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-ink/30 mb-3">Find me</p>
              <div className="space-y-2.5">
                {config.links.github && (
                  <a href={config.links.github} target="_blank" rel="noreferrer"
                    className="block font-body text-sm text-ink/70 hover:text-sienna transition-colors duration-200 hover-underline">
                    GitHub →
                  </a>
                )}
                {config.links.linkedin && (
                  <a href={config.links.linkedin} target="_blank" rel="noreferrer"
                    className="block font-body text-sm text-ink/70 hover:text-sienna transition-colors duration-200 hover-underline">
                    LinkedIn →
                  </a>
                )}
                {config.links.instagram && (
                  <a href={config.links.instagram} target="_blank" rel="noreferrer"
                    className="block font-body text-sm text-ink/70 hover:text-sienna transition-colors duration-200 hover-underline">
                    Instagram →
                  </a>
                )}
                {config.links.spotify && (
                  <a href={config.links.spotify} target="_blank" rel="noreferrer"
                    className="block font-body text-sm text-ink/70 hover:text-sienna transition-colors duration-200 hover-underline">
                    Spotify →
                  </a>
                )}
              </div>
            </div>

            <div className="bg-paper/60 border border-dust/40 p-5 rounded-sm">
              <p className="font-display text-sm text-ink/60 italic leading-relaxed">
                "{config.footerQuote}"
              </p>
            </div>
          </div>
        </div>

        {/* ── Skills ─────────────────────────────────────────────── */}
        <div className="border-t border-dust/40 pt-12 mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-sienna" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-sienna/80">Skills & Tools</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.entries(SKILLS).map(([category, items]) => (
              <div key={category} className="bg-paper/40 border border-dust/30 rounded-sm p-5">
                <p className="font-mono text-xs text-ink/40 uppercase tracking-widest mb-3">{category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {items.map(skill => (
                    <span
                      key={skill}
                      className="font-mono text-xs text-ink/70 bg-cream border border-dust/60 px-2 py-1 rounded-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="font-mono text-xs text-ink/30 mt-4">
            * Edit the <code className="bg-paper px-1 rounded">SKILLS</code> object in <code className="bg-paper px-1 rounded">src/pages/AboutPage.tsx</code> to update this list.
          </p>
        </div>

        {/* ── Resume ─────────────────────────────────────────────── */}
        <div className="border-t border-dust/40 pt-12 mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-px bg-dust" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-ink/40">Resume</h2>
            </div>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs text-ink/50 border border-dust/60 px-3 py-1.5 rounded-sm hover:border-sienna/40 hover:text-sienna transition-colors duration-200"
            >
              <ExternalLink size={11} />
              open in new tab
            </a>
          </div>

          {/* PDF embed */}
          <div className="relative w-full bg-paper/40 border border-dust/40 rounded-sm overflow-hidden" style={{ height: '700px' }}>
            <iframe
              ref={resumeRef}
              src={RESUME_URL}
              className="w-full h-full"
              title="Resume"
            />
            {/* Fallback if PDF doesn't load */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100">
              <FileText size={32} className="text-ink/20 mb-3" />
            </div>
          </div>

          <p className="font-mono text-xs text-ink/30 mt-3">
            * Place your resume PDF at <code className="bg-paper px-1 rounded">public/resume.pdf</code>, or update <code className="bg-paper px-1 rounded">RESUME_URL</code> in <code className="bg-paper px-1 rounded">src/pages/AboutPage.tsx</code> to point to any URL.
          </p>
        </div>

        {/* ── Currently Reading ───────────────────────────────────── */}
        <div className="border-t border-dust/40 pt-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-dust" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-ink/40">Currently Reading</h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {CURRENTLY_READING.map(book => (
              <div key={book.title} className="p-4 bg-paper/40 border border-dust/30 rounded-sm">
                <p className="font-display text-sm text-ink leading-snug">{book.title}</p>
                <p className="font-mono text-xs text-ink/40 mt-1">{book.author}</p>
              </div>
            ))}
          </div>

          <p className="font-mono text-xs text-ink/30 mt-4">
            * Edit the <code className="bg-paper px-1 rounded">CURRENTLY_READING</code> array in <code className="bg-paper px-1 rounded">src/pages/AboutPage.tsx</code> to update this.
          </p>
        </div>

      </div>
    </div>
  );
};
