import { FiBookOpen, FiVideo, FiAward, FiBarChart2 } from 'react-icons/fi';
import Head from 'next/head';
import { useMemo } from 'react';

const OnlineLearning = () => {
    const platforms = useMemo(() => [
        {
            name: "Interactive Courses",
            icon: <FiBookOpen aria-hidden="true" />,
            count: 245,
            description: "Structured learning paths with quizzes"
        },
        {
            name: "Video Tutorials",
            icon: <FiVideo aria-hidden="true" />,
            count: 1200,
            description: "Short, focused video lessons"
        },
        {
            name: "Certification Programs",
            icon: <FiAward aria-hidden="true" />,
            count: 38,
            description: "Earn accredited certifications"
        },
        {
            name: "Skill Assessments",
            icon: <FiBarChart2 aria-hidden="true" />,
            count: null,
            description: "Test and benchmark your skills"
        }
    ], []);

    return (
        <>
            <Head>
                <title>Online Learning & Skill Development | YourSite</title>
                <meta
                    name="description"
                    content="Advance your career with interactive courses, video tutorials, certification programs, and skill assessments."
                />
                <meta name="robots" content="index, follow" />
            </Head>

            {/* AdSense top placeholder */}
            <div className="my-6 flex justify-center">
                {/* Replace with your AdSense code */}
                {/* <ins className="adsbygoogle"
          style={{ display: 'block', width: '728px', height: '90px' }}
          data-ad-client="ca-pub-xxxxxxxxxxxx"
          data-ad-slot="xxxxxxxxxx"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script> */}
            </div>

            <section
                className="learning-section bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12 px-4"
                aria-label="Online learning and skill development offerings"
            >
                <header className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl font-extrabold mb-3">Online Learning & Skill Development</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Advance your career with our comprehensive learning resources
                    </p>
                </header>

                <div className="platform-grid max-w-7xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                    {platforms.map(({ name, icon, count, description }, idx) => (
                        <article
                            key={idx}
                            className="platform-card bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col items-center text-center transition hover:shadow-xl"
                            tabIndex={0}
                            aria-label={`${name} platform, ${count ?? ''} items`}
                            role="region"
                        >
                            <div className="platform-icon mb-4 text-4xl text-blue-500 dark:text-blue-400">
                                {icon}
                            </div>
                            <h2 className="text-xl font-semibold mb-2">{name}</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
                            {count !== null && (
                                <div
                                    className="count-badge inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium mb-4 text-sm"
                                    aria-label={`${count} available`}
                                >
                                    {count}+ available
                                </div>
                            )}
                            <button
                                className="access-button w-full py-2 border border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-md font-semibold hover:bg-blue-50 dark:hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                aria-label={`Browse ${name.toLowerCase()}`}
                            >
                                Browse {name.toLowerCase()}
                            </button>
                        </article>
                    ))}
                </div>

                <div className="cta-section max-w-3xl mx-auto mt-16 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to start learning?</h2>
                    <div className="cta-buttons flex justify-center gap-6">
                        <button
                            className="primary-cta px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition focus:outline-none focus:ring-4 focus:ring-blue-500"
                            aria-label="Create a free account"
                        >
                            Create Free Account
                        </button>
                        <button
                            className="secondary-cta px-6 py-3 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition focus:outline-none focus:ring-4 focus:ring-blue-500"
                            aria-label="Explore all courses"
                        >
                            Explore All Courses
                        </button>
                    </div>
                </div>
            </section>

            {/* AdSense bottom placeholder */}
            <div className="my-12 flex justify-center">
                {/* Replace with your AdSense code */}
                {/* <ins className="adsbygoogle"
          style={{ display: 'block', width: '728px', height: '90px' }}
          data-ad-client="ca-pub-xxxxxxxxxxxx"
          data-ad-slot="xxxxxxxxxx"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script> */}
            </div>

            <style jsx>{`
        .platform-grid {
          /* already handled by Tailwind grid */
        }
        .learning-section :global(.platform-card:focus) {
          outline: none;
          box-shadow: 0 0 0 3px rgb(59 130 246 / 0.6);
          border-radius: 8px;
        }
      `}</style>
        </>
    );
};

export default OnlineLearning;
