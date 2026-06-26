import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './Blog.css';

export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [meta, setMeta] = useState(null);
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

  return (
    <div className="blog-page">
      <div className="blog-post-nav">
        <Link to="/blog" className="blog-back">← Back to Blog</Link>
      </div>

      <article className="blog-post">
        {meta && (
          <header className="blog-post-header">
            <div className="blog-post-header-top">
              <div className="blog-card-tags">
                {meta.tags.map((tag) => (
                  <span key={tag} className="blog-tag">{tag}</span>
                ))}
              </div>
              <time className="blog-post-date">
                {new Date(meta.date).toLocaleDateString('en-IE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            <h1 className="blog-post-title">{meta.title}</h1>
          </header>
        )}

        <div className="blog-post-body">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </article>

      <div className="page-footer-note">
        <p>© 2026 • Nathan Manley</p>
        <p>All Rights Reserved</p>
      </div>
    </div>
  );
}
