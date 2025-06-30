Array.from(document.getElementById("writings-list").children).forEach(
  (child, childIndex) => {
    console.log(
      childIndex,
      document.querySelectorAll("#writings-list > li").length
    );
    if (
      childIndex + 1 !==
      document.querySelectorAll("#writings-list > li").length
    ) {
      child.insertAdjacentHTML("afterend", "<hr>");
    }
  }
);
