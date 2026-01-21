import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import "./Articles.css";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editSubject, setEditSubject] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lawyer/article");
      setArticles(res.data);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Failed to load articles ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleAddArticle = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !description.trim()) {
      return toast.error("Subject and Description are required!");
    }

    try {
      const res = await API.post("/lawyer/article", {
        subject,
        description,
      });

      toast.success(res.data?.msg || "Article added ✅");
      setSubject("");
      setDescription("");
      fetchArticles();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Failed to add article ❌");
    }
  };

  const startEdit = (article) => {
    setEditingId(article._id);
    setEditSubject(article.subject);
    setEditDescription(article.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditSubject("");
    setEditDescription("");
    toast("Edit cancelled");
  };

  const handleUpdate = async (id) => {
    if (!editSubject.trim() || !editDescription.trim()) {
      return toast.error("Subject and Description are required!");
    }

    try {
      await API.put(`/lawyer/article/${id}`, {
        subject: editSubject,
        description: editDescription,
      });

      toast.success("Article updated ✅");
      cancelEdit();
      fetchArticles();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Failed to update article ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    try {
      const res = await API.delete(`/lawyer/article/${id}`);
      toast.success(res.data?.msg || "Article deleted ✅");
      fetchArticles();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Failed to delete article ❌");
    }
  };

  return (
    <div className="articles-page">
      <h1 className="articles-title">📝 Manage Articles</h1>

      <div className="articles-grid">
        {/* LEFT - ADD ARTICLE */}
        <div className="articles-left">
          <form onSubmit={handleAddArticle} className="articles-card">
            <h3 className="articles-subTitle">Add New Article</h3>

            <input
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="articles-input"
            />

            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="articles-textarea"
            />

            <button type="submit" className="articles-btn primary">
              ➕ Add Article
            </button>
          </form>
        </div>

        {/* RIGHT - LIST */}
        <div className="articles-right">
          <div className="articles-card articles-rightCard">
            <h3 className="articles-subTitle">Your Articles</h3>

            {loading ? (
              <p className="articles-infoText">Loading articles...</p>
            ) : articles.length === 0 ? (
              <p className="articles-infoText">No articles found.</p>
            ) : (
              <div className="articles-listScroll">
                {articles.map((a) => (
                  <div key={a._id} className="articles-item">
                    {editingId === a._id ? (
                      <>
                        <input
                          value={editSubject}
                          onChange={(e) => setEditSubject(e.target.value)}
                          className="articles-input"
                        />

                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={4}
                          className="articles-textarea"
                        />

                        <div className="articles-actions">
                          <button
                            type="button"
                            onClick={() => handleUpdate(a._id)}
                            className="articles-btn success"
                          >
                            ✅ Save
                          </button>

                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="articles-btn neutral"
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h4 className="articles-subject">{a.subject}</h4>
                        <p className="articles-desc">{a.description}</p>

                        <div className="articles-actions">
                          <button
                            type="button"
                            onClick={() => startEdit(a)}
                            className="articles-btn neutral"
                          >
                            ✏️ Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(a._id)}
                            className="articles-btn danger"
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
