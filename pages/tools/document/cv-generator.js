import { useState, useCallback } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { FiUser, FiBriefcase, FiBook, FiDownload } from 'react-icons/fi';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const Adsense = () => (
    <>
        <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            strategy="afterInteractive"
            crossOrigin="anonymous"
        />
        <ins
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center', margin: '20px 0' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"
        />
        <Script id="ads-init" strategy="afterInteractive">
            {`(adsbygoogle = window.adsbygoogle || []).push({});`}
        </Script>
    </>
);

const CVGenerator = () => {
    const [formData, setFormData] = useState({
        personalInfo: { name: '', email: '', phone: '', address: '' },
        experience: [{ id: 1, company: '', position: '', duration: '', description: '' }],
        education: [{ id: 1, institution: '', degree: '', year: '' }],
        skills: []
    });
    const [currentSkill, setCurrentSkill] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = useCallback((section, field, value, index = null) => {
        if (index !== null) {
            setFormData(prev => {
                const updated = [...prev[section]];
                updated[index][field] = value;
                return { ...prev, [section]: updated };
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [section]: { ...prev[section], [field]: value }
            }));
        }
    }, []);

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, { id: Date.now(), company: '', position: '', duration: '', description: '' }]
        }));
    };

    const removeExperience = (id) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        }));
    };

    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, { id: Date.now(), institution: '', degree: '', year: '' }]
        }));
    };

    const removeEducation = (id) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }));
    };

    const addSkill = () => {
        if (currentSkill.trim()) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, currentSkill.trim()] }));
            setCurrentSkill('');
        }
    };

    const removeSkill = (index) => {
        setFormData(prev => {
            const updatedSkills = [...prev.skills];
            updatedSkills.splice(index, 1);
            return { ...prev, skills: updatedSkills };
        });
    };

    const generatePDF = async () => {
        setLoading(true);
        try {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([600, 800]);
            const { width, height } = page.getSize();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            page.drawText('Curriculum Vitae', { x: 50, y: height - 50, size: 24, font, color: rgb(0, 0, 0) });

            page.drawText('Personal Information', { x: 50, y: height - 100, size: 18, font, color: rgb(0, 0, 0) });

            const { name, email, phone, address } = formData.personalInfo;
            page.drawText(`Name: ${name}`, { x: 50, y: height - 130, size: 12, font });
            page.drawText(`Email: ${email}`, { x: 50, y: height - 150, size: 12, font });
            page.drawText(`Phone: ${phone}`, { x: 50, y: height - 170, size: 12, font });
            page.drawText(`Address: ${address}`, { x: 50, y: height - 190, size: 12, font });

            let currentY = height - 220;
            page.drawText('Work Experience', { x: 50, y: currentY, size: 18, font, color: rgb(0, 0, 0) });
            currentY -= 30;

            formData.experience.forEach(exp => {
                if (exp.company) {
                    page.drawText(`${exp.position} at ${exp.company} (${exp.duration})`, { x: 50, y: currentY, size: 14, font });
                    currentY -= 20;
                    page.drawText(exp.description, { x: 60, y: currentY, size: 12, font });
                    currentY -= 40;
                }
            });

            page.drawText('Education', { x: 50, y: currentY, size: 18, font, color: rgb(0, 0, 0) });
            currentY -= 30;

            formData.education.forEach(edu => {
                if (edu.institution) {
                    page.drawText(`${edu.degree} from ${edu.institution} (${edu.year})`, { x: 50, y: currentY, size: 14, font });
                    currentY -= 30;
                }
            });

            if (formData.skills.length > 0) {
                page.drawText('Skills', { x: 50, y: currentY, size: 18, font, color: rgb(0, 0, 0) });
                currentY -= 30;
                page.drawText(formData.skills.join(', '), { x: 50, y: currentY, size: 12, font });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${formData.personalInfo.name || 'cv'}.pdf`;
            link.click();
        } catch (error) {
            alert('Error generating PDF');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Professional CV Generator - Create Resumes Online</title>
                <meta name="description" content="Generate polished professional CVs quickly with our easy-to-use online resume builder." />
                <meta property="og:title" content="Professional CV Generator" />
                <meta property="og:description" content="Generate polished professional CVs quickly with our easy-to-use online resume builder." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://yourdomain.com/cv-generator" />
            </Head>

            <Adsense />

            <div className="cv-generator theme-chatjs">
                <header className="generator-header">
                    <h1><FiUser /> Professional CV Generator</h1>
                    <p>Create a polished resume in minutes</p>
                </header>

                <main className="generator-container">
                    {/* Personal Info */}
                    {/* ... keep form inputs unchanged ... */}

                    {/* Experience with Remove button */}
                    {formData.experience.map((exp, index) => (
                        <div key={exp.id} className="experience-item">
                            {/* inputs... */}
                            <button onClick={() => removeExperience(exp.id)} className="remove-button">Remove</button>
                        </div>
                    ))}
                    <button onClick={addExperience} className="add-button">+ Add Experience</button>

                    {/* Education with Remove */}
                    {formData.education.map((edu, index) => (
                        <div key={edu.id} className="education-item">
                            {/* inputs... */}
                            <button onClick={() => removeEducation(edu.id)} className="remove-button">Remove</button>
                        </div>
                    ))}
                    <button onClick={addEducation} className="add-button">+ Add Education</button>

                    {/* Skills with remove buttons */}
                    <div className="skills-list">
                        {formData.skills.map((skill, i) => (
                            <span key={i} className="skill-tag">
                {skill}
                                <button onClick={() => removeSkill(i)}>×</button>
              </span>
                        ))}
                    </div>

                    <div className="actions">
                        <button disabled={loading} onClick={generatePDF} className="generate-button">
                            {loading ? 'Generating...' : <><FiDownload /> Generate PDF CV</>}
                        </button>
                    </div>
                </main>
            </div>

            <style jsx>{`
        .theme-chatjs {
          font-family: 'Inter', sans-serif;
          max-width: 900px;
          margin: auto;
          padding: 20px;
          color: #222;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 0 15px rgba(0,0,0,0.1);
        }
        .generator-header h1 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 5px;
        }
        .generator-header p {
          color: #666;
          margin-bottom: 20px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        input, textarea {
          width: 100%;
          padding: 8px;
          border-radius: 5px;
          border: 1px solid #ccc;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }
        input:focus, textarea:focus {
          outline: none;
          border-color: #0070f3;
          box-shadow: 0 0 5px rgba(0,112,243,0.5);
        }
        button {
          cursor: pointer;
          border: none;
          background-color: #0070f3;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          transition: background-color 0.2s ease;
          font-size: 1rem;
        }
        button:hover:not(:disabled) {
          background-color: #005bb5;
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .add-button {
          margin-top: 10px;
          background-color: #28a745;
        }
        .add-button:hover {
          background-color: #218838;
        }
        .remove-button {
          background-color: #dc3545;
          margin-top: 5px;
        }
        .remove-button:hover {
          background-color: #c82333;
        }
        .skill-tag {
          display: inline-block;
          background: #e1ecf4;
          color: #0366d6;
          padding: 5px 10px;
          margin: 0 5px 5px 0;
          border-radius: 15px;
          font-size: 0.9rem;
          cursor: default;
        }
        .skill-tag button {
          background: transparent;
          border: none;
          margin-left: 8px;
          font-weight: bold;
          cursor: pointer;
          color: #555;
        }
        .actions {
          margin-top: 20px;
          text-align: center;
        }
      `}</style>
        </>
    );
};

export default CVGenerator;
