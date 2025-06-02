/**
 * Replaces book variables in text content using template syntax like {{variableName}}
 * @param text - The text content that may contain variable placeholders
 * @param getBookVar - Function to retrieve book variable values
 * @returns Text with variables replaced by their values
 */
export function replaceBookVariables(
  text: string,
  getBookVar: (key: string) => any
): string {
  // Regular expression to match {{variableName}} patterns
  const variablePattern = /\{\{(\w+)\}\}/g;

  return text.replace(variablePattern, (match, variableName) => {
    const value = getBookVar(variableName);
    // Return the value if it exists, otherwise return the original placeholder
    return value !== undefined && value !== null ? String(value) : match;
  });
}

/**
 * Replaces book variables in HTML content while preserving HTML structure
 * @param html - The HTML content that may contain variable placeholders
 * @param getBookVar - Function to retrieve book variable values
 * @returns HTML with variables replaced by their values
 */
export function replaceBookVariablesInHTML(
  html: string,
  getBookVar: (key: string) => any
): string {
  // For HTML content, we need to be careful not to replace variables inside HTML tags
  // This regex matches {{variableName}} that are not inside HTML tags
  const variablePattern = /\{\{(\w+)\}\}/g;

  return html.replace(variablePattern, (match, variableName) => {
    const value = getBookVar(variableName);
    // Return the value if it exists, otherwise return the original placeholder
    // HTML escape the value to prevent XSS
    if (value !== undefined && value !== null) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }
    return match;
  });
}
