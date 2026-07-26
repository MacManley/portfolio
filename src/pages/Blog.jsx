import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, pageTransition } from '../motion/variants';
import { readingMinutes } from '../utils/readingTime';
import './Blog.css';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch('/blog/blog.json')
      .then((r) => r.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
        if (!cancelled) setPosts(sorted);

        // Reading time lives in the markdown, not blog.json — pull the bodies so the
        // index stays accurate without any manual upkeep when posts change.
        return Promise.all(
          sorted.map((post) =>
            fetch(`/blog/${post.slug}.md`)
              .then((r) => (r.ok ? r.text() : ''))
              .catch(() => '')
              .then((md) => ({ ...post, minutes: md ? readingMinutes(md) : null }))
          )
        );
      })
      .then((withTimes) => {
        if (!cancelled && withTimes) setPosts(withTimes);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <motion.div className="blog-page" variants={pageTransition} initial="hidden" animate="show" exit="exit">
      <div className="blog-header page-header">
        <p className="page-eyebrow">HOW I BUILD</p>
        <h1 className="page-title">Blog</h1>
        <p className="page-description">
          Thoughts on tech, building things, and lessons learned.
        </p>
      </div>

      {loading ? (
        <div className="blog-loading">Loading posts…</div>
      ) : (
        <motion.ul className="blog-list" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          {posts.map((post, index) => (
            <motion.li key={post.slug} variants={staggerItem}>
              <Link to={`/blog/${post.slug}`} className="blog-row">
                <span className="blog-row-index">{String(index + 1).padStart(2, '0')}</span>

                <div className="blog-row-main">
                  <div className="blog-row-meta">
                    <time className="blog-card-date">
                      {new Date(post.date).toLocaleDateString('en-IE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    {post.minutes && (
                      <>
                        <span className="blog-meta-sep" aria-hidden="true">/</span>
                        <span className="blog-read-time">{post.minutes} min read</span>
                      </>
                    )}
                  </div>

                  <h2 className="blog-card-title">{post.title}</h2>
                  <p className="blog-card-desc">{post.description}</p>

                  <div className="blog-card-tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="blog-tag">{tag}</span>
                    ))}
                  </div>

                  <span className="blog-card-cta">Read more →</span>
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      )}

      <div className="page-footer-note">
        <p>© 2026 • Nathan Manley</p>
        <p>All Rights Reserved</p>
      </div>
    </motion.div>
  );
}
