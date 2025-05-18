module.exports = {
  arrowParens: 'avoid',        // Avoid parentheses around single arrow function parameter
  bracketSameLine: true,       // Put the > of a multi-line JSX element at the end of the last line
  bracketSpacing: false,       // No spaces between brackets in object literals
  singleQuote: true,           // Use single quotes instead of double quotes
  trailingComma: 'all',        // Include trailing commas in multi-line objects, arrays, etc.
  semi: true,                  // Always add semicolons
  tabWidth: 2,                 // Indent with 2 spaces
  useTabs: false,              // Use spaces instead of tabs
  printWidth: 100,             // Line length where Prettier will try to wrap
  quoteProps: 'as-needed',     // Only add quotes around object properties where required
  jsxSingleQuote: false,       // Use double quotes in JSX
  endOfLine: 'lf',             // Line feeds only (LF)
  embeddedLanguageFormatting: 'auto', // Format embedded code (like CSS-in-JS)
};
