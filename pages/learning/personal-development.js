import { FiTarget, FiBook, FiActivity, FiAward } from 'react-icons/fi';

const PersonalDevelopment = () => {
    const courses = [
        {
            title: "Goal Setting Mastery",
            icon: <FiTarget />,
            progress: 65,
            duration: "4 weeks",
            category: "Productivity"
        },
        {
            title: "Mindful Communication",
            icon: <FiBook />,
            progress: 30,
            duration: "6 weeks",
            category: "Relationships"
        },
        {
            title: "Habit Formation",
            icon: <FiActivity />,
            progress: 80,
            duration: "3 weeks",
            category: "Psychology"
        },
        {
            title: "Leadership Skills",
            icon: <FiAward />,
            progress: 45,
            duration: "8 weeks",
            category: "Career"
        }
    ];

    return (
        <section className="development-section">
            <div className="section-header">
                <h2>Personal Development & Self-Improvement</h2>
                <p>Transform your life through continuous learning</p>
            </div>

            <div className="course-grid">
                {courses.map((course, index) => (
                    <div key={index} className="course-card">
                        <div className="card-header">
                            <div className="card-icon">{course.icon}</div>
                            <span className="category">{course.category}</span>
                        </div>
                        <h3>{course.title}</h3>
                        <p>{course.duration} program</p>

                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${course.progress}%` }}></div>
                            <span>{course.progress}% complete</span>
                        </div>

                        <button className="resume-button">
                            {course.progress > 0 ? "Continue Course" : "Start Course"}
                        </button>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .development-section {
          padding: 3rem 1rem;
          background: #f8fafc;
        }
        .course-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .course-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .card-icon {
          font-size: 1.5rem;
          color: #3b82f6;
        }
        .category {
          background: #e0e7ff;
          color: #3b82f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        .progress-container {
          margin: 1.5rem 0;
        }
        .progress-bar {
          height: 6px;
          background: #3b82f6;
          border-radius: 3px;
          margin-bottom: 0.5rem;
        }
        .resume-button {
          width: 100%;
          padding: 0.75rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
        </section>
    );
};