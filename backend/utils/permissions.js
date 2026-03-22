const ALLOWED_RECIPIENTS = {
    student: ['faculty', 'recruiter', 'admin'],
    faculty: ['student', 'admin'],
    recruiter: ['student', 'admin'],
    admin: ['student', 'faculty', 'recruiter', 'admin'],
};

const getAllowedRecipientRoles = (role) => ALLOWED_RECIPIENTS[role] || [];

const canSendMessage = (senderRole, recipientRole) =>
    getAllowedRecipientRoles(senderRole).includes(recipientRole);

module.exports = {
    canSendMessage,
    getAllowedRecipientRoles,
};
