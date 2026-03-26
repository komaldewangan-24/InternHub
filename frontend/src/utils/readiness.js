export const computeProfileCompletion = (user) => {
  const checkpoints = [
    user?.name,
    user?.email,
    user?.profile?.department,
    user?.profile?.batch,
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

export const computeStudentReadiness = ({ user, approvedProjects = 0, applications = 0 }) => {
  const profileCompletion = computeProfileCompletion(user);
  const resumeReady = Boolean(user?.profile?.resumeUrl);
  const hasApprovedProject = approvedProjects > 0;
  
  const score = Math.round(
    profileCompletion * 0.45 +
      (resumeReady ? 20 : 0) +
      (hasApprovedProject ? 25 : 0) +
      (applications > 0 ? 10 : 0)
  );

  const breakdown = [
    { label: 'Institutional Profile', score: profileCompletion },
    { label: 'Registry Resume', score: resumeReady ? 100 : 0 },
    { label: 'Milestone Approval', score: hasApprovedProject ? 100 : 0 },
    { label: 'Registry Participation', score: applications > 0 ? 100 : 0 }
  ];

  const flags = [];
  if (profileCompletion < 80) flags.push('Complete profile');
  if (!resumeReady) flags.push('Add resume');
  if (!hasApprovedProject) flags.push('Get a project approved');
  if (applications === 0) flags.push('Start applying');
  if (!user?.profile?.assignedFaculty) flags.push('Await faculty assignment');

  return {
    profileCompletion,
    resumeReady,
    score,
    breakdown,
    flags,
    isPlacementReady: score >= 75 && resumeReady && hasApprovedProject,
  };
};

export const computeInternshipFit = ({ internship, user, approvedProjectTags = [] }) => {
  const studentSkills = new Set(
    [...(user?.profile?.skills || []), ...approvedProjectTags]
      .map((item) => String(item).trim().toLowerCase())
      .filter(Boolean)
  );

  const skillTags = (internship?.skillTags?.length ? internship.skillTags : internship?.requirements || [])
    .map((item) => String(item).trim().toLowerCase())
    .filter(Boolean);

  const matchedSkills = skillTags.filter((tag) => studentSkills.has(tag));
  const missingSkills = skillTags.filter((tag) => !studentSkills.has(tag));

  const departmentMatch =
    !(internship?.eligibleDepartments || []).length ||
    (internship.eligibleDepartments || []).includes(user?.profile?.department);
  const batchMatch =
    !(internship?.eligibleBatches || []).length ||
    (internship.eligibleBatches || []).includes(user?.profile?.batch);

  return {
    matchedSkills,
    missingSkills,
    eligible: departmentMatch && batchMatch,
    score: matchedSkills.length * 15 + (departmentMatch ? 20 : 0) + (batchMatch ? 15 : 0),
  };
};
