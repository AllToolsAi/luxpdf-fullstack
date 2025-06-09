import { useState } from 'react';
import { FiClock, FiTrendingUp, FiBookmark } from 'react-icons/fi';

const articles = [
    {
        id: 1,
        title: "The Future of Remote Work in 2023",
        excerpt: "How hybrid models are reshaping corporate culture worldwide",
        category: "Technology",
        time: "2 hours ago",
        trending: true
    },
    {
        id: 2,
        title: "New Breakthrough in Renewable Energy",
        excerpt: "Scientists achieve record efficiency with solar cell technology",
        category: "Science",
        time: "5 hours ago",
        trending: false
    },
    {
        id: 3,
        title: "Global Tech Conference Announcements",
        excerpt: "Key takeaways from this year's leading technology summit",
        category: "Business",
        time: "1 day ago",
        trending: true
    },
    {
        id: 4,
        title: "Digital Privacy Laws Update",
        excerpt: "How new regulations will affect social media platforms",
        category: "Politics",
        time: "1 day ago",
        trending: false
    }
];

const NewsFeed = () => {
    const [filter, setFilter] = useState("All Categories");

    // Filter articles by category
    const filteredArticles = filter === "All Categories"
        ? articles
        : articles.filter(article => article.category === filter);

    return (
        <section className="news-section" aria-labelledby="news-feed-heading">
            <div className="section-header">
                <div className="header-content">
                    <h2 id="news-feed-heading">Latest News Online</h2>
                    <p>Stay updated with trending stories</p>
                </div>
                <div className="header-actions">
                    <button
                        className="view-all"
                        onClick={() => setFilter("All Categories")}
                        aria-label="View all news"
                    >
                        View All News
                    </button>
                    <select
                        className="category-filter"
                        aria-label="Filter news by category"
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                    >
                        <option>All Categories</option>
                        <option>Technology</option>
                        <option>Science</option>
                        <option>Business</option>
                        <option>Politics</option>
                    </select>
                </div>
            </div>

            <div className="news-grid" role="list">
                {filteredArticles.map(article => (
                    <article
                        key={article.id}
                        className={`news-card ${article.trending ? 'trending' : ''}`}
                        role="listitem"
                        tabIndex={0}
                        aria-label={`${article.title}, category ${article.category}`}
                    >
                        {article.trending && (
                            <div className="trending-badge" aria-label="Trending article">
                                <FiTrendingUp aria-hidden="true" /> Trending
                            </div>
                        )}
                        <div className="card-content">
                            <span className="category">{article.category}</span>
                            <h3>{article.title}</h3>
                            <p>{article.excerpt}</p>
                            <div className="card-footer">
                                <span className="time"><FiClock aria-hidden="true" /> {article.time}</span>
                                <button
                                    className="save-button"
                                    aria-label={`Save article titled ${article.title}`}
                                >
                                    <FiBookmark aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <style jsx>{`
                .news-section {
                  padding: 3rem 1rem;
                  max-width: 1200px;
                  margin: 0 auto;
                }
                .section-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-end;
                  margin-bottom: 2rem;
                  flex-wrap: wrap;
                }
                .header-content h2 {
                  margin: 0;
                }
                .view-all {
                  padding: 0.5rem 1rem;
                  background: #3b82f6;
                  color: white;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                  transition: background-color 0.3s;
                }
                .view-all:hover,
                .view-all:focus-visible {
                  background: #2563eb;
                  outline: none;
                }
                .category-filter {
                  padding: 0.5rem;
                  margin-left: 1rem;
                  border: 1px solid #e2e8f0;
                  border-radius: 4px;
                }
                .news-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                  gap: 1.5rem;
                }
                .news-card {
                  background: white;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                  position: relative;
                  cursor: pointer;
                  transition: box-shadow 0.3s;
                }
                .news-card:hover,
                .news-card:focus-within {
                  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                  outline: none;
                }
                .news-card.trending {
                  border-left: 3px solid #3b82f6;
                }
                .trending-badge {
                  position: absolute;
                  top: 10px;
                  right: 10px;
                  background: rgba(59, 130, 246, 0.9);
                  color: white;
                  padding: 0.25rem 0.5rem;
                  border-radius: 4px;
                  font-size: 0.8rem;
                  display: flex;
                  align-items: center;
                  gap: 0.25rem;
                }
                .card-content {
                  padding: 1.5rem;
                }
                .category {
                  display: inline-block;
                  background: #e0e7ff;
                  color: #3b82f6;
                  padding: 0.25rem 0.5rem;
                  border-radius: 4px;
                  margin-bottom: 0.5rem;
                  font-size: 0.8rem;
                }
                .card-footer {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-top: 1rem;
                  color: #64748b;
                  font-size: 0.9rem;
                }
                .time {
                  display: flex;
                  align-items: center;
                  gap: 0.25rem;
                }
                .save-button {
                  background: none;
                  border: none;
                  color: #64748b;
                  cursor: pointer;
                  transition: color 0.3s;
                }
                .save-button:hover,
                .save-button:focus-visible {
                  color: #3b82f6;
                  outline: none;
                }
            `}</style>
        </section>
    );
};

export default NewsFeed;
