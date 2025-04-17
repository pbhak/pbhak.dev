const repo1 = document.getElementById("repo1");
const repo2 = document.getElementById("repo2");
const repo3 = document.getElementById("repo3");

const defaultColorScheme = "dracula";

function formatDate(date) {
  const month = date.getMonth() + 1;
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${month}/${day}/${year}`;
}

function returnLinkElement(repoId) {
  return `<a href='${reposJson[repoId].html_url}'>${
    reposJson[repoId].description
  } (last pushed ${formatDate(new Date(reposJson[repoId].pushed_at))})</a>`;
}

function setDefaultColorScheme() {
  document.getElementById("color-changer").value = defaultColorScheme;
  fetch("./color_schemes.json")
    .then((response) => response.json())
    .then((data) => changeColorScheme(data[defaultColorScheme]));
}

function changeColorScheme(colorSchemeObject) {
  // Change page background color
  document.getElementsByTagName("body")[0].style.backgroundColor =
    colorSchemeObject.background;
  // Change foreground color
  document
    .querySelectorAll("h1, p, li, a")
    .forEach((element) => (element.style.color = colorSchemeObject.foreground));
  document.getElementById("color-changer").style.backgroundColor =
    colorSchemeObject.background;
  document.getElementById("color-changer").style.color =
    colorSchemeObject.foreground;
  // If the color scheme specifies colors for the head <h1> element and the <hr> elements, apply them
  if (colorSchemeObject.header)
    document.getElementById("head").style.color = colorSchemeObject.header;
  if (colorSchemeObject.hr) {
    for (
      let elementIndex = 0;
      elementIndex < document.getElementsByTagName("hr").length;
      elementIndex++
    ) {
      document.getElementsByTagName("hr")[elementIndex].style.borderColor =
        colorSchemeObject.hr;
    }
  }
  // Change color of links, but only if the type of link to change is in the document
  if (document.querySelector("a:link"))
    document
      .querySelectorAll("a:link")
      .forEach(
        (element) => (element.style.color = colorSchemeObject.link.regular)
      );
  if (document.querySelector("a:visited"))
    document
      .querySelectorAll("a:visited")
      .forEach(
        (element) => (element.style.color = colorSchemeObject.link.visited)
      );
}

// Fetch all repositories I own, then use a custom sorting function to sort them by last pushed.
const repos = await fetch("https://api.github.com/users/pbhak/repos");
const reposJson = await repos.json().then((json) => {
  json.sort((repoA, repoB) => {
    repoA = new Date(repoA.pushed_at);
    repoB = new Date(repoB.pushed_at);

    return repoA > repoB ? -1 : 1;
  });

  return json;
});

// Take the latest 3 repositories I've pushed to and format them on the site
repo1.innerHTML = returnLinkElement(0);
repo2.innerHTML = returnLinkElement(1);
repo3.innerHTML = returnLinkElement(2);

setDefaultColorScheme();

// Change color scheme based on the value of the #color-changer dropdown
document.getElementById("color-changer").onchange = function () {
  const colorScheme = this.value;

  fetch("./color_schemes.json")
    .then((response) => response.json())
    .then((data) => {
      if (!(colorScheme in data)) return;
      changeColorScheme(data[colorScheme]);
    })
    .catch((error) => console.error(`Error switching color schemes: ${error}`));
};
