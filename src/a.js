const fs = require('fs');
const path = require('path');

// Define the file path (relative to the root of the project)
const filePath = path.join(__dirname, 'public', 'hi.html');

// Define the HTML content
const content = '<h1>Hi!</h1>';

// Ensure the "public" directory exists
fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
  if (err) {
    console.error('Error creating directory:', err);
    return;
  }

  // Write the content to the file
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File created successfully at', filePath);
    }
  });
});
