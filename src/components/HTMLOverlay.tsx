'use client';

import { Scroll } from '@react-three/drei';
import {
  ChevronDown,
  Code,
  Wand2,
  Sparkles,
  Mail,
  ExternalLink,
  Globe,
  Layers,
  Database,
  Terminal,
  Camera,
  MessageCircle,
  Scroll as ScrollIcon,
  GraduationCap,
  Briefcase,
  Rocket,
  Send,
  User,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMagicalSounds } from '../hooks/useMagicalSounds';
import { useState, type FormEvent } from 'react';

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const fadeRight = {
  hidden: { opacity: 0, x: -60 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: 60 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

/* ─── Skill Badge Component ─── */
function SkillBadge({ skill }: { skill: string }) {
  const { playHoverSound } = useMagicalSounds();
  return (
    <motion.span
      variants={staggerItem}
      whileHover={{ scale: 1.1, borderColor: 'rgba(168,85,247,0.6)' }}
      onMouseEnter={playHoverSound}
      className="px-4 py-2 text-sm bg-purple-900/30 border border-purple-500/30 rounded-full text-purple-200 cursor-default transition-colors"
    >
      {skill}
    </motion.span>
  );
}

/* ─── Project Card Component ─── */
function ProjectCard({
  title,
  description,
  tags,
  href,
  icon: Icon = Code,
}: {
  title: string;
  description: string;
  tags: string[];
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const { playHoverSound, playClickSound } = useMagicalSounds();
  const Wrapper = href ? 'a' : 'div';
  const linkProps = href
    ? { href, target: '_blank', rel: 'noreferrer' as const }
    : {};

  return (
    <motion.div variants={staggerItem}>
      <Wrapper
        {...linkProps}
        onMouseEnter={playHoverSound}
        onClick={playClickSound}
        className="pointer-events-auto block p-5 bg-pink-950/40 hover:bg-pink-900/60 border border-pink-500/30 hover:border-pink-400/60 rounded-2xl transition-all group/card flex flex-col gap-2 cursor-pointer"
      >
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-pink-200">{title}</h3>
          {href ? (
            <ExternalLink className="w-5 h-5 text-pink-400 opacity-0 group-hover/card:opacity-100 transition-opacity" />
          ) : (
            <Icon className="w-5 h-5 text-pink-400" />
          )}
        </div>
        <p className="text-sm text-gray-400 font-light mt-1">{description}</p>
        <div className="flex gap-2 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-pink-900/50 text-pink-300 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </Wrapper>
    </motion.div>
  );
}

/* ─── Service Item Component ─── */
function ServiceItem({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <motion.div variants={staggerItem}>
      <h3 className="text-xl font-bold text-yellow-200 flex items-center justify-end gap-2">
        <Icon className="w-5 h-5" /> {title}
      </h3>
      <p className="text-sm text-gray-400 font-light mt-1">{description}</p>
    </motion.div>
  );
}

/* ─── Timeline Item Component ─── */
function TimelineItem({
  year,
  title,
  subtitle,
  description,
  icon: Icon,
  color,
}: {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}) {
  return (
    <motion.div variants={staggerItem} className="relative flex gap-4 md:gap-6">
      {/* Timeline dot & line */}
      <div className="flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border"
          style={{
            borderColor: `${color}50`,
            background: `${color}15`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="w-px flex-1 min-h-4 bg-gradient-to-b from-purple-500/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="pb-8">
        <span
          className="text-xs font-mono tracking-wider uppercase"
          style={{ color }}
        >
          {year}
        </span>
        <h3 className="text-lg font-bold text-white mt-1">{title}</h3>
        <p className="text-sm text-purple-300/70 font-medium">{subtitle}</p>
        <p className="text-sm text-gray-400 font-light mt-2 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Contact Form Component ─── */
function ContactForm() {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const { playHoverSound, playMagicSound } = useMagicalSounds();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    playMagicSound();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    // Open mailto with pre-filled fields
    const mailtoUrl = `mailto:akhmadnajibalfaizi@gmail.com?subject=Quest from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}`;
    window.open(mailtoUrl, '_blank');

    setFormState('sent');
    setTimeout(() => setFormState('idle'), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 pointer-events-auto">
      {/* Name Input */}
      <div className="relative">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/50" />
        <input
          name="name"
          type="text"
          required
          placeholder="Your Name"
          className="w-full pl-10 pr-4 py-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-cyan-50 text-sm placeholder:text-cyan-500/30 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all"
        />
      </div>

      {/* Message Input */}
      <div className="relative">
        <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-cyan-500/50" />
        <textarea
          name="message"
          required
          rows={3}
          placeholder="Describe your quest..."
          className="w-full pl-10 pr-4 py-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-cyan-50 text-sm placeholder:text-cyan-500/30 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all resize-none"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={formState === 'sending'}
        onMouseEnter={playHoverSound}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-gradient-to-r from-cyan-600/40 to-purple-600/40 hover:from-cyan-600/60 hover:to-purple-600/60 border border-cyan-400/30 rounded-xl text-cyan-50 text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {formState === 'sent' ? (
          <>✨ Owl Dispatched!</>
        ) : (
          <>
            Send an Owl <Send className="w-4 h-4" />
          </>
        )}
      </motion.button>
    </form>
  );
}

/* ═══════════════════════════════════════════════════ */
/* Main Component                                      */
/* ═══════════════════════════════════════════════════ */
export default function HTMLOverlay() {
  const { playHoverSound, playClickSound } = useMagicalSounds();

  return (
    <Scroll html style={{ width: '100vw' }}>
      {/* ═══════════════════════════════════════════════ */}
      {/* Page 1: Hero                                    */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="h-screen w-full flex flex-col items-center justify-center pointer-events-none relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-50" />

        <motion.h1
          initial="hidden"
          animate="visible"
          custom={0.2}
          variants={fadeUp}
          className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-200 to-purple-600 drop-shadow-[0_0_25px_rgba(168,85,247,0.5)] text-center tracking-tighter"
        >
          Akhmad Najib Alfaizi
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          custom={0.5}
          variants={fadeUp}
          className="mt-6 text-xl md:text-2xl text-purple-200/80 tracking-[0.3em] uppercase font-light drop-shadow-md text-center"
        >
          Digital Sorcerer
        </motion.p>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 flex flex-col items-center gap-2 animate-bounce"
        >
          <span className="text-xs tracking-widest text-purple-300 uppercase">
            Scroll to Descend
          </span>
          <ChevronDown className="text-purple-400 w-6 h-6" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* Page 2: About & Skills                         */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="h-screen w-full flex flex-col items-start justify-center px-6 md:px-32 pointer-events-none">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0}
          variants={fadeRight}
          className="max-w-2xl bg-black/40 p-8 md:p-10 rounded-3xl backdrop-blur-xl border border-purple-500/20 shadow-[0_0_50px_rgba(168,85,247,0.1)] relative overflow-hidden group"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/30 rounded-full blur-[50px] transition-transform duration-700 group-hover:scale-150" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
            variants={fadeUp}
            className="flex items-center gap-3 mb-6 relative"
          >
            <Wand2 className="text-purple-400 w-8 h-8" />
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              The Alchemist
            </h2>
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.2}
            variants={fadeUp}
            className="text-gray-300 leading-relaxed text-base md:text-xl font-light relative"
          >
            I craft digital experiences using ancient spells written in{' '}
            <strong className="text-purple-300 font-semibold">React</strong>,{' '}
            <strong className="text-purple-300 font-semibold">Three.js</strong>,
            and{' '}
            <strong className="text-purple-300 font-semibold">TypeScript</strong>
            . Welcome to my personal realm where logic meets imagination.
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mt-8 relative"
          >
            <h3 className="text-sm tracking-widest text-purple-400 uppercase mb-4">
              Arcane Arsenal (Tech Stack)
            </h3>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap gap-2 md:gap-3"
            >
              {[
                'Next.js',
                'React.js',
                'Three.js / R3F',
                'Tailwind CSS',
                'TypeScript',
                'Node.js',
                'Framer Motion',
                'Figma',
              ].map((skill) => (
                <SkillBadge key={skill} skill={skill} />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* Page 3: Services                               */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="h-screen w-full flex flex-col items-end justify-center px-6 md:px-32 pointer-events-none">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0}
          variants={fadeLeft}
          className="max-w-xl w-full bg-black/40 p-8 md:p-10 rounded-3xl backdrop-blur-xl border border-yellow-500/20 shadow-[0_0_50px_rgba(234,179,8,0.1)] relative overflow-hidden group"
        >
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-500/30 rounded-full blur-[50px] transition-transform duration-700 group-hover:scale-150" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
            variants={fadeUp}
            className="flex items-center gap-3 mb-8 relative justify-end"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Magical Services
            </h2>
            <Layers className="text-yellow-400 w-8 h-8" />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6 relative text-right"
          >
            <ServiceItem
              icon={Globe}
              title="Frontend Enchantment"
              description="Creating beautiful, responsive, and pixel-perfect user interfaces that captivate users."
            />
            <ServiceItem
              icon={Database}
              title="Backend Alchemy"
              description="Building robust, secure, and scalable server-side systems and APIs to power your applications."
            />
            <ServiceItem
              icon={Sparkles}
              title="3D Web Dimensions"
              description="Bringing websites to life with interactive 3D WebGL experiences and cinematic animations."
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* Page 4: Projects                               */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="h-screen w-full flex flex-col items-start justify-center px-6 md:px-32 pointer-events-none">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0}
          variants={fadeRight}
          className="max-w-3xl w-full bg-black/40 p-8 md:p-10 rounded-3xl backdrop-blur-xl border border-pink-500/20 shadow-[0_0_50px_rgba(236,72,153,0.1)] relative overflow-hidden group"
        >
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-500/30 rounded-full blur-[50px] transition-transform duration-700 group-hover:scale-150" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
            variants={fadeUp}
            className="flex items-center gap-3 mb-8 relative"
          >
            <Sparkles className="text-pink-400 w-8 h-8" />
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              The Grimoire
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 relative"
          >
            <ProjectCard
              title="Cinematic LinkTree"
              description="A cinematic portal to all my social dimensions built with React & Framer Motion."
              tags={['Next.js', 'Framer']}
              href="https://alfaizi-linktree.vercel.app/"
            />
            <ProjectCard
              title="E-Commerce Alchemy"
              description="High-performance digital marketplace with seamless checkout."
              tags={['React', 'Tailwind']}
            />
            <ProjectCard
              title="CMS of Wisdom"
              description="Custom Content Management System for bloggers."
              tags={['Node.js', 'MongoDB']}
            />
            <ProjectCard
              title="AI Oracle Chat"
              description="An intelligent chatbot integrated with OpenAI API."
              tags={['OpenAI', 'Next.js']}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* Page 5: Experience / Journey                   */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="h-screen w-full flex flex-col items-end justify-center px-6 md:px-32 pointer-events-none">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0}
          variants={fadeLeft}
          className="max-w-lg w-full bg-black/40 p-8 md:p-10 rounded-3xl backdrop-blur-xl border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden group"
        >
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/30 rounded-full blur-[50px] transition-transform duration-700 group-hover:scale-150" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
            variants={fadeUp}
            className="flex items-center gap-3 mb-8 relative justify-end"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              The Journey
            </h2>
            <ScrollIcon className="text-emerald-400 w-8 h-8" />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <TimelineItem
              year="2024 — Present"
              title="Freelance Digital Sorcerer"
              subtitle="Independent"
              description="Building immersive web experiences with React, Three.js, and Next.js for clients worldwide."
              icon={Rocket}
              color="#10b981"
            />
            <TimelineItem
              year="2023 — 2024"
              title="Frontend Developer"
              subtitle="Web Development Studio"
              description="Crafted responsive, high-performance UIs and led migration to modern React architecture."
              icon={Briefcase}
              color="#a855f7"
            />
            <TimelineItem
              year="2021 — 2023"
              title="Computer Science Student"
              subtitle="University"
              description="Studied algorithms, data structures, and software engineering. Explored creative coding and 3D graphics."
              icon={GraduationCap}
              color="#06b6d4"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* Page 6: Contact                                */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="h-screen w-full flex flex-col items-center justify-center pointer-events-none relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent opacity-50" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0}
          variants={scaleIn}
          className="text-center bg-black/40 p-10 md:p-16 rounded-[2rem] md:rounded-[3rem] backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_80px_rgba(6,182,212,0.15)] flex flex-col items-center gap-6 relative overflow-hidden mx-4"
        >
          <motion.div
            animate={{
              filter: [
                'drop-shadow(0 0 15px rgba(6,182,212,0.8))',
                'drop-shadow(0 0 30px rgba(6,182,212,1))',
                'drop-shadow(0 0 15px rgba(6,182,212,0.8))',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Mail className="w-12 h-12 md:w-16 md:h-16 text-cyan-400" />
          </motion.div>

          <div>
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.2}
              variants={fadeUp}
              className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-500 tracking-tight"
            >
              Summon Me
            </motion.h2>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.4}
              variants={fadeUp}
              className="text-cyan-200/60 mt-3 text-base md:text-lg font-light"
            >
              Have an epic quest? Let&apos;s join forces and build something
              magical.
            </motion.p>
          </div>

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.5}
            variants={fadeUp}
          >
            <ContactForm />
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex gap-6 mt-4 pointer-events-auto"
          >
            {[
              {
                href: 'https://github.com/Najebb',
                icon: Terminal,
                label: 'GitHub',
              },
              {
                href: 'https://wa.me/6285275281166',
                icon: MessageCircle,
                label: 'WhatsApp',
              },
              {
                href: 'https://instagram.com/alfaizie_',
                icon: Camera,
                label: 'Instagram',
              },
            ].map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                variants={staggerItem}
                whileHover={{ scale: 1.2, y: -4 }}
                onMouseEnter={playHoverSound}
                onClick={playClickSound}
                className="text-cyan-500 hover:text-white transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-8 h-8" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </Scroll>
  );
}
