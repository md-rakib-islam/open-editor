// TrendyMC React Components
import Editor from './react/Editor.jsx';

// Load TrendyMC core
if (typeof window !== 'undefined' && !window.trendymc) {
  // Import TrendyMC script
  require('../js/trendymc/trendymc.min.js');
}

// Export React component
export { Editor };

// Default export
export default Editor;
