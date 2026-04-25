const DEFAULT_SECTIONS = ['Contact', 'Summary', 'Skills', 'Education', 'Experience', 'Projects'];
const DEFAULT_KEYWORDS = ['internship', 'project', 'team', 'technical', 'problem solving', 'communication'];
const DEFAULT_PREFERRED = ['github', 'linkedin', 'impact', 'implemented', 'developed', 'optimized', 'collaborated'];
const DEFAULT_WEIGHTS = {
  keywords: 35,
  sections: 20,
  experience: 20,
  education: 10,
  links: 10,
  formatting: 5,
};

const cleanList = (items = []) =>
  items
    .map((item) => String(item || '').trim())
    .filter(Boolean);

const hasCriteriaContent = (criteria) =>
  Boolean(
    criteria &&
      (cleanList(criteria.requiredKeywords).length ||
        cleanList(criteria.preferredKeywords).length ||
        cleanList(criteria.requiredSections).length)
  );

const mergeWeights = (weights = {}) => ({
  ...DEFAULT_WEIGHTS,
  ...Object.fromEntries(
    Object.entries(weights || {}).map(([key, value]) => [key, Number(value) || DEFAULT_WEIGHTS[key] || 0])
  ),
});

const titleWords = (title = '') =>
  cleanList(
    title
      .replace(/[^a-z0-9+#.\s]/gi, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2)
  );

export const resolveAtsCriteria = ({ selectedInternship, settings }) => {
  const internshipCriteria = selectedInternship?.resumeAtsCriteria;
  if (hasCriteriaContent(internshipCriteria)) {
    return {
      ...internshipCriteria,
      title: internshipCriteria.title || `${selectedInternship.title} ATS Criteria`,
      weights: mergeWeights(internshipCriteria.weights),
      source: 'recruiter',
      sourceLabel: selectedInternship.company?.name || 'Recruiter criteria',
    };
  }

  const adminCriteria = settings?.resumeAtsCriteria;
  if (hasCriteriaContent(adminCriteria)) {
    return {
      ...adminCriteria,
      title: adminCriteria.title || 'General ATS Score',
      weights: mergeWeights(adminCriteria.weights),
      source: 'admin',
      sourceLabel: 'Admin default criteria',
    };
  }

  const internshipKeywords = selectedInternship
    ? [...titleWords(selectedInternship.title), ...(selectedInternship.skillTags || []), ...(selectedInternship.requirements || [])]
    : [];

  return {
    title: selectedInternship ? `${selectedInternship.title} ATS Score` : 'General ATS Score',
    requiredKeywords: cleanList([...internshipKeywords, ...DEFAULT_KEYWORDS]).slice(0, 18),
    preferredKeywords: DEFAULT_PREFERRED,
    requiredSections: DEFAULT_SECTIONS,
    weights: DEFAULT_WEIGHTS,
    notes: 'Using built-in ATS defaults because no admin or recruiter criteria is configured.',
    source: 'default',
    sourceLabel: 'Built-in default criteria',
  };
};

const includesPhrase = (text, phrase) => {
  const normalized = phrase.toLowerCase().trim();
  if (!normalized) return false;
  return text.includes(normalized);
};

const sectionMatchers = {
  contact: /@|\+?\d[\d\s().-]{7,}/i,
  summary: /\b(summary|objective|profile|about)\b/i,
  skills: /\b(skills|technical skills|technologies)\b/i,
  education: /\b(education|university|college|institute|b\.?tech|bachelor|master|degree)\b/i,
  experience: /\b(experience|employment|work history|internship)\b/i,
  projects: /\b(projects|portfolio|github)\b/i,
  certifications: /\b(certifications|certificates|awards)\b/i,
};

const hasSection = (text, section) => {
  const key = section.toLowerCase().trim();
  return sectionMatchers[key]?.test(text) || includesPhrase(text, key);
};

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

export const scoreResumeText = ({ text = '', criteria, profile = {} }) => {
  const normalizedText = text.toLowerCase();
  const words = normalizedText.split(/\s+/).filter(Boolean);
  const weights = mergeWeights(criteria?.weights);
  const requiredKeywords = cleanList(criteria?.requiredKeywords);
  const preferredKeywords = cleanList(criteria?.preferredKeywords);
  const requiredSections = cleanList(criteria?.requiredSections);

  const matchedRequiredKeywords = requiredKeywords.filter((keyword) => includesPhrase(normalizedText, keyword));
  const missingRequiredKeywords = requiredKeywords.filter((keyword) => !includesPhrase(normalizedText, keyword));
  const matchedPreferredKeywords = preferredKeywords.filter((keyword) => includesPhrase(normalizedText, keyword));
  const missingPreferredKeywords = preferredKeywords.filter((keyword) => !includesPhrase(normalizedText, keyword));

  const presentSections = requiredSections.filter((section) => hasSection(normalizedText, section));
  const missingSections = requiredSections.filter((section) => !hasSection(normalizedText, section));

  const hasExperienceOrProjects = hasSection(normalizedText, 'experience') || hasSection(normalizedText, 'projects');
  const hasEducation = hasSection(normalizedText, 'education');
  const hasLinks =
    /linkedin\.com|github\.com|https?:\/\//i.test(text) ||
    Boolean(profile.linkedinUrl || profile.githubUrl);
  const hasContact = /@/.test(text) && /\+?\d[\d\s().-]{7,}/.test(text);
  const hasReadableLength = words.length >= 180 && words.length <= 1200;
  const hasBulletsOrLines = (text.match(/\n/g) || []).length >= 12 || /[-*]/.test(text);

  const keywordTotal = Math.max(requiredKeywords.length + preferredKeywords.length * 0.5, 1);
  const keywordScore =
    ((matchedRequiredKeywords.length + matchedPreferredKeywords.length * 0.5) / keywordTotal) * weights.keywords;
  const sectionScore =
    requiredSections.length > 0 ? (presentSections.length / requiredSections.length) * weights.sections : weights.sections;
  const experienceScore = hasExperienceOrProjects ? weights.experience : 0;
  const educationScore = hasEducation ? weights.education : 0;
  const linkScore = ((hasLinks ? 0.5 : 0) + (hasContact ? 0.5 : 0)) * weights.links;
  const formattingScore = ((hasReadableLength ? 0.5 : 0) + (hasBulletsOrLines ? 0.5 : 0)) * weights.formatting;

  const maxScore = Object.values(weights).reduce((sum, value) => sum + value, 0) || 100;
  const totalScore = clampScore(
    ((keywordScore + sectionScore + experienceScore + educationScore + linkScore + formattingScore) / maxScore) * 100
  );

  return {
    totalScore,
    categoryScores: {
      keywords: clampScore((keywordScore / weights.keywords) * 100 || 0),
      sections: clampScore((sectionScore / weights.sections) * 100 || 0),
      experience: hasExperienceOrProjects ? 100 : 0,
      education: hasEducation ? 100 : 0,
      links: clampScore((linkScore / weights.links) * 100 || 0),
      formatting: clampScore((formattingScore / weights.formatting) * 100 || 0),
    },
    matchedKeywords: [...matchedRequiredKeywords, ...matchedPreferredKeywords],
    missingKeywords: [...missingRequiredKeywords, ...missingPreferredKeywords],
    missingSections,
    presentSections,
    signals: {
      hasExperienceOrProjects,
      hasEducation,
      hasLinks,
      hasContact,
      hasReadableLength,
      hasBulletsOrLines,
      wordCount: words.length,
    },
    criteria,
  };
};

export const buildResumeSuggestions = (scoreResult) => {
  if (!scoreResult) return [];

  const suggestions = [];

  if (!scoreResult.signals.hasContact) {
    suggestions.push({
      priority: 'Critical',
      title: 'Add complete contact details',
      detail: 'Include a professional email address and phone number near the top of the resume.',
    });
  }

  scoreResult.missingSections.forEach((section) => {
    suggestions.push({
      priority: 'Critical',
      title: `Add ${section} section`,
      detail: `ATS checks are looking for a clear ${section} section heading and readable content.`,
    });
  });

  if (scoreResult.missingKeywords.length) {
    suggestions.push({
      priority: 'Keyword gaps',
      title: 'Add missing role keywords',
      detail: scoreResult.missingKeywords.slice(0, 12).join(', '),
    });
  }

  if (!scoreResult.signals.hasExperienceOrProjects) {
    suggestions.push({
      priority: 'Section improvements',
      title: 'Show experience or projects',
      detail: 'Add internship, work, or project entries with your role, tools used, and outcomes.',
    });
  }

  if (!scoreResult.signals.hasLinks) {
    suggestions.push({
      priority: 'Section improvements',
      title: 'Add portfolio links',
      detail: 'Include LinkedIn, GitHub, portfolio, or live project links where relevant.',
    });
  }

  if (!scoreResult.signals.hasReadableLength || !scoreResult.signals.hasBulletsOrLines) {
    suggestions.push({
      priority: 'Formatting',
      title: 'Improve ATS readability',
      detail: 'Use clear section headings, bullet points, and enough detail for screening systems to parse your resume.',
    });
  }

  if (!suggestions.length) {
    suggestions.push({
      priority: 'Ready',
      title: 'Resume looks ATS friendly',
      detail: 'Keep tailoring keywords to each internship before applying.',
    });
  }

  return suggestions;
};
