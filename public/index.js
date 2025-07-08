const defaultColorScheme = localStorage.getItem("theme") ?? "gruvbox";
const root = document.querySelector(":root");

const SUNNYVALE_LAT = 37.371111;
const SUNNYVALE_LONG = -122.0375;

let rateLimited = false;

function formatDate(date) {
  const month = date.getMonth() + 1;
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  if (day == new Date().getDate()) {
    return "today";
  } else if (day == new Date().getDate() - 1) {
    return "yesterday";
  } else {
    return `${month}/${day}/${year}`;
  }
}

function addLinkElement(repoId) {
  const listElement = document.createElement("li");
  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", reposJson[repoId].html_url);
  if (reposJson[repoId].description) {
    linkElement.innerText = reposJson[repoId].description;
  } else {
    linkElement.innerText = reposJson[repoId].name;
  }
  listElement.appendChild(linkElement);
  listElement.append(
    ` (last pushed ${formatDate(new Date(reposJson[repoId].pushed_at))})`
  );
  document.getElementById("repo-list").appendChild(listElement);
}

function setDefaultColorScheme() {
  document.getElementById("color-changer").value = defaultColorScheme;
  fetch("/color_schemes.json")
    .then((response) => response.json())
    .then((data) => changeColorScheme(data[defaultColorScheme]));
}

function changeColorScheme(colorSchemeObject) {
  // Change page background color
  localStorage.setItem("theme", document.getElementById("color-changer").value);
  console.log(
    `${document.getElementById("color-changer").value} written to localStorage`
  );
  root.style.setProperty("--background", colorSchemeObject.background);
  root.style.setProperty("--foreground", colorSchemeObject.foreground);
  root.style.setProperty("--secondary", colorSchemeObject.secondary);
  root.style.setProperty("--header", colorSchemeObject.header);
  root.style.setProperty("--link-regular", colorSchemeObject.link.regular);
  root.style.setProperty("--link-visited", colorSchemeObject.link.visited);
  root.style.setProperty("--hr", colorSchemeObject.hr);
}

// Update age and year based on...age and year
const age = new Date(new Date() - new Date("7/17/2010")).getFullYear() - 1970;

document.getElementById("age").innerText = age;

switch (age) {
  case 14:
  case 18:
    document.getElementById("year").innerText = "freshman";
    break;
  case 15:
  case 19:
    document.getElementById("year").innerText = "sophomore";
    break;
  case 16:
  case 20:
    document.getElementById("year").innerText = "junior";
    break;
  case 17:
  case 21:
    document.getElementById("year").innerText = "senior";
    break;
}

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

// API calls or anything else that takes a variable amount of time goes below heere

// Fetch all repositories I own, then use a custom sorting function to sort them by last pushed.
const repos = await fetch("https://api.github.com/users/pbhak/repos");
const reposJson = await repos.json().then((json) => {
  try {
    json.sort((repoA, repoB) => {
      repoA = new Date(repoA.pushed_at);
      repoB = new Date(repoB.pushed_at);

      return repoA > repoB ? -1 : 1;
    });

    return json;
  } catch {
    rateLimited = true;
  }
});

if (rateLimited) {
  const limited = document.createElement("li");
  limited.innerText =
    "..well, this is awkward. it looks like you just got rate limited by github. how odd.";
  document.getElementById("repo-list").appendChild(limited);
} else {
  // Take the latest 3 repositories I've pushed to and format them on the site
  addLinkElement(0);
  addLinkElement(1);
  addLinkElement(2);
}

// Update Hack Club handle based on whether or not I'm online
await fetch("https://utilities.pbhak.dev/online")
  .then((response) => response.json())
  .then((data) => {
    if (data)
      document.getElementById("slack-presence").innerText =
        " (currently online!)";
  });

// Get approximate location of user and update location text with a tooltip based on it
const locationSpan = document.getElementById("location");
