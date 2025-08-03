const fs = require("fs");
const path = require("path");
const marked = require("marked");
const matter = require("gray-matter");

// Template HTML file path for writings posts
const templatePath = path.join(process.cwd(), "/scripts", "template.html");

// Main /writings HTML file to be used for populating the main list
const writingsIndexFilePath = path.join(
  process.cwd(),
  "public",
  "writings",
  "index.html"
);

// Get thd base names of all Markdown files in /content/writings
const writingsFiles = fs
  .readdirSync(path.join(process.cwd(), "content", "writings"))
  .filter((fileName) => fileName.endsWith(".md"))
  .map((fileName) => path.basename(fileName, ".md"));

console.info(
  `Found ${writingsFiles.length} Markdown file(s) in /content/writings`
);

// <ul> element that will be dynamically populated, closed, then added to the main HTML file later
let listElement = "<ul id='writings-list'>\n";

writingsFiles.forEach((fileName) => {
  // Define the file path (relative to the root of the project)
  const inputPath = path.join(
    process.cwd() + "/content/writings",
    `${fileName}.md`
  );

  // The matter object contains frontmatter as well as the Markdown data itself
  const matterObject = matter(fs.readFileSync(inputPath, "utf8"));

  const content = marked.parse(matterObject.content.trim()); // remove trailing newline at start of file
  const data = matterObject.data; // Frontmatter

  const filePath = path.join(
    process.cwd() + "/public/writings",
    `${data.slug ?? fileName}.html`
  );

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

  // Create the HTML element and insert it in the list in /writings
  listElement += `<li><a href="/writings/${data.slug ?? fileName}.html">${
    data.title
  }</a></li>\n`;
});

// Now that the list element is populated, close it
listElement += "</ul>";

// Add the list element to the file
fs.readFile(writingsIndexFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading /writings/index.html: ", err);
    return;
  }

  const replacedData = data.replace("<!-- LIST HERE -->", listElement);

  fs.writeFile(writingsIndexFilePath, replacedData, (err) => {
    if (err) {
      console.error("Error writing to /writings/index.html: ", err);
      return;
    }

    console.info("List data written to /writings/index.html!");
  });
});
