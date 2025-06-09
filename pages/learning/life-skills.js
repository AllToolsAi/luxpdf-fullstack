import { FiHome, FiDollarSign, FiHeart, FiUsers } from 'react-icons/fi';

const LifeSkills = () => {
    const skills = [
        {
            title: "Home Maintenance",
            icon: <FiHome />,
            tutorials: 12,
            popular: true
        },
        {
            title: "Personal Finance",
            icon: <FiDollarSign />,
            tutorials: 18,
            popular: true
        },
        {
            title: "Health & Wellness",
            icon: <FiHeart />,
            tutorials: 9,
            popular: false
        },
        {
            title: "Social Skills",
            icon: <FiUsers />,
            tutorials: 7,
            popular: false
        }
    ];

    return (
        <section className="skills-section">
            <div className="section-header">
                <h2>Everyday Life & Practical Skills</h2>
                <p>Master essential skills for daily living</p>
            </div>

            <div className="skills-container">
                {skills.map((skill, index) => (
                    <div key={index} className={`skill-card ${skill.popular ? 'popular' : ''}`}>
                        <div className="skill-icon">{skill.icon}</div>
                        <h3>{skill.title}</h3>
                        <p>{skill.tutorials} video tutorials</p>
                        {skill.popular && <span className="popular-badge">Most Popular</span>}
                        <button className="explore-button">Explore Skills</button>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .skills-section {
          padding: 3rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .skills-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        .skill-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          position: relative;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }
        .skill-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .skill-card.popular {
          border-top: 3px solid #3b82f6;
        }
        .skill-icon {
          font-size: 1.8rem;
          color: #3b82f6;
          margin-bottom: 1rem;
        }
        .popular-badge {
          position: absolute;
          top: -10px;
          right: 15px;
          background: #3b82f6;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
        }
        .explore-button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #e0e7ff;
          color: #3b82f6;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
        </section>
    );
};