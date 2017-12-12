window.addEventListener("load", function() {
  const loading = document.getElementById("loading");
  const foot = document.getElementById("foot");
  // show footer
  foot.classList.add("footSlideUp");
  setTimeout(() => {
    loading.classList.add("fadeOut");
  }, 290);
  // foot.classList.add("fadeIn");
});

// window.addEventListener("load", function test() {
//   tumlare.queryDB();
// });
