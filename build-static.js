const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

// Path to your EJS template directory
const templateDir = path.join(__dirname, 'views'); // 'views' is the folder containing your EJS files
// Path to output the static HTML files
const outputDir = path.join(__dirname, 'docs'); // Use 'docs' for GitHub Pages

// Make sure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Example data to pass into the EJS template
const data = {
  successMessage: '',
  errorMessage: '',
  songs: [
    { title: 'Song 1', artist: 'Artist 1' },
    { title: 'Song 2', artist: 'Artist 2' },
    { title: 'Song 3', artist: 'Artist 3' },
  ],
};

// Render index.ejs into an HTML file
ejs.renderFile(path.join(templateDir, 'index.ejs'), data, (err, str) => {
  if (err) {
    console.error('Error rendering index.ejs:', err);
    return;
  }
  // Save the rendered HTML file in the 'docs' directory for GitHub Pages
  fs.writeFileSync(path.join(outputDir, 'index.html'), str);
});

// Render login.ejs into an HTML file
ejs.renderFile(path.join(templateDir, 'login.ejs'), data, (err, str) => {
  if (err) {
    console.error('Error rendering login.ejs:', err);
    return;
  }
  // Save the rendered HTML file in the 'docs' directory
  fs.writeFileSync(path.join(outputDir, 'login.html'), str);
});

// Render signup.ejs into an HTML file
ejs.renderFile(path.join(templateDir, 'signup.ejs'), data, (err, str) => {
  if (err) {
    console.error('Error rendering signup.ejs:', err);
    return;
  }
  // Save the rendered HTML file in the 'docs' directory
  fs.writeFileSync(path.join(outputDir, 'signup.html'), str);
});
