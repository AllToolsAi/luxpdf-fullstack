import { useState, useCallback } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { FiUser, FiBriefcase, FiBook, FiDownload, FiSun, FiMoon } from 'react-icons/fi';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const CVGenerator = () => {
    const [formData, setFormData] = useState({
        personalInfo: { name: '', email: '', phone: '', address: '' },
        experience: [{ id: 1, company: '', position: '', duration: '', description: '' }],
        education: [{ id: 1, institution: '', degree: '', year: '' }],
        skills: [],
    });
    const [currentSkill, setCurrentSkill] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => setDarkMode((d) => !d);

    const handleInputChange = useCallback((section, field, value, index = null) => {
        if (index !== null) {
            setFormData((prev) => {
                const updatedArray = [...prev[section]];
                updatedArray[index] = { ...updatedArray[index], [field]: value };
                return { ...prev, [section]: updatedArray };
            });
        } else {
            setFormData((prev) => ({
                ...prev,
                [section]: { ...prev[section], [field]: value },
            }));
        }
    }, []);

    const addExperience = useCallback(() => {
        setFormData((prev) => ({
            ...prev,
            experience: [
                ...prev.experience,
                { id: Date.now(), company: '', position: '', duration: '', description: '' },
            ],
        }));
    }, []);

    const addEducation = useCallback(() => {
        setFormData((prev) => ({
            ...prev,
            education: [...prev.education, { id: Date.now(), institution: '', degree: '', year: '' }],
        }));
    }, []);

    const addSkill = useCallback(() => {
        if (currentSkill.trim()) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, currentSkill.trim()],
            }));
            setCurrentSkill('');
        }
    }, [currentSkill]);

    // Helper to split long text into chunks for pdf-lib (approximate wrapping)
    const splitText = (text, maxChars = 90) => {
        if (!text) return [];
        const lines = [];
        for (let i = 0; i < text.length; i += maxChars) {
            lines.push(text.slice(i, i + maxChars));
        }
        return lines;
    };

    const generatePDF = async () => {
        if (!formData.personalInfo.name) {
            alert('Please enter your name before generating the CV.');
            return;
        }

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        let currentY = height - 50;
        const lineHeight = 18;

        const drawTextLine = (text, options = {}) => {
            page.drawText(text, { x: 50, y: currentY, size: 14, font, color: rgb(0, 0, 0), ...options });
            currentY -= lineHeight;
        };

        // Title
        page.drawText('Curriculum Vitae', { x: 50, y: currentY, size: 24, font });
        currentY -= 40;

        // Personal Info
        drawTextLine('Personal Information', { size: 18 });
        const { name, email, phone, address } = formData.personalInfo;
        const personalLines = [
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            `Address: ${address}`,
        ];
        personalLines.forEach((line) => drawTextLine(line, { size: 12 }));

        currentY -= 20;

        // Experience
        drawTextLine('Work Experience', { size: 18 });
        currentY -= 10;

        formData.experience.forEach(({ company, position, duration, description }) => {
            if (company || position) {
                drawTextLine(`${position} at ${company} (${duration})`, { size: 14 });
                splitText(description).forEach((descLine) => drawTextLine(descLine, { size: 12, x: 60 }));
                currentY -= 10;
            }
        });

        // Education
        drawTextLine('Education', { size: 18 });
        currentY -= 10;
        formData.education.forEach(({ institution, degree, year }) => {
            if (institution) {
                drawTextLine(`${degree} from ${institution} (${year})`, { size: 14 });
            }
        });

        currentY -= 20;

        // Skills
        if (formData.skills.length) {
            drawTextLine('Skills', { size: 18 });
            const skillsStr = formData.skills.join(', ');
            splitText(skillsStr).forEach((line) => drawTextLine(line, { size: 12 }));
        }

        // Save and download
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${name || 'cv'}.pdf`;
        link.click();
    };

    return (
        <>
            <Head>
                <title>Professional CV Generator | Create Your Resume</title>
                <meta name="description" content="Create a polished resume quickly and easily with our professional CV generator." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {/* Add any other SEO tags you want here */}
            </Head>

            {/* Google AdSense Script */}
            <Script
                strategy="afterInteractive"
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
                crossOrigin="anonymous"
            />
            <Script id="adsense-init" strategy="afterInteractive">
                {`
          (adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "ca-pub-xxxxxxxxxxxxxxxx",
            enable_page_level_ads: true
          });
        `}
            </Script>

            <div className={`min-h-screen p-6 max-w-5xl mx-auto transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                <header className="flex justify-between items-center mb-8">
                    <h1 className="flex items-center space-x-2 text-3xl font-bold">
                        <FiUser /> <span>Professional CV Generator</span>
                    </h1>
                    <button
                        onClick={toggleDarkMode}
                        aria-label="Toggle Dark Mode"
                        className="text-xl focus:outline-none"
                    >
                        {darkMode ? <FiSun /> : <FiMoon />}
                    </button>
                </header>

                <p className="mb-6 text-lg">Create a polished resume in minutes</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[75vh] overflow-y-auto pr-4">
                    {/* Personal Info */}
                    <section>
                        <h2 className="flex items-center space-x-2 text-2xl mb-4 font-semibold">
                            <FiUser />
                            <span>Personal Information</span>
                        </h2>
                        {['name', 'email', 'phone', 'address'].map((field) => (
                            <div key={field} className="mb-4">
                                <label htmlFor={`personal-${field}`} className="block mb-1 font-medium">
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>
                                <input
                                    id={`personal-${field}`}
                                    type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                                    className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 ${
                                        darkMode ? 'bg-gray-800 border-gray-700 focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-600'
                                    }`}
                                    value={formData.personalInfo[field]}
                                    onChange={(e) => handleInputChange('personalInfo', field, e.target.value)}
                                    autoComplete="off"
                                    tabIndex={0}
                                />
                            </div>
                        ))}
                    </section>

                    {/* Work Experience */}
                    <section>
                        <h2 className="flex items-center space-x-2 text-2xl mb-4 font-semibold">
                            <FiBriefcase />
                            <span>Work Experience</span>
                        </h2>
                        {formData.experience.map((exp, i) => (
                            <div key={exp.id} className="mb-6 border-b pb-4 last:border-none">
                                {['company', 'position', 'duration'].map((field) => (
                                    <div key={field} className="mb-3">
                                        <label htmlFor={`exp-${field}-${exp.id}`} className="block mb-1 font-medium">
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </label>
                                        <input
                                            id={`exp-${field}-${exp.id}`}
                                            type="text"
                                            className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 ${
                                                darkMode ? 'bg-gray-800 border-gray-700 focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-600'
                                            }`}
                                            value={exp[field]}
                                            onChange={(e) => handleInputChange('experience', field, e.target.value, i)}
                                            tabIndex={0}
                                        />
                                    </div>
                                ))}
                                <div className="mb-3">
                                    <label htmlFor={`exp-description-${exp.id}`} className="block mb-1 font-medium">
                                        Description
                                    </label>
                                    <textarea
                                        id={`exp-description-${exp.id}`}
                                        className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 resize-y ${
                                            darkMode ? 'bg-gray-800 border-gray-700 focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-600'
                                        }`}
                                        value={exp.description}
                                        onChange={(e) => handleInputChange('experience', 'description', e.target.value, i)}
                                        rows={3}
                                        tabIndex={0}
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addExperience}
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none"
                            type="button"
                        >
                            + Add Experience
                        </button>
                    </section>

                    {/* Education */}
                    <section>
                        <h2 className="flex items-center space-x-2 text-2xl mb-4 font-semibold">
                            <FiBook />
                            <span>Education</span>
                        </h2>
                        {formData.education.map((edu, i) => (
                            <div key={edu.id} className="mb-6 border-b pb-4 last:border-none">
                                {['institution', 'degree', 'year'].map((field) => (
                                    <div key={field} className="mb-3">
                                        <label htmlFor={`edu-${field}-${edu.id}`} className="block mb-1 font-medium">
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </label>
                                        <input
                                            id={`edu-${field}-${edu.id}`}
                                            type={field === 'year' ? 'number' : 'text'}
                                            className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 ${
                                                darkMode ? 'bg-gray-800 border-gray-700 focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-600'
                                            }`}
                                            value={edu[field]}
                                            onChange={(e) => handleInputChange('education', field, e.target.value, i)}
                                            tabIndex={0}
                                            min={1900}
                                            max={new Date().getFullYear() + 10}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                        <button
                            onClick={addEducation}
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none"
                            type="button"
                        >
                            + Add Education
                        </button>
                    </section>
                </div>

                {/* Skills Section */}
                <section className="mt-8">
                    <h2 className="text-2xl mb-4 font-semibold">Skills</h2>
                    <div className="flex space-x-2 mb-4">
                        <input
                            type="text"
                            placeholder="Add a skill"
                            className={`flex-grow rounded border px-3 py-2 focus:outline-none focus:ring-2 ${
                                darkMode ? 'bg-gray-800 border-gray-700 focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-600'
                            }`}
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addSkill();
                                }
                            }}
                            tabIndex={0}
                        />
                        <button
                            onClick={addSkill}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none"
                            type="button"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                            <span
                                key={index}
                                className={`inline-flex items-center bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-medium`}
                            >
                {skill}
                                <button
                                    type="button"
                                    aria-label={`Remove skill ${skill}`}
                                    onClick={() => {
                                        setFormData((prev) => {
                                            const newSkills = [...prev.skills];
                                            newSkills.splice(index, 1);
                                            return { ...prev, skills: newSkills };
                                        });
                                    }}
                                    className="ml-2 focus:outline-none hover:text-gray-200"
                                >
                  ×
                </button>
              </span>
                        ))}
                    </div>
                </section>

                <div className="mt-10 flex justify-center">
                    <button
                        onClick={generatePDF}
                        className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-lg font-semibold focus:outline-none"
                        type="button"
                    >
                        <FiDownload />
                        <span>Generate PDF CV</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default CVGenerator;
