const Notification = require('../models/Notification');
const User = require('../models/User');

const notificationCategoryDefaults = {
    internships: true,
    applications: true,
    projects: true,
    messages: true,
    company: true,
    system: true,
};

const visibleInternshipFields = [
    'title',
    'description',
    'requirements',
    'skillTags',
    'eligibleDepartments',
    'eligibleBatches',
    'location',
    'stipend',
    'duration',
    'applyBy',
    'status',
];

let cachedTransporter = undefined;
let cachedNodemailer = undefined;

const getAppBaseUrl = () => process.env.APP_BASE_URL || 'http://localhost:5173';

const getNotificationPreferences = (user = {}) => ({
    inAppEnabled: user.notificationPreferences?.inAppEnabled ?? true,
    emailEnabled: user.notificationPreferences?.emailEnabled ?? true,
    categories: {
        ...notificationCategoryDefaults,
        ...(user.notificationPreferences?.categories || {}),
    },
});

const isCategoryEnabledForChannel = (user, category, channel) => {
    const preferences = getNotificationPreferences(user);

    if (channel === 'inApp' && !preferences.inAppEnabled) {
        return false;
    }

    if (channel === 'email' && !preferences.emailEnabled) {
        return false;
    }

    return preferences.categories[category] !== false;
};

const buildAbsoluteUrl = (link = '') => {
    if (!link) {
        return '';
    }

    if (/^https?:\/\//i.test(link)) {
        return link;
    }

    return `${getAppBaseUrl().replace(/\/$/, '')}${link.startsWith('/') ? '' : '/'}${link}`;
};

const buildEmailMarkup = ({ title, message, ctaLabel, link, recipientName }) => {
    const safeTitle = String(title || 'InternHub Notification');
    const safeMessage = String(message || 'You have a new update in InternHub.');
    const actionUrl = buildAbsoluteUrl(link);
    const actionLabel = ctaLabel || 'Open InternHub';

    return {
        text: [
            `Hello ${recipientName || 'there'},`,
            '',
            safeTitle,
            safeMessage,
            actionUrl ? `${actionLabel}: ${actionUrl}` : '',
        ]
            .filter(Boolean)
            .join('\n'),
        html: `
            <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px;">
                <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 12px; color: #475569;">Hello ${recipientName || 'there'},</p>
                    <h2 style="margin: 0 0 12px; color: #0f172a;">${safeTitle}</h2>
                    <p style="margin: 0 0 24px; color: #334155; line-height: 1.6;">${safeMessage}</p>
                    ${
                        actionUrl
                            ? `<a href="${actionUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 8px; font-weight: 700;">${actionLabel}</a>`
                            : ''
                    }
                </div>
            </div>
        `,
    };
};

const getNodemailer = () => {
    if (cachedNodemailer !== undefined) {
        return cachedNodemailer;
    }

    try {
        // Optional dependency: the notification system must still work without email.
        cachedNodemailer = require('nodemailer');
    } catch {
        cachedNodemailer = null;
    }

    return cachedNodemailer;
};

const getEmailTransporter = () => {
    if (cachedTransporter !== undefined) {
        return cachedTransporter;
    }

    const nodemailer = getNodemailer();
    if (!nodemailer) {
        cachedTransporter = null;
        return cachedTransporter;
    }

    if (process.env.SMTP_URL) {
        cachedTransporter = nodemailer.createTransport(process.env.SMTP_URL);
        return cachedTransporter;
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
        cachedTransporter = null;
        return cachedTransporter;
    }

    cachedTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: String(process.env.SMTP_SECURE || 'false') === 'true',
        auth:
            process.env.SMTP_USER && process.env.SMTP_PASS
                ? {
                      user: process.env.SMTP_USER,
                      pass: process.env.SMTP_PASS,
                  }
                : undefined,
    });

    return cachedTransporter;
};

const getEmailFrom = () => process.env.SMTP_FROM || 'InternHub <no-reply@internhub.local>';

const loadUser = async (recipientUserOrId) => {
    if (!recipientUserOrId) {
        return null;
    }

    if (typeof recipientUserOrId === 'object' && recipientUserOrId._id) {
        return recipientUserOrId;
    }

    return User.findById(recipientUserOrId).select(
        'name email notificationPreferences role profile.department profile.batch'
    );
};

