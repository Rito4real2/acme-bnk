'use client';
import React, { useState, type FormEvent, type ChangeEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function SupportContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Client-side validation logic
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message body cannot be empty.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field-specific error as user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? '' // In production (Vercel/Nginx), use relative paths so the proxy handles it
        : 'http://localhost:5000'; // In local dev, point directly to your local backend
      const receiverEmail = process.env.NEXT_PUBLIC_RECEIVER_EMAIL || 'support@inbound.astrofinex.online';

      const res = await fetch(`${API_BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: receiverEmail,
          subject: `Support Request: ${formData.subject} (From: ${formData.name})`,
          htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f9fafb; border-radius: 8px;">
              <h2 style="color: #1e293b; margin-bottom: 16px;">New Client Support Request</h2>
              <p><strong>From:</strong> ${formData.name} (&lt;${formData.email}&gt;)</p>
              <p><strong>Subject:</strong> ${formData.subject}</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
              <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #334155;">${formData.message}</p>
            </div>
          `,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
        setStatusMessage('Your message has been sent successfully! Our support team will get back to you shortly.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setIsSuccess(false);
        setStatusMessage('Failed to send support request. Please try again later.');
      }
    } catch (err) {
      console.error('Support form submission error:', err);
      setIsSuccess(false);
      setStatusMessage('An unexpected error occurred. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-gray-900 py-20 px-4 sm:px-6 border-t border-gray-800">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-amber-500 font-bold bg-amber-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-amber-500/20">
            Direct Assistance
          </span>
          <h2 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contact Client Support
          </h2>
          <p className="font-mono text-sm sm:text-base text-gray-400">
            Have questions or need help with your account? Fill out the form below to reach our dedicated support desk.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="w-full bg-gray-800/60 border border-gray-700/60 p-6 sm:p-10 rounded-2xl backdrop-blur-md shadow-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            
            {/* Grid Row: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full bg-gray-900/90 border ${
                    errors.name ? 'border-red-500' : 'border-gray-700 focus:border-amber-500'
                  } p-3 rounded-xl font-mono text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition`}
                />
                {errors.name && <span className="font-mono text-[11px] text-red-400">{errors.name}</span>}
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="client@example.com"
                  className={`w-full bg-gray-900/90 border ${
                    errors.email ? 'border-red-500' : 'border-gray-700 focus:border-amber-500'
                  } p-3 rounded-xl font-mono text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition`}
                />
                {errors.email && <span className="font-mono text-[11px] text-red-400">{errors.email}</span>}
              </div>

            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs font-bold text-gray-300 uppercase tracking-wider">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Account Verification Inquiry"
                className={`w-full bg-gray-900/90 border ${
                  errors.subject ? 'border-red-500' : 'border-gray-700 focus:border-amber-500'
                } p-3 rounded-xl font-mono text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition`}
              />
              {errors.subject && <span className="font-mono text-[11px] text-red-400">{errors.subject}</span>}
            </div>

            {/* Message Body */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs font-bold text-gray-300 uppercase tracking-wider">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="Describe your question or issue in detail..."
                className={`w-full bg-gray-900/90 border ${
                  errors.message ? 'border-red-500' : 'border-gray-700 focus:border-amber-500'
                } p-3 rounded-xl font-mono text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition resize-none`}
              />
              {errors.message && <span className="font-mono text-[11px] text-red-400">{errors.message}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white font-mono font-bold text-sm py-3.5 px-6 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Transmitting Request...' : 'Submit Support Request →'}
            </button>

            {/* Status Feedback Notification */}
            {statusMessage && (
              <div
                className={`p-4 rounded-xl font-mono text-xs text-center border ${
                  isSuccess
                    ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
                    : 'bg-red-950/40 border-red-500/30 text-red-300'
                }`}
              >
                {statusMessage}
              </div>
            )}

          </form>
        </div>

      </div>
    </section>
  );
}