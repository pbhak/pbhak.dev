const fs = require("fs");
const path = require("path");
const marked = require("marked");

// Template HTML file path for writings posts
const templatePath = path.join(process.cwd() + "/scripts", "template.html");

// Get thd base names of all Markdown files in /content/writings
const writingsFiles = fs
  .readdirSync(path.join(process.cwd(), "public"))
  .filter((fileName) => fileName.endsWith(".md"))
  .map((fileName) => path.basename(fileName, ".md"));

console.info(
  `Found ${writingsFiles.length} Markdown file(s) in /content/writings`
);

writingsFiles.forEach((fileName) => {
  // Define the file path (relative to the root of the project)
  const filePath = path.join(process.cwd() + "/public/writings", `${fileName}.html`);
  const inputPath = path.join(process.cwd() + "/content/writings", `${fileName}.md`);

  // Define the HTML content
  const content = marked.parse(fs.readFileSync(inputPath, "utf8"));

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
});
