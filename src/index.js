// TrendyMC React Components
const Editor = require('./react/Editor.jsx');

// Load TrendyMC core
if (typeof window !== 'undefined' && !window.trendymc) {
  // Import TrendyMC script
  require('../js/trendymc/trendymc.min.js');
}

// Export React component
module.exports = {
  Editor: Editor
};

// Default export
module.exports.default = Editor;
