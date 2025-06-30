const fs = require("fs");
const path = require("path");

function getDirectories(source) {
  return fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

// Define the file path (relative to the root of the project)
const filePath = path.join(process.cwd() + "/public/writings", "hi.html");
const templatePath = path.join(process.cwd() + "/scripts", "template.html");

// Define the HTML content
const content = "<h1>Hi!</h1>";

// Ensure the "public" directory exists
fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
  if (err) {
    console.error("Error creating directory:", err);
    return;
  }

  fs.readFile(templatePath, (err, data) => {
    if (err) {
      console.error("Error reading template:", err);
      return;
    }

    // Write the content to the file
    fs.writeFile(
      filePath,
      data.toString().replace("<!-- CONTENT -->", content),
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing file:", writeErr);
        } else {
          console.log("File created successfully at", filePath);
        }
      }
    );
  });
});
