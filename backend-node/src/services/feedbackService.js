// ============================================
// services/feedbackService.js
// ============================================

const feedbackRepository = require('../repositories/feedbackRepository');

function createFeedback({ name, email, subject, message }) {
  const cleanName = (name || '').trim();
  const cleanEmail = (email || '').trim();
  const cleanSubject = (subject || '').trim();
  const cleanMessage = (message || '').trim();

  if (!cleanName) return { error: 'Họ tên không được để trống', status: 400 };
  if (!cleanEmail) return { error: 'Email không được để trống', status: 400 };
  if (!cleanSubject) return { error: 'Tiêu đề không được để trống', status: 400 };
  if (!cleanMessage) return { error: 'Nội dung phản hồi không được để trống', status: 400 };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { error: 'Email không đúng định dạng', status: 400 };
  }

  const feedback = feedbackRepository.create({
    name: cleanName,
    email: cleanEmail,
    subject: cleanSubject,
    message: cleanMessage,
  });

  return { success: true, feedback, status: 201 };
}

module.exports = {
  createFeedback,
};
