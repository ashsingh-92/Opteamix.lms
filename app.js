// -------- LOGIN HANDLER --------
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      window.location.href = "dashboard.html"; 
    });
  }
});

// -------- DASHBOARD FUNCTIONS --------
function openTab(evt, tabName) {
  let contents = document.getElementsByClassName("tab-content");
  let buttons = document.getElementsByClassName("tab-btn");

  for (let i = 0; i < contents.length; i++) {
    contents[i].style.display = "none";
    contents[i].classList.remove("active");
  }
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }

  document.getElementById(tabName).style.display = "block";
  document.getElementById(tabName).classList.add("active");
  evt.currentTarget.classList.add("active");
}

// Add new training
function addTraining() {
  let trainingInput = document.getElementById("newTraining");
  let trainingList = document.getElementById("trainingList");

  if (trainingInput.value.trim() !== "") {
    let li = document.createElement("li");
    li.textContent = trainingInput.value + " - Enrolled: None yet";
    trainingList.appendChild(li);
    trainingInput.value = "";
  }
}

// Course suggestions
function suggestCourse() {
  let query = document.getElementById("searchCourse").value.toLowerCase();
  let suggestionList = document.getElementById("suggestionList");
  suggestionList.innerHTML = "";

  let courses = [
    { name: "Leadership Skills", url: "https://www.coursera.org/courses?query=leadership" },
    { name: "Time Management", url: "https://www.coursera.org/courses?query=time%20management" },
    { name: "Python Programming", url: "https://www.coursera.org/courses?query=python" },
    { name: "Data Science", url: "https://www.coursera.org/courses?query=data%20science" },
    { name: "Project Management", url: "https://www.coursera.org/courses?query=project%20management" }
  ];

  let filtered = courses.filter(c => c.name.toLowerCase().includes(query));

  if (filtered.length === 0) {
    suggestionList.innerHTML = "<li>No courses found.</li>";
  } else {
    filtered.forEach(course => {
      let li = document.createElement("li");
      let a = document.createElement("a");
      a.href = course.url;
      a.target = "_blank";
      a.textContent = course.name;
      li.appendChild(a);
      suggestionList.appendChild(li);
    });
  }
}
