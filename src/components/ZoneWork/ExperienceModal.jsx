import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// Custom renderer for ReactMarkdown to add spacing before headings and bold section headers
const markdownComponents = {
  h1: ({node, ...props}) => <h1 style={{marginTop: '2.2em', marginBottom: '0.5em', fontSize: '1.4em', fontWeight: 700}} {...props} />,
  h2: ({node, ...props}) => <h2 style={{marginTop: '2em', marginBottom: '0.5em', fontSize: '1.22em', fontWeight: 700}} {...props} />,
  h3: ({node, ...props}) => <h3 style={{marginTop: '1.7em', marginBottom: '0.4em', fontSize: '1.13em', fontWeight: 700}} {...props} />,
  strong: ({node, ...props}) => <strong style={{display: 'block', marginTop: '1.5em', fontWeight: 700}} {...props} />,
  p: ({node, ...props}) => <p style={{marginTop: '0.7em', marginBottom: '0.7em'}} {...props} />,
};

// Helper to extract Industry and Testimonial from markdown details
function extractIndustryAndTestimonial(details) {
  let industry = null;
  let testimonial = null;
  let rest = details;
  // Extract Industry
  const industryMatch = details.match(/\*\*Industry:\*\*\s*([^\n]+)/);
  if (industryMatch) {
    industry = industryMatch[1].split(',').map(s => s.trim());
    rest = rest.replace(industryMatch[0], '');
  }
  // Extract Testimonial
  const testimonialMatch = details.match(/\*\*Client Testimonial:\*\*[\s\n]*(["“][^\n]+["”][^\n]*)/);
  if (testimonialMatch) {
    testimonial = testimonialMatch[1].trim();
    rest = rest.replace(/\*\*Client Testimonial:\*\*[\s\S]*?(?=\n\*\*|\n\-|$)/, '');
  }
  return { industry, testimonial, rest };
}

// Chip color palette
const chipColors = [
  '#E0E7FF', // blue
  '#FDE68A', // yellow
  '#BBF7D0', // green
  '#FCA5A5', // red
  '#FBCFE8', // pink
  '#A7F3D0', // teal
  '#FCD34D', // gold
  '#C7D2FE', // indigo
];

export default function ExperienceModal({ experience, open, onClose }) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Sidebar animation (slide in from right)
  const initial = { opacity: 0, x: '100%' };
  const animate = { opacity: 1, x: 0 };
  const exit = initial;

  // Extract industry and testimonial from details
  const { industry, testimonial, rest } = extractIndustryAndTestimonial(experience.details);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
              background: '#222', zIndex: 1000, pointerEvents: 'auto',
            }}
            onClick={onClose}
          />
          {/* Sidebar */}
          <motion.div
            key="sidebar"
            initial={initial}
            animate={animate}
            exit={exit}
            transition={{ type: 'spring', stiffness: 340, damping: 32, duration: 0.38 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100vh',
              zIndex: 1010,
              background: '#f9f9f7',
              boxShadow: '-8px 0 32px 0 rgba(0,0,0,0.18), -1.5px 0 4px 0 rgba(0,0,0,0.10)',
              width: 'min(95vw, 540px)',
              maxWidth: 540,
              minWidth: 320,
              display: 'flex', flexDirection: 'column',
              padding: 0,
              fontFamily: 'var(--font-sans)',
              color: '#222',
              outline: 'none',
            }}
            tabIndex={-1}
            onClick={e => e.stopPropagation()}
          >
            {/* Sticky header with close button */}
            <div style={{
              position: 'sticky',
              top: 0,
              background: '#f9f9f7',
              zIndex: 2,
              borderBottom: '1.5px solid #e0e0e0',
              padding: '1.2rem 2.2rem 1.1rem 2.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ fontFamily: 'var(--font-marker)', fontSize: '2rem', fontWeight: 900, color: '#222', lineHeight: 1.1 }}>{experience.title}</div>
              <button
                onClick={onClose}
                style={{
                  background: 'none', border: 'none', fontSize: 32, color: '#b22222', cursor: 'pointer', fontWeight: 900, marginLeft: 16
                }}
                aria-label="Close"
              >×</button>
            </div>
            {/* Scrollable content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.6rem 2.2rem 2.2rem 2.2rem',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '1.18rem', fontWeight: 700, marginBottom: '0.7rem', letterSpacing: '0.01em' }}>{experience.company}</div>
              <div style={{ fontSize: '1.08rem', fontWeight: 500, marginBottom: '1.7rem', color: '#444' }}>{experience.year}</div>
              <div style={{ borderTop: '1.5px solid #e0e0e0', margin: '0 0 2.1rem 0' }} />

              {/* Industry chips */}
              {industry && industry.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {industry.map((ind, i) => (
                    <span key={ind} style={{
                      background: chipColors[i % chipColors.length],
                      color: '#222',
                      fontWeight: 600,
                      fontSize: '0.98rem',
                      borderRadius: '999px',
                      padding: '0.32em 1em',
                      letterSpacing: '0.01em',
                      border: '1.5px solid #e0e0e0',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    }}>{ind}</span>
                  ))}
                </div>
              )}

              <div style={{ fontSize: '1.18rem', fontWeight: 600, marginBottom: '2.1rem', lineHeight: 1.5 }}>{experience.summary}</div>
              <div style={{ borderTop: '1.5px solid #e0e0e0', margin: '0 0 2.1rem 0' }} />

              <div style={{ fontSize: '1.09rem', color: '#333', marginBottom: '2.1rem', lineHeight: 1.7 }}>
                <ReactMarkdown components={markdownComponents}>{rest}</ReactMarkdown>
              </div>
              <div style={{ borderTop: '1.5px solid #e0e0e0', margin: '0 0 2.1rem 0' }} />

              {/* Skills chips */}
              {experience.skills && experience.skills.length > 0 && (
                <>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.2rem' }}>
                    {experience.skills.map((skill, i) => (
                      <span key={skill} style={{
                        background: chipColors[(i+3) % chipColors.length],
                        color: '#222',
                        fontWeight: 600,
                        fontSize: '0.98rem',
                        borderRadius: '999px',
                        padding: '0.32em 1em',
                        letterSpacing: '0.01em',
                        border: '1.5px solid #e0e0e0',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                      }}>{skill}</span>
                    ))}
                  </div>
                  <div style={{ borderTop: '1.5px solid #e0e0e0', margin: '0 0 1.2rem 0' }} />
                </>
              )}
              {experience.link && (
                <a href={experience.link} target="_blank" rel="noopener noreferrer" style={{ color: '#3245FF', fontWeight: 700, fontSize: '1.09rem', marginTop: '1.2rem' }}>View Project</a>
              )}
              {/* Testimonial in handwritten style */}
              {testimonial && (
                <div style={{
                  fontFamily: 'var(--font-marker)',
                  fontSize: '1.18rem',
                  background: '#fffbe7',
                  color: '#222',
                  borderLeft: '4px solid #fcd34d',
                  borderRadius: '8px',
                  padding: '1.1em 1.3em',
                  margin: '1.5em 0 1.2em 0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  whiteSpace: 'pre-line',
                }}>
                  {testimonial}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 