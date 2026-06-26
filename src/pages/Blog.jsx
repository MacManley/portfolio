import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/blog/blog.json')
      .then((r) => r.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
        setPosts(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="blog-page">
      <div className="blog-header page-header">
        <p className="page-eyebrow">Writing</p>
        <h1 className="page-title">Blog</h1>
        <p className="page-description">
          Thoughts on tech, building things, and lessons learned.
        </p>
      </div>

      {loading ? (
        <div className="blog-loading">Loading posts…</div>
      ) : (
        <ul className="blog-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/blog/${post.slug}`} className="blog-card">
                <div className="blog-card-meta">
                  <time className="blog-card-date">
                    {new Date(post.date).toLocaleDateString('en-IE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <div className="blog-card-tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="blog-tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-desc">{post.description}</p>
                <span className="blog-card-cta">Read more →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="page-footer-note">
        <p>© 2026 • Nathan Manley</p>
        <p>All Rights Reserved</p>
      </div>
    </div>
  );
}
