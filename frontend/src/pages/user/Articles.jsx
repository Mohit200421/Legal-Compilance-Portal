import { useEffect, useState } from "react";
import API from "../../api/axios";
import "../../styles/usercss/articles.css";

export default function UserArticles() {
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // ✅ Fetch Articles (User View)
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);

        // ✅ Backend route: GET /api/user/articles
        const res = await API.get("/user/articles");

        setArticles(res.data || []);
        setFiltered(res.data || []);
      } catch (err) {
        console.log(err);
        setArticles([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // ✅ Search Filter (subject)
  useEffect(() => {
    const result = articles.filter((a) =>
      a.subject?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, articles]);

  return (
    <div className="user-articles-page">
      {/* Header */}
      <div className="ua-header">
        <h2 className="ua-title">Legal Articles</h2>
        <p className="ua-subtitle">
          Read latest legal articles written by verified lawyers.
        </p>
      </div>

      {/* Search */}
      <div className="ua-search-box">
        <input
          type="text"
          placeholder="Search articles by subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading && <p className="ua-loading">Loading articles...</p>}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <p className="ua-empty">No articles found.</p>
      )}

      {/* Articles Grid */}
      <div className="ua-grid">
        {filtered.map((article) => (
          <div key={article._id} className="ua-card">
            <h3 className="ua-card-title">{article.subject}</h3>

            <p className="ua-card-desc">
              {article.description?.length > 120
                ? article.description.slice(0, 120) + "..."
                : article.description}
            </p>

            <div className="ua-card-footer">
              <span className="ua-date">
                {article.createdAt
                  ? new Date(article.createdAt).toLocaleDateString()
                  : "No date"}
              </span>

              <button className="ua-btn" onClick={() => setSelected(article)}>
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div className="ua-modal-overlay" onClick={() => setSelected(null)}>
          <div className="ua-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="ua-modal-title">{selected.subject}</h2>

            <p className="ua-modal-date">
              {selected.createdAt
                ? new Date(selected.createdAt).toLocaleString()
                : ""}
            </p>

            {/* Optional Author */}
            {selected.authorId?.name && (
              <p className="ua-author">
                Written by: <b>{selected.authorId.name}</b>
              </p>
            )}

            <div className="ua-modal-content">{selected.description}</div>

            <button className="ua-close-btn" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
