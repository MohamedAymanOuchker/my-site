import { useState } from 'react';
import emailjs from 'emailjs-com';
import { Github, Linkedin, Mail, SquareArrowOutUpRight } from 'lucide-react';
import { Reveal } from './Reveal';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const SOCIALS = [
  { icon: Github, href: 'https://github.com/MohamedAymanOuchker', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/mohamed-ayman-ouchker/', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:ayman.ouchker@outlook.com', label: 'Email' },
  {
    icon: SquareArrowOutUpRight,
    href: 'https://mohamedaymanouchker.github.io/my-site-old/',
    label: 'Previous site',
  },
];

export function Contact() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      setStatus('error');
      setError('Please fill in both your email and a message.');
      return;
    }
    setStatus('sending');
    setError('');
    try {
      await emailjs.send(
        'service_gjveznh',
        'template_ug7i3xd',
        { email, message },
        'm82tfYbr9tSP5AwI8'
      );
      setStatus('sent');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setStatus('error');
      setError('Something went wrong sending your message. Please try again or email directly.');
    }
  };

  return (
    <section id="contact" className="relative bg-obsidian py-28 md:py-36">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-wide px-5 md:px-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
          {/* Left: pitch + socials */}
          <div>
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[11px] tracking-mono text-lime">04</span>
                <span className="h-px w-10 bg-lime/50" />
                <span className="font-mono text-[11px] uppercase tracking-mono text-muted">
                  Contact
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-8 font-display text-4xl font-semibold leading-[1.02] text-ink md:text-6xl text-balance">
                Let's build something <span className="text-lime">that moves.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
                Have a robotics or AI project in mind, or just want to talk shop? My inbox is open.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-10 flex gap-3">
                {SOCIALS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    aria-label={label}
                    className="grid h-12 w-12 place-items-center border border-line text-muted transition-colors hover:border-lime hover:text-lime"
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: form */}
          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="font-mono text-[11px] uppercase tracking-mono text-muted"
                >
                  Your email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="border border-line bg-void px-4 py-3.5 text-ink placeholder-faint transition-colors focus:border-lime focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="font-mono text-[11px] uppercase tracking-mono text-muted"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your project…"
                  className="resize-none border border-line bg-void px-4 py-3.5 text-ink placeholder-faint transition-colors focus:border-lime focus:outline-none"
                />
              </div>

              {status === 'error' && (
                <p role="alert" className="text-sm text-red-400">
                  {error}
                </p>
              )}
              {status === 'sent' && (
                <p role="status" className="text-sm text-lime">
                  Message sent — I'll get back to you soon.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="group flex items-center justify-center gap-3 bg-lime px-6 py-4 font-mono text-[12px] uppercase tracking-mono text-void transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
                {status !== 'sending' && (
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
