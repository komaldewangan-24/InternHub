const computeProfileCompletion = (user) => {
    const checkpoints = [
        user?.name,
        user?.email,
        user?.profile?.department,
        user?.profile?.batch,
        user?.profile?.section,
        user?.profile?.rollNumber,
        user?.profile?.university,
        user?.profile?.degree,
        user?.profile?.location,
        user?.profile?.phone,
        user?.profile?.bio,
        user?.profile?.resumeUrl,
        Array.isArray(user?.profile?.skills) && user.profile.skills.length > 0,
    ];

    const completed = checkpoints.filter(Boolean).length;
    return Math.round((completed / checkpoints.length) * 100);
};

const computeStudentReadiness = ({
    user,
    approvedProjectsCount = 0,
    applicationCount = 0,
}) => {
    const profileCompletion = computeProfileCompletion(user);
    const resumeReady = Boolean(user?.profile?.resumeUrl);
    const hasSkills = Array.isArray(user?.profile?.skills) && user.profile.skills.length > 0;
    const hasApprovedProject = approvedProjectsCount > 0;
    const hasApplications = applicationCount > 0;

    const score = Math.round(
        profileCompletion * 0.45 +
        (resumeReady ? 20 : 0) +
        (hasApprovedProject ? 25 : 0) +
        (hasApplications ? 10 : 0)
    );

    const flags = [];
    if (profileCompletion < 80) flags.push('profile_incomplete');
    if (!resumeReady) flags.push('resume_missing');
    if (!hasSkills) flags.push('skills_missing');
    if (!hasApprovedProject) flags.push('project_not_approved');
    if (!hasApplications) flags.push('application_inactive');
    if (!user?.profile?.assignedFaculty) flags.push('faculty_not_assigned');

    return {
        profileCompletion,
        approvedProjectsCount,
        applicationCount,
        resumeReady,
        score,
        flags,
        isPlacementReady: score >= 75 && hasApprovedProject && resumeReady,
    };
};

module.exports = {
    computeProfileCompletion,
    computeStudentReadiness,
};
