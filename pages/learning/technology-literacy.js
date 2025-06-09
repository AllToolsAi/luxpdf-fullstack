import { FiCode, FiCpu, FiCloud, FiShield } from 'react-icons/fi';

const TechnologyLiteracy = () => {
    const resources = [
        {
            title: "Coding Fundamentals",
            icon: <FiCode />,
            description: "Learn basic programming concepts applicable across all languages",
            link: "/learn/coding-fundamentals"
        },
        {
            title: "AI Essentials",
            icon: <FiCpu />,
            description: "Understand how artificial intelligence impacts daily life",
            link: "/learn/ai-essentials"
        },
        {
            title: "Cloud Computing",
            icon: <FiCloud />,
            description: "Master cloud storage and computing services",
            link: "/learn/cloud-computing"
        },
        {
            title: "Digital Security",
            icon: <FiShield />,
            description: "Protect yourself from online threats and scams",
            link: "/learn/digital-security"
        }
    ];

    return (
        <section className="literacy-section">
            <div className="section-header">
                <h2>Technology & Digital Literacy</h2>
                <p>Essential skills for navigating the digital world</p>
            </div>

            <div className="resource-grid">
                {resources.map((resource, index) => (
                    <a key={index} href={resource.link} className="resource-card">
                        <div className="card-icon">{resource.icon}</div>
                        <h3>{resource.title}</h3>
                        <p>{resource.description}</p>
                        <span className="cta">Start Learning →</span>
                    </a>
                ))}
            </div>

            <style jsx>{`
        .literacy-section {
          padding: 3rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .resource-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        .resource-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: transform 0.2s;
          color: inherit;
          text-decoration: none;
        }
        .resource-card:hover {
          transform: translateY(-5px);
        }
        .card-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #3b82f6;
        }
        .cta {
          color: #3b82f6;
          font-weight: 500;
          display: inline-block;
          margin-top: 1rem;
        }
      `}</style>
        </section>
    );
};