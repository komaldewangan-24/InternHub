import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const MAX_PAGES = 4;

const SECTION_HEADINGS = [
  'summary',
  'objective',
  'profile',
  'skills',
  'technical skills',
  'education',
  'experience',
  'work experience',
  'employment',
  'projects',
  'certifications',
  'certificates',
  'achievements',
  'awards',
];

const SKILL_KEYWORDS = [
  'javascript',
  'typescript',
  'react',
  'node.js',
  'node',
  'express',
  'mongodb',
  'mongoose',
  'html',
  'css',
  'tailwind',
  'python',
  'java',
  'c++',
  'c',
  'sql',
  'mysql',
  'postgresql',
  'firebase',
  'aws',
  'azure',
  'git',
  'github',
  'docker',
  'kubernetes',
  'figma',
  'ui/ux',
  'machine learning',
  'data science',
  'pandas',
  'numpy',
  'excel',
  'power bi',
  'tableau',
];

export const RESUME_MAX_BYTES = 4 * 1024 * 1024;

export const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const readFileAsArrayBuffer = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });

export const dataUrlToArrayBuffer = async (dataUrl) => {
  const response = await fetch(dataUrl);
  return response.arrayBuffer();
};

export const openResumeDataUrl = async (resumeUrl) => {
  if (!resumeUrl) return false;

  const response = await fetch(resumeUrl);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const opened = window.open(objectUrl, '_blank', 'noopener,noreferrer');
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
  return Boolean(opened);
};

const cleanLine = (line) => line.replace(/\s+/g, ' ').trim();

const getLines = (text) =>
  text
    .split(/\n+/)
    .map(cleanLine)
    .filter(Boolean);

const isLikelyHeading = (line) => {
  const normalized = line.toLowerCase().replace(/[:-]/g, '').trim();
  return SECTION_HEADINGS.includes(normalized);
};

const titleCaseSkill = (skill) =>
  skill
    .split(/\s+/)
    .map((part) => {
      if (['ui/ux', 'c++', 'c'].includes(part.toLowerCase())) return part.toUpperCase();
      if (part.toLowerCase() === 'node.js') return 'Node.js';
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');

const unique = (items) =>
  Array.from(new Set(items.map((item) => cleanLine(String(item))).filter(Boolean)));

const findSection = (lines, headings) => {
  const start = lines.findIndex((line) =>
    headings.some((heading) => line.toLowerCase().replace(/[:-]/g, '').trim() === heading)
  );

  if (start === -1) return [];

  const section = [];
  for (const line of lines.slice(start + 1)) {
    if (isLikelyHeading(line)) break;
    section.push(line);
  }

  return section;
};

const parseSkills = (text, lines) => {
  const normalizedText = text.toLowerCase();
  const knownSkills = SKILL_KEYWORDS.filter((skill) =>
    new RegExp(`(^|[^a-z0-9+#])${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9+#]|$)`, 'i').test(normalizedText)
  ).map(titleCaseSkill);

  const skillSection = findSection(lines, ['skills', 'technical skills']);
  const sectionSkills = skillSection
    .join(', ')
    .split(/[,|;•]/)
    .map((item) => cleanLine(item.replace(/^[-*]/, '')))
    .filter((item) => item.length > 1 && item.length < 32);

  return unique([...knownSkills, ...sectionSkills]).slice(0, 24);
};

const parseSummary = (lines) => {
  const summaryLines = findSection(lines, ['summary', 'objective', 'profile']);
  if (!summaryLines.length) return '';

  return summaryLines
    .slice(0, 4)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 600);
};

const parseName = (lines, email, phone) =>
  lines.find((line) => {
    const words = line.split(/\s+/);
    return (
      words.length >= 2 &&
      words.length <= 5 &&
      line.length <= 60 &&
      !line.includes('@') &&
      !line.includes('http') &&
      line !== email &&
      line !== phone &&
      !isLikelyHeading(line) &&
      !/\d/.test(line)
    );
  }) || '';

const parseExperience = (lines) => {
  const experienceLines = findSection(lines, ['experience', 'work experience', 'employment']);
  if (experienceLines.length < 2) return [];

  const entries = [];
  for (let index = 0; index < experienceLines.length && entries.length < 3; index += 3) {
    const title = experienceLines[index];
    const company = experienceLines[index + 1];
    const description = experienceLines[index + 2];

    if (!title || !company || title.length > 90 || company.length > 90) continue;

    entries.push({
      title,
      company,
      employmentType: 'Full-time',
      location: '',
      locationType: 'On-site',
      startDate: '',
      endDate: '',
      isCurrent: /present|current/i.test(`${title} ${company} ${description || ''}`),
      description: description || '',
      skills: [],
      companyLogoUrl: '',
    });
  }

  return entries;
};

const parseCertifications = (lines) => {
  const certificationLines = findSection(lines, ['certifications', 'certificates']);
  return certificationLines
    .filter((line) => line.length > 3 && line.length < 120)
    .slice(0, 5)
    .map((title) => ({
      title,
      issuer: '',
      issueDate: '',
      credentialId: '',
      skills: [],
      imageUrl: '',
      imageDescription: '',
      url: '',
      issuerLogoUrl: '',
    }));
};

export const parseResumeText = (text) => {
  const lines = getLines(text);
  const flatText = lines.join(' ');
  const email = flatText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || '';
  const phone =
    flatText.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4}/)?.[0] || '';
  const linkedinUrl = flatText.match(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s,]+/i)?.[0] || '';
  const githubUrl = flatText.match(/https?:\/\/(?:www\.)?github\.com\/[^\s,]+/i)?.[0] || '';
  const university =
    lines.find((line) => /university|college|institute|school/i.test(line) && line.length < 120) || '';
  const degree =
    lines.find((line) => /\b(b\.?tech|m\.?tech|bachelor|master|bsc|msc|bca|mca|degree)\b/i.test(line) && line.length < 120) || '';
  const graduationYear =
    flatText.match(/(?:graduation|graduate|batch|class of)[^\d]*(20\d{2})/i)?.[1] ||
    flatText.match(/\b20\d{2}\b/)?.[0] ||
    '';
  const location =
    lines.find((line) => /india|delhi|mumbai|pune|bengaluru|bangalore|hyderabad|chennai|kolkata|remote/i.test(line) && line.length < 80) || '';
  const achievementsLines = findSection(lines, ['achievements', 'awards']);

  return {
    name: parseName(lines, email, phone),
    email,
    phone,
    location,
    university,
    degree,
    graduationDate: graduationYear,
    bio: parseSummary(lines),
    githubUrl,
    linkedinUrl,
    skills: parseSkills(flatText, lines),
    experience: parseExperience(lines),
    certifications: parseCertifications(lines),
    achievementsSummary: achievementsLines.slice(0, 5).join(' ').slice(0, 500),
  };
};

export const extractPdfText = async (arrayBuffer) => {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  const pageCount = Math.min(pdf.numPages, MAX_PAGES);
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => `${item.str || ''}${item.hasEOL ? '\n' : ' '}`)
      .join('')
      .replace(/[ \t]+\n/g, '\n');

    pages.push(text);
  }

  return pages.join('\n');
};

export const parseResumePdf = async (arrayBuffer) => {
  const text = await extractPdfText(arrayBuffer);
  if (!text || text.replace(/\s+/g, '').length < 20) {
    return { text, data: null };
  }

  return {
    text,
    data: parseResumeText(text),
  };
};