const sendEmailNotification = async ({
    recipientUser,
    category,
    title,
    message,
    link,
    ctaLabel,
}) => {
    if (!recipientUser?.email || !isCategoryEnabledForChannel(recipientUser, category, 'email')) {
        return false;
    }

    const transporter = getEmailTransporter();
    if (!transporter) {
        return false;
    }

    const emailMarkup = buildEmailMarkup({
        title,
        message,
        link,
        ctaLabel,
        recipientName: recipientUser.name,
    });

    try {
        await transporter.sendMail({
            from: getEmailFrom(),
            to: recipientUser.email,
            subject: `${title} | InternHub`,
            text: emailMarkup.text,
            html: emailMarkup.html,
        });
        return true;
    } catch (error) {
        console.error(`Notification email failed for ${recipientUser.email}: ${error.message}`);
        return false;
    }
};

const createInAppNotification = async ({
    recipientUser,
    actor,
    type,
    category,
    title,
    message,
    link,
    metadata = {},
    entityType,
    entityId,
}) => {
    if (!recipientUser?._id || !isCategoryEnabledForChannel(recipientUser, category, 'inApp')) {
        return null;
    }

    return Notification.create({
        recipient: recipientUser._id,
        actor,
        type,
        category,
        title,
        message,
        link,
        metadata,
        entityType,
        entityId,
    });
};

const deliverNotification = async ({
    recipientUser,
    actor,
    type,
    category = 'system',
    title,
    message,
    link,
    metadata = {},
    entityType,
    entityId,
    ctaLabel,
}) => {
    const resolvedRecipient = await loadUser(recipientUser);
    if (!resolvedRecipient) {
        return { notification: null, emailSent: false };
    }

    const [notification, emailSent] = await Promise.all([
        createInAppNotification({
            recipientUser: resolvedRecipient,
            actor,
            type,
            category,
            title,
            message,
            link,
            metadata,
            entityType,
            entityId,
        }),
        sendEmailNotification({
            recipientUser: resolvedRecipient,
            category,
            title,
            message,
            link,
            ctaLabel,
        }),
    ]);

    return { notification, emailSent };
};

const deliverManyNotifications = async (notifications = []) =>
    Promise.all(notifications.filter(Boolean).map((payload) => deliverNotification(payload)));

