import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { fadeUp, pageTransition } from '../motion/variants';
import { readingMinutes } from '../utils/readingTime';
import './Blog.css';

export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [meta, setMeta] = useState(null);
  const [siblings, setSiblings] = useState({ newer: null, older: null });
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/blog/${slug}.md`).then((r) => {
        if (!r.ok) throw new Error('not found');
        return r.text();
      }),
      fetch('/blog/blog.json').then((r) => r.json()),
    ])
      .then(([md, posts]) => {
        setContent(md.replace(/^#[^\n]*\n/, ''));
        setMeta(posts.find((p) => p.slug === slug) ?? null);

        // Newest-first, matching the index, so "newer" is the entry before this one.
        const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
        const position = sorted.findIndex((p) => p.slug === slug);
        setSiblings({
          newer: position > 0 ? sorted[position - 1] : null,
          older: position >= 0 && position < sorted.length - 1 ? sorted[position + 1] : null,
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="blog-page"><div className="blog-loading">Loading…</div></div>;
  if (notFound) return (
    <div className="blog-page">
      <div className="blog-not-found">
        <p>Post not found.</p>
        <Link to="/blog" className="blog-back">← Back to Blog</Link>
      </div>
    </div>
  );

  const minutes = readingMinutes(content);

  return (
    <motion.div className="blog-page" variants={pageTransition} initial="hidden" animate="show" exit="exit">
      <div className="blog-post-nav">
        <Link to="/blog" className="blog-back">← Back to Blog</Link>
      </div>

      <motion.article className="blog-post" variants={fadeUp} initial="hidden" animate="show">
        {meta && (
          <header className="blog-post-header">
            <div className="blog-post-header-top">
              <div className="blog-card-tags">
                {meta.tags.map((tag) => (
                  <span key={tag} className="blog-tag">{tag}</span>
                ))}
              </div>
              <div className="blog-post-meta">
                <time className="blog-post-date">
                  {new Date(meta.date).toLocaleDateString('en-IE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span className="blog-meta-sep" aria-hidden="true">/</span>
                <span className="blog-read-time">{minutes} min read</span>
              </div>
            </div>
            <h1 className="blog-post-title">{meta.title}</h1>
          </header>
        )}

        <div className="blog-post-body">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </motion.article>

      {(siblings.newer || siblings.older) && (
        <nav className="blog-post-pager">
          {siblings.newer && (
            <Link className="blog-pager-link blog-pager-prev" to={`/blog/${siblings.newer.slug}`}>
              <span className="blog-pager-label">← Newer post</span>
              <span className="blog-pager-title">{siblings.newer.title}</span>
            </Link>
          )}

          {siblings.older && (
            <Link className="blog-pager-link blog-pager-next" to={`/blog/${siblings.older.slug}`}>
              <span className="blog-pager-label">Older post →</span>
              <span className="blog-pager-title">{siblings.older.title}</span>
            </Link>
          )}
        </nav>
      )}

      <div className="page-footer-note">
        <p>© 2026 • Nathan Manley</p>
        <p>All Rights Reserved</p>
      </div>
    </motion.div>
  );
}
