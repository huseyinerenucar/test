import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { engineeringFields } from '../../constants/engineeringFields';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  title: '',
  engineeringField: '',
  skills: '',
  experience: '',
  education: '',
  background: '',
  'OSYM siralamasi': '',
};

export default function UploadCV({ onAddCandidate }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [cvFile, setCvFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrors((prev) => ({ ...prev, cv: 'Only PDF files are accepted' }));
        return;
      }
      setCvFile(file);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.cv;
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.title.trim()) newErrors.title = 'Job title is required';
    if (!form.engineeringField) newErrors.engineeringField = 'Field is required';
    if (!form.experience.trim()) newErrors.experience = 'Experience is required';
    if (!form.education.trim()) newErrors.education = 'Education is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const candidate = {
      ...form,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      cvAttached: !!cvFile,
      cvFileName: cvFile?.name || null,
      pdfUrl: null,
      uploadDate: new Date().toISOString().split('T')[0],
      status: cvFile ? 'New' : 'Pending CV',
      'OSYM siralamasi': form['OSYM siralamasi'] ? Number(form['OSYM siralamasi']) : null,
    };

    onAddCandidate(candidate);
    setSubmitStatus('success');
    setTimeout(() => navigate('/'), 1500);
  };

  const inputStyle = (field) => ({
    backgroundColor: 'var(--bg-secondary)',
    border: `1px solid ${errors[field] ? '#ef4444' : 'var(--border-color)'}`,
    color: 'var(--text-primary)',
    outline: 'none',
  });

  const labelStyle = { color: 'var(--text-primary)' };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slide-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1 m-0" style={{ color: 'var(--text-primary)' }}>
          Upload Candidate
        </h1>
        <p className="text-sm m-0" style={{ color: 'var(--text-secondary)' }}>
          Add a new candidate to the tracking pipeline.
        </p>
      </div>

      {submitStatus === 'success' && (
        <div
          className="flex items-center gap-3 p-4 rounded-lg mb-6 animate-fade-in"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
        >
          <CheckCircle size={18} style={{ color: '#10b981' }} />
          <span className="text-sm font-medium" style={{ color: '#10b981' }}>
            Candidate added successfully! Redirecting...
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div
          className="rounded-xl border p-6 space-y-5"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
                Full Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Ahmet Yilmaz"
                className="focus-ring w-full px-3.5 py-2.5 rounded-lg text-sm transition-colors duration-200"
                style={inputStyle('name')}
                onFocus={(e) => { if (!errors.name) e.target.style.borderColor = 'var(--accent-primary)'; }}
                onBlur={(e) => { if (!errors.name) e.target.style.borderColor = 'var(--border-color)'; }}
              />
              {errors.name && (
                <p className="flex items-center gap-1 mt-1 text-xs m-0" style={{ color: '#ef4444' }}>
                  <AlertCircle size={12} /> {errors.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
                Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. ahmet@email.com"
                className="focus-ring w-full px-3.5 py-2.5 rounded-lg text-sm transition-colors duration-200"
                style={inputStyle('email')}
                onFocus={(e) => { if (!errors.email) e.target.style.borderColor = 'var(--accent-primary)'; }}
                onBlur={(e) => { if (!errors.email) e.target.style.borderColor = 'var(--border-color)'; }}
              />
              {errors.email && (
                <p className="flex items-center gap-1 mt-1 text-xs m-0" style={{ color: '#ef4444' }}>
                  <AlertCircle size={12} /> {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Phone & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. +90 532 111 2233"
                className="focus-ring w-full px-3.5 py-2.5 rounded-lg text-sm transition-colors duration-200"
                style={inputStyle('phone')}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
                Job Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Developer"
                className="focus-ring w-full px-3.5 py-2.5 rounded-lg text-sm transition-colors duration-200"
                style={inputStyle('title')}
                onFocus={(e) => { if (!errors.title) e.target.style.borderColor = 'var(--accent-primary)'; }}
                onBlur={(e) => { if (!errors.title) e.target.style.borderColor = 'var(--border-color)'; }}
              />
              {errors.title && (
                <p className="flex items-center gap-1 mt-1 text-xs m-0" style={{ color: '#ef4444' }}>
                  <AlertCircle size={12} /> {errors.title}
                </p>
              )}
            </div>
          </div>

          {/* Engineering Field & OSYM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
                Engineering Field <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="engineeringField"
                value={form.engineeringField}
                onChange={handleChange}
                className="focus-ring w-full px-3.5 py-2.5 rounded-lg text-sm transition-colors duration-200"
                style={{
                  ...inputStyle('engineeringField'),
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  paddingRight: '36px',
                }}
                onFocus={(e) => { if (!errors.engineeringField) e.target.style.borderColor = 'var(--accent-primary)'; }}
                onBlur={(e) => { if (!errors.engineeringField) e.target.style.borderColor = 'var(--border-color)'; }}
              >
                <option value="">Select a field</option>
                {engineeringFields.map((field) => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
              {errors.engineeringField && (
                <p className="flex items-center gap-1 mt-1 text-xs m-0" style={{ color: '#ef4444' }}>
                  <AlertCircle size={12} /> {errors.engineeringField}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
                OSYM Ranking
              </label>
              <input
                type="number"
                name="OSYM siralamasi"
                value={form['OSYM siralamasi']}
                onChange={handleChange}
                placeholder="e.g. 12500"
                className="focus-ring w-full px-3.5 py-2.5 rounded-lg text-sm transition-colors duration-200"
                style={inputStyle('OSYM siralamasi')}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
              Skills
            </label>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="Comma-separated: React, TypeScript, Node.js"
              className="focus-ring w-full px-3.5 py-2.5 rounded-lg text-sm transition-colors duration-200"
              style={inputStyle('skills')}
              onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
              Experience <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              name="experience"
              value={form.experience}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the candidate's professional experience..."
              className="focus-ring w-full px-3.5 py-2.5 rounded-lg text-sm transition-colors duration-200 resize-y"
              style={inputStyle('experience')}
              onFocus={(e) => { if (!errors.experience) e.target.style.borderColor = 'var(--accent-primary)'; }}
              onBlur={(e) => { if (!errors.experience) e.target.style.borderColor = 'var(--border-color)'; }}
            />
            {errors.experience && (
              <p className="flex items-center gap-1 mt-1 text-xs m-0" style={{ color: '#ef4444' }}>
                <AlertCircle size={12} /> {errors.experience}
              </p>
            )}
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
              Education <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              name="education"
              value={form.education}
              onChange={handleChange}
              placeholder="e.g. BSc Computer Engineering - METU"
              className="focus-ring w-full px-3.5 py-2.5 rounded-lg text-sm transition-colors duration-200"
              style={inputStyle('education')}
              onFocus={(e) => { if (!errors.education) e.target.style.borderColor = 'var(--accent-primary)'; }}
              onBlur={(e) => { if (!errors.education) e.target.style.borderColor = 'var(--border-color)'; }}
            />
            {errors.education && (
              <p className="flex items-center gap-1 mt-1 text-xs m-0" style={{ color: '#ef4444' }}>
                <AlertCircle size={12} /> {errors.education}
              </p>
            )}
          </div>

          {/* Background */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
              Background
            </label>
            <textarea
              name="background"
              value={form.background}
              onChange={handleChange}
              rows={3}
              placeholder="Additional background details..."
              className="focus-ring w-full px-3.5 py-2.5 rounded-lg text-sm transition-colors duration-200 resize-y"
              style={inputStyle('background')}
              onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
            />
          </div>

          {/* CV Upload */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
              CV (PDF)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload CV file"
            />
            {cvFile ? (
              <div
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div className="flex items-center gap-2">
                  <FileText size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {cvFile.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCvFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="p-1 rounded"
                  style={{
                    color: 'var(--text-secondary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  aria-label="Remove file"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="focus-ring w-full flex flex-col items-center gap-2 p-6 rounded-lg border-2 border-dashed transition-colors duration-200"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
              >
                <Upload size={24} />
                <span className="text-sm font-medium">Click to upload PDF</span>
                <span className="text-xs">or drag and drop</span>
              </button>
            )}
            {errors.cv && (
              <p className="flex items-center gap-1 mt-1 text-xs m-0" style={{ color: '#ef4444' }}>
                <AlertCircle size={12} /> {errors.cv}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="focus-ring px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="focus-ring px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors duration-200"
            style={{
              backgroundColor: 'var(--accent-primary)',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
            }}
          >
            Add Candidate
          </button>
        </div>
      </form>
    </div>
  );
}