const normalizeValue = (value) => {
    if (Array.isArray(value)) {
        return [...value].map((item) => String(item).trim()).filter(Boolean).sort();
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (value === undefined || value === null) {
        return '';
    }

    return String(value).trim();
};

const hasVisibleInternshipChanges = (before = {}, after = {}) =>
    visibleInternshipFields.some((field) => {
        const previousValue = normalizeValue(before[field]);
        const nextValue = normalizeValue(after[field]);
        return JSON.stringify(previousValue) !== JSON.stringify(nextValue);
    });

const getEligibleStudentsForInternship = async (internship = {}) => {
    const query = { role: 'student' };

    if (Array.isArray(internship.eligibleDepartments) && internship.eligibleDepartments.length) {
        query['profile.department'] = { $in: internship.eligibleDepartments };
    }

    if (Array.isArray(internship.eligibleBatches) && internship.eligibleBatches.length) {
        query['profile.batch'] = { $in: internship.eligibleBatches };
    }

    return User.find(query).select(
        'name email notificationPreferences role profile.department profile.batch'
    );
};

const getInternshipApplicants = async (internshipId) => {
    const Application = require('../models/Application');
    const applications = await Application.find({ internship: internshipId }).select('user');
    const uniqueUserIds = [...new Set(applications.map((item) => String(item.user)).filter(Boolean))];

    if (!uniqueUserIds.length) {
        return [];
    }

    return User.find({ _id: { $in: uniqueUserIds } }).select(
        'name email notificationPreferences role profile.department profile.batch'
    );
};

const buildInternshipLocation = (internship) =>
    internship?.company?.name ? `${internship.title} at ${internship.company.name}` : internship?.title;

const notifyInternshipPosted = async ({ internship, actorId }) => {
    if (!internship || internship.status !== 'open') {
        return [];
    }

    const eligibleStudents = await getEligibleStudentsForInternship(internship);
    const internshipName = buildInternshipLocation(internship);

    return deliverManyNotifications(
        eligibleStudents.map((student) => ({
            recipientUser: student,
            actor: actorId,
            type: 'internship_posted',
            category: 'internships',
            title: 'New internship opportunity',
            message: `${internshipName} is now open for applications.`,
            link: `/internships/${internship._id}`,
            metadata: { internshipId: internship._id },
            entityType: 'internship',
            entityId: internship._id,
            ctaLabel: 'View internship',
        }))
    );
};

const notifyInternshipUpdated = async ({ internship, actorId }) => {
    if (!internship) {
        return [];
    }

    const [eligibleStudents, applicants] = await Promise.all([
        internship.status === 'open' ? getEligibleStudentsForInternship(internship) : Promise.resolve([]),
        getInternshipApplicants(internship._id),
    ]);

    const recipients = new Map();
    [...eligibleStudents, ...applicants].forEach((user) => {
        if (user?._id) {
            recipients.set(String(user._id), user);
        }
    });

    const internshipName = buildInternshipLocation(internship);

    return deliverManyNotifications(
        [...recipients.values()].map((recipient) => ({
            recipientUser: recipient,
            actor: actorId,
            type: 'internship_updated',
            category: 'internships',
            title: 'Internship details updated',
            message: `${internshipName} has new details. Review the latest posting before applying or proceeding.`,
            link: `/internships/${internship._id}`,
            metadata: { internshipId: internship._id },
            entityType: 'internship',
            entityId: internship._id,
            ctaLabel: 'Review internship',
        }))
    );
};

const notifyInternshipClosed = async ({ internship, actorId }) => {
    if (!internship) {
        return [];
    }

    const applicants = await getInternshipApplicants(internship._id);
    const internshipName = buildInternshipLocation(internship);

    return deliverManyNotifications(
        applicants.map((recipient) => ({
            recipientUser: recipient,
            actor: actorId,
            type: 'internship_closed',
            category: 'internships',
            title: 'Internship closed',
            message: `${internshipName} is no longer accepting applications.`,
            link: '/applications',
            metadata: { internshipId: internship._id },
            entityType: 'internship',
            entityId: internship._id,
            ctaLabel: 'View applications',
        }))
    );
};

const notifyApplicationSubmitted = async ({ internship, application, actorId }) =>
    deliverNotification({
        recipientUser: internship?.user,
        actor: actorId,
        type: 'application_submitted',
        category: 'applications',
        title: 'New applicant received',
        message: `A student applied to "${buildInternshipLocation(internship) || 'your internship'}".`,
        link: '/recruiter/applicants',
        metadata: { applicationId: application?._id, internshipId: internship?._id },
        entityType: 'application',
        entityId: application?._id,
        ctaLabel: 'Review applicants',
    });

const notifyApplicationStatusChanged = async ({ application, actorId }) =>
    deliverNotification({
        recipientUser: application?.user,
        actor: actorId,
        type: 'application_status_changed',
        category: 'applications',
        title: 'Application status updated',
        message: `Your application for "${application?.internship?.title || 'the internship'}" is now marked as ${application?.status}.`,
        link: '/applications',
        metadata: { applicationId: application?._id, status: application?.status },
        entityType: 'application',
        entityId: application?._id,
        ctaLabel: 'View applications',
    });

const notifyProjectSubmitted = async ({ submission, actorId }) =>
    deliverNotification({
        recipientUser: submission?.faculty,
        actor: actorId,
        type: 'project_submitted',
        category: 'projects',
        title: 'New project submitted for review',
        message: `${submission?.student?.name || 'A student'} submitted "${submission?.title}" for review.`,
        link: '/faculty/reviews',
        metadata: { projectId: submission?._id },
        entityType: 'project',
        entityId: submission?._id,
        ctaLabel: 'Open review queue',
    });

const notifyProjectResubmitted = async ({ submission, actorId }) =>
    deliverNotification({
        recipientUser: submission?.faculty,
        actor: actorId,
        type: 'project_resubmitted',
        category: 'projects',
        title: 'Project resubmitted for review',
        message: `${submission?.student?.name || 'A student'} resubmitted "${submission?.title}" for review.`,
        link: '/faculty/reviews',
        metadata: { projectId: submission?._id },
        entityType: 'project',
        entityId: submission?._id,
        ctaLabel: 'Open review queue',
    });

const notifyProjectReviewed = async ({ submission, actorId, action, message }) => {
    const isApproved = action === 'approved';
    const needsResubmission = action === 'needs_resubmission';

    return deliverNotification({
        recipientUser: submission?.student,
        actor: actorId,
        type: isApproved
            ? 'project_approved'
            : needsResubmission
              ? 'project_needs_resubmission'
              : 'project_reviewed',
        category: 'projects',
        title: isApproved
            ? 'Project approved'
            : needsResubmission
              ? 'Project needs resubmission'
              : 'Project review updated',
        message: isApproved
            ? `"${submission?.title}" was approved and is now visible to recruiters.`
            : needsResubmission
              ? message || `"${submission?.title}" needs updates before it can be approved.`
              : message || `"${submission?.title}" received new faculty feedback.`,
        link: '/student/projects',
        metadata: { projectId: submission?._id, action },
        entityType: 'project',
        entityId: submission?._id,
        ctaLabel: 'View project',
    });
};

const notifyFacultyAssigned = async ({ faculty, students, actorId }) => {
    const studentNotifications = await deliverManyNotifications(
        (students || []).map((student) => ({
            recipientUser: student,
            actor: actorId,
            type: 'faculty_assigned',
            category: 'system',
            title: 'Faculty reviewer assigned',
            message: `${faculty?.name || 'A faculty reviewer'} has been assigned as your default faculty reviewer.`,
            link: '/student/projects',
            metadata: { facultyId: faculty?._id },
            entityType: 'user',
            entityId: faculty?._id,
            ctaLabel: 'Open projects',
        }))
    );

    const facultySummary = await deliverNotification({
        recipientUser: faculty,
        actor: actorId,
        type: 'faculty_assignment_summary',
        category: 'system',
        title: 'Students assigned for review',
        message: `${students?.length || 0} student${students?.length === 1 ? '' : 's'} have been assigned to you for project review.`,
        link: '/faculty/reviews',
        metadata: { studentCount: students?.length || 0 },
        entityType: 'user',
        entityId: faculty?._id,
        ctaLabel: 'Open review queue',
    });

    return { studentNotifications, facultySummary };
};

const notifyCompanyVerificationPending = async ({ company, actorId }) => {
    const Setting = require('../models/Setting');
    const settings = await Setting.findOne();

    if (settings?.companyVerificationEnabled === false) {
        return [];
    }

    const admins = await User.find({ role: 'admin' }).select('name email notificationPreferences');

    return deliverManyNotifications(
        admins.map((admin) => ({
            recipientUser: admin,
            actor: actorId,
            type: 'company_verification_pending',
            category: 'company',
            title: 'Company verification pending',
            message: `${company?.name || 'A company'} is awaiting admin verification.`,
            link: '/admin/companies',
            metadata: { companyId: company?._id },
            entityType: 'company',
            entityId: company?._id,
            ctaLabel: 'Review company',
        }))
    );
};

const notifyCompanyVerificationChanged = async ({ company, actorId }) => {
    if (!['verified', 'flagged'].includes(company?.verificationStatus)) {
        return { notification: null, emailSent: false };
    }

    const label = company.verificationStatus === 'verified' ? 'verified' : 'flagged';

    return deliverNotification({
        recipientUser: company?.user,
        actor: actorId,
        type: 'company_verification_changed',
        category: 'company',
        title: `Company ${label}`,
        message: `${company?.name || 'Your company profile'} has been ${label} by the admin team.`,
        link: '/recruiter/company',
        metadata: { companyId: company?._id, verificationStatus: company?.verificationStatus },
        entityType: 'company',
        entityId: company?._id,
        ctaLabel: 'View company profile',
    });
};

const notifyNewMessage = async ({ recipientUser, senderName, messageId, actorId }) =>
    deliverNotification({
        recipientUser,
        actor: actorId,
        type: 'new_message',
        category: 'messages',
        title: 'New message received',
        message: `You have a new message from ${senderName || 'a user'}.`,
        link: '/messages',
        metadata: { messageId },
        entityType: 'message',
        entityId: messageId,
        ctaLabel: 'Open messages',
    });

module.exports = {
    notificationCategoryDefaults,
    getNotificationPreferences,
    hasVisibleInternshipChanges,
    notifyInternshipPosted,
    notifyInternshipUpdated,
    notifyInternshipClosed,
    notifyApplicationSubmitted,
    notifyApplicationStatusChanged,
    notifyProjectSubmitted,
    notifyProjectResubmitted,
    notifyProjectReviewed,
    notifyFacultyAssigned,
    notifyCompanyVerificationPending,
    notifyCompanyVerificationChanged,
    notifyNewMessage,
    deliverNotification,
    deliverManyNotifications,
};
