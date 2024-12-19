const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

// Path to your EJS template directory
const templateDir = path.join(__dirname, 'views'); // 'views' is the folder containing your EJS files
// Path to output the static HTML files
const outputDir = path.join(__dirname, 'public'); // 'public' will be where your static HTML files go

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
  // Save the rendered HTML file in the 'public' directory
  fs.writeFileSync(path.join(outputDir, 'index.html'), str);
});
