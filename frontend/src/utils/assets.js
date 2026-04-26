const BACKEND_URL = 'http://localhost:5000';

/**
 * Builds a full URL for an asset.
 * Supports:
 * - base64/data URLs (returns as is)
 * - relative paths starting with /uploads (prepends backend URL)
 * - absolute URLs (returns as is)
 * @param {string} pathOrUrl The path or data URL
 * @returns {string} The fully qualified URL
 */
export const getAssetUrl = (pathOrUrl) => {
    if (!pathOrUrl) return '';
    
    // Check if it's a data URL or absolute URL
    if (pathOrUrl.startsWith('data:') || pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
        return pathOrUrl;
    }
    
    // If it's a relative upload path, prepend backend URL
    if (pathOrUrl.startsWith('/uploads')) {
        return `${BACKEND_URL}${pathOrUrl}`;
    }
    
    return pathOrUrl;
};
