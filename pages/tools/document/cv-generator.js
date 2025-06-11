'use client';

import { useState, useCallback } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';
import { FiUser, FiBriefcase, FiBook, FiDownload, FiPlus, FiTrash2, FiInfo } from 'react-icons/fi';

export default function CVGenerator() {
    const [formData, setFormData] = useState({
        personalInfo: {
            name: '',
            email: '',
            phone: '',
            address: '',
            summary: ''
        },
        experience: [{
            id: Date.now(),
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: ''
        }],
        education: [{
            id: Date.now(),
            institution: '',
            degree: '',
            field: '',
            startYear: '',
            endYear: ''
        }],
        skills: []
    });
    const [currentSkill, setCurrentSkill] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = useCallback((section, field, value, index = null) => {
        if (index !== null) {
            setFormData(prev => {
                const updated = [...prev[section]];
                updated[index] = { ...updated[index], [field]: value };
                return { ...prev, [section]: updated };
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [section]: { ...prev[section], [field]: value }
            }));
        }
    }, []);

    const addSection = (section) => {
        const newItem = section === 'experience'
            ? { id: Date.now(), company: '', position: '', startDate: '', endDate: '', description: '' }
            : { id: Date.now(), institution: '', degree: '', field: '', startYear: '', endYear: '' };

        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], newItem]
        }));
    };

    const removeSection = (section, id) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== id)
        }));
    };

    const handleSkillAdd = () => {
        if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, currentSkill.trim()]
            }));
            setCurrentSkill('');
        }
    };

    const removeSkill = (index) => {
        setFormData(prev => {
            const updated = [...prev.skills];
            updated.splice(index, 1);
            return { ...prev, skills: updated };
        });
    };

    const generatePDF = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([600, 800]);
            const { width, height } = page.getSize();
            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

            // Title
            page.drawText('Curriculum Vitae', {
                x: 50,
                y: height - 50,
                size: 24,
                font,
                color: rgb(0, 0, 0)
            });

            // Personal Info Section
            let yPosition = height - 100;
            page.drawText('Personal Information', {
                x: 50,
                y: yPosition,
                size: 18,
                font,
                color: rgb(0, 0, 0)
            });
            yPosition -= 30;

            const { name, email, phone, address, summary } = formData.personalInfo;
            if (name) {
                page.drawText(`Name: ${name}`, {
                    x: 50,
                    y: yPosition,
                    size: 12,
                    font: regularFont
                });
                yPosition -= 20;
            }
            if (email) {
                page.drawText(`Email: ${email}`, {
                    x: 50,
                    y: yPosition,
                    size: 12,
                    font: regularFont
                });
                yPosition -= 20;
            }
            if (phone) {
                page.drawText(`Phone: ${phone}`, {
                    x: 50,
                    y: yPosition,
                    size: 12,
                    font: regularFont
                });
                yPosition -= 20;
            }
            if (address) {
                page.drawText(`Address: ${address}`, {
                    x: 50,
                    y: yPosition,
                    size: 12,
                    font: regularFont
                });
                yPosition -= 20;
            }
            if (summary) {
                page.drawText('Summary:', {
                    x: 50,
                    y: yPosition,
                    size: 14,
                    font
                });
                yPosition -= 20;
                page.drawText(summary, {
                    x: 60,
                    y: yPosition,
                    size: 12,
                    font: regularFont,
                    maxWidth: width - 100
                });
                yPosition -= 40;
            }

            // Experience Section
            if (formData.experience.some(exp => exp.company)) {
                page.drawText('Work Experience', {
                    x: 50,
                    y: yPosition,
                    size: 18,
                    font,
                    color: rgb(0, 0, 0)
                });
                yPosition -= 30;

                formData.experience.forEach(exp => {
                    if (exp.company) {
                        const positionText = `${exp.position}${exp.company ? ` at ${exp.company}` : ''}`;
                        const dateText = `${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ''}`;

                        page.drawText(positionText, {
                            x: 50,
                            y: yPosition,
                            size: 14,
                            font
                        });

                        if (dateText) {
                            page.drawText(dateText, {
                                x: width - 150,
                                y: yPosition,
                                size: 12,
                                font: regularFont
                            });
                        }

                        yPosition -= 20;

                        if (exp.description) {
                            page.drawText(exp.description, {
                                x: 60,
                                y: yPosition,
                                size: 12,
                                font: regularFont,
                                maxWidth: width - 100
                            });
                            yPosition -= 40;
                        } else {
                            yPosition -= 20;
                        }
                    }
                });
            }

            // Education Section
            if (formData.education.some(edu => edu.institution)) {
                page.drawText('Education', {
                    x: 50,
                    y: yPosition,
                    size: 18,
                    font,
                    color: rgb(0, 0, 0)
                });
                yPosition -= 30;

                formData.education.forEach(edu => {
                    if (edu.institution) {
                        const degreeText = `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`;
                        const institutionText = `at ${edu.institution}`;
                        const dateText = `${edu.startYear}${edu.endYear ? ` - ${edu.endYear}` : ''}`;

                        page.drawText(degreeText, {
                            x: 50,
                            y: yPosition,
                            size: 14,
                            font
                        });

                        page.drawText(institutionText, {
                            x: 60,
                            y: yPosition - 20,
                            size: 12,
                            font: regularFont
                        });

                        if (dateText) {
                            page.drawText(dateText, {
                                x: width - 150,
                                y: yPosition,
                                size: 12,
                                font: regularFont
                            });
                        }

                        yPosition -= 40;
                    }
                });
            }

            // Skills Section
            if (formData.skills.length > 0) {
                page.drawText('Skills', {
                    x: 50,
                    y: yPosition,
                    size: 18,
                    font,
                    color: rgb(0, 0, 0)
                });
                yPosition -= 30;

                page.drawText(formData.skills.join(', '), {
                    x: 60,
                    y: yPosition,
                    size: 12,
                    font: regularFont,
                    maxWidth: width - 100
                });
            }

            const pdfBytes = await pdfDoc.save();
            saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), `${name || 'cv'}.pdf`);

        } catch (err) {
            console.error('PDF generation error:', err);
            setError('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Layout>
            <SEO
                title="Professional CV Generator | Create Free Resumes Online"
                description="Create polished professional resumes in minutes with our free CV generator. Download as PDF instantly."
                keywords="cv generator, resume builder, free cv maker, professional resume, pdf cv creator"
                canonical="https://yourdomain.com/tools/document/cv-generator"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }}
            />

            <section className="py-16 bg-background dark:bg-gray-900 min-h-[80vh]">
                <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr_100px] max-w-screen-xl mx-auto px-4 gap-6">
                    {/* Left Ad */}
                    <div className="hidden lg:block">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block' }}
                            data-ad-client={adsenseConfig.client}
                            data-ad-slot={adsenseConfig.slot}
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        />
                    </div>

                    {/* Main Content */}
                    <main>
                        <h1 className="text-4xl font-bold text-center text-primary dark:text-white mb-4">
                            <FiUser className="inline mr-2" /> Professional CV Generator
                        </h1>
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                            Create a polished professional resume in minutes. Fill in your details and download as PDF.
                        </p>

                        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg max-w-4xl mx-auto space-y-8">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
                                    <FiUser className="mr-2" /> Personal Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name*</label>
                                        <input
                                            type="text"
                                            value={formData.personalInfo.name}
                                            onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email*</label>
                                        <input
                                            type="email"
                                            value={formData.personalInfo.email}
                                            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            value={formData.personalInfo.phone}
                                            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                                        <input
                                            type="text"
                                            value={formData.personalInfo.address}
                                            onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Professional Summary</label>
                                    <textarea
                                        value={formData.personalInfo.summary}
                                        onChange={(e) => handleInputChange('personalInfo', 'summary', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                        placeholder="Briefly describe your professional background and skills..."
                                    />
                                </div>
                            </div>

                            {/* Work Experience */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
                                        <FiBriefcase className="mr-2" /> Work Experience
                                    </h2>
                                    <button
                                        onClick={() => addSection('experience')}
                                        className="flex items-center text-sm text-primary hover:text-primary-dark"
                                    >
                                        <FiPlus className="mr-1" /> Add Experience
                                    </button>
                                </div>

                                {formData.experience.map((exp, index) => (
                                    <div key={exp.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company*</label>
                                                <input
                                                    type="text"
                                                    value={exp.company}
                                                    onChange={(e) => handleInputChange('experience', 'company', e.target.value, index)}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position*</label>
                                                <input
                                                    type="text"
                                                    value={exp.position}
                                                    onChange={(e) => handleInputChange('experience', 'position', e.target.value, index)}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                                                <input
                                                    type="text"
                                                    value={exp.startDate}
                                                    onChange={(e) => handleInputChange('experience', 'startDate', e.target.value, index)}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                                    placeholder="MM/YYYY"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                                                <input
                                                    type="text"
                                                    value={exp.endDate}
                                                    onChange={(e) => handleInputChange('experience', 'endDate', e.target.value, index)}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                                    placeholder="MM/YYYY or Present"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                            <textarea
                                                value={exp.description}
                                                onChange={(e) => handleInputChange('experience', 'description', e.target.value, index)}
                                                rows={3}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                                placeholder="Describe your responsibilities and achievements..."
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeSection('experience', exp.id)}
                                            className="flex items-center text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            <FiTrash2 className="mr-1" /> Remove Experience
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Education */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
                                        <FiBook className="mr-2" /> Education
                                    </h2>
                                    <button
                                        onClick={() => addSection('education')}
                                        className="flex items-center text-sm text-primary hover:text-primary-dark"
                                    >
                                        <FiPlus className="mr-1" /> Add Education
                                    </button>
                                </div>

                                {formData.education.map((edu, index) => (
                                    <div key={edu.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Institution*</label>
                                                <input
                                                    type="text"
                                                    value={edu.institution}
                                                    onChange={(e) => handleInputChange('education', 'institution', e.target.value, index)}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Degree*</label>
                                                <input
                                                    type="text"
                                                    value={edu.degree}
                                                    onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Field of Study</label>
                                                <input
                                                    type="text"
                                                    value={edu.field}
                                                    onChange={(e) => handleInputChange('education', 'field', e.target.value, index)}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Year</label>
                                                    <input
                                                        type="text"
                                                        value={edu.startYear}
                                                        onChange={(e) => handleInputChange('education', 'startYear', e.target.value, index)}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                                        placeholder="YYYY"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Year</label>
                                                    <input
                                                        type="text"
                                                        value={edu.endYear}
                                                        onChange={(e) => handleInputChange('education', 'endYear', e.target.value, index)}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                                        placeholder="YYYY or Present"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeSection('education', edu.id)}
                                            className="flex items-center text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            <FiTrash2 className="mr-1" /> Remove Education
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Skills */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Skills</h2>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {formData.skills.map((skill, index) => (
                                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm">
                      {skill}
                                            <button
                                                onClick={() => removeSkill(index)}
                                                className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                                            >
                        ×
                      </button>
                    </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={currentSkill}
                                        onChange={(e) => setCurrentSkill(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSkillAdd()}
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                        placeholder="Add a skill (e.g. JavaScript, Project Management)"
                                    />
                                    <button
                                        onClick={handleSkillAdd}
                                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                                    >
                                        Add Skill
                                    </button>
                                </div>
                            </div>

                            {/* Generate Button */}
                            <div className="pt-4">
                                <button
                                    onClick={generatePDF}
                                    disabled={isGenerating || !formData.personalInfo.name || !formData.personalInfo.email}
                                    className={`w-full py-3 text-white rounded-md text-lg font-semibold transition-colors flex items-center justify-center ${
                                        isGenerating || !formData.personalInfo.name || !formData.personalInfo.email
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-primary hover:bg-primary-dark'
                                    }`}
                                >
                                    {isGenerating ? (
                                        'Generating CV...'
                                    ) : (
                                        <>
                                            <FiDownload className="mr-2" /> Generate & Download CV
                                        </>
                                    )}
                                </button>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-400">
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            {/* Tips Section */}
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm">
                                <h3 className="flex items-center font-medium text-blue-800 dark:text-blue-300 mb-2">
                                    <FiInfo className="mr-2" /> CV Writing Tips
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
                                    <li>Keep your professional summary concise (3-5 sentences)</li>
                                    <li>Use action verbs in experience descriptions ("Managed", "Developed", "Improved")</li>
                                    <li>List skills relevant to the job you're applying for</li>
                                    <li>Include quantifiable achievements where possible</li>
                                </ul>
                            </div>
                        </div>
                    </main>

                    {/* Right Ad */}
                    <div className="hidden lg:block">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block' }}
                            data-ad-client={adsenseConfig.client}
                            data-ad-slot={adsenseConfig.slot}
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        />
                    </div>
                </div>
            </section>
        </Layout>
    );
}