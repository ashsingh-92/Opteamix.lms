/* app.js - LMS Dashboard */

/* ---------- Trainings ---------- */
function addTraining() {
  const input = document.getElementById("new-training");
  const trainingName = input.value.trim();
  if (!trainingName) {
    alert("Please enter a training name!");
    return;
  }

  // Add to DOM
  const list = document.getElementById("training-list");
  const li = document.createElement("li");
  const strong = document.createElement("strong");
  strong.textContent = trainingName;
  li.appendChild(strong);
  li.appendChild(document.createTextNode(" – Enrolled: None yet"));
  list.appendChild(li);

  // Save to localStorage
  const saved = JSON.parse(localStorage.getItem("trainings") || "[]");
  saved.push({ name: trainingName, enrolled: "None yet" });
  localStorage.setItem("trainings", JSON.stringify(saved));

  input.value = "";
}

function loadTrainings() {
  const saved = JSON.parse(localStorage.getItem("trainings") || "[]");
  const list = document.getElementById("training-list");
  saved.forEach(training => {
    const li = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = training.name;
    li.appendChild(strong);
    li.appendChild(document.createTextNode(" – Enrolled: " + training.enrolled));
    list.appendChild(li);
  });
}

/* ---------- Course Search ---------- */
function searchCourses() {
  const query = document.getElementById("search-input").value.trim().toLowerCase();
  const suggestionsList = document.getElementById("suggestions-list");
  suggestionsList.innerHTML = "";

  if (!query) {
    alert("Please enter a keyword to search!");
    return;
  }

  const courses = {
    ai: [
      { name: "AI for Everyone - Coursera", url: "https://www.coursera.org/learn/ai-for-everyone" },
      { name: "Machine Learning - Coursera", url: "https://www.coursera.org/learn/machine-learning" }
    ],
    leadership: [
      { name: "Leadership Principles - edX", url: "https://online.hbs.edu/courses/leadership-principles/" },
      { name: "Emotional Intelligence - Coursera", url: "https://www.coursera.org/learn/emotional-intelligence" }
    ]
  };

  let results = [];
  if (query.includes("ai")) results = courses.ai;
  else if (query.includes("leader")) results = courses.leadership;

  if (results.length > 0) {
    results.forEach(course => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = course.url;
      a.target = "_blank";
      a.textContent = course.name;
      li.appendChild(a);
      suggestionsList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "No results found. Try another keyword.";
    suggestionsList.appendChild(li);
  }
}

/* ---------- Quote of the Day ---------- */
function showQuote() {
  const quotes = [
    "“Learning never exhausts the mind.” – Leonardo da Vinci",
    "“An investment in knowledge pays the best interest.” – Benjamin Franklin",
    "“The beautiful thing about learning is that no one can take it away from you.” – B.B. King",
    "“Education is the most powerful weapon which you can use to change the world.” – Nelson Mandela"
  ];
  const random = Math.floor(Math.random() * quotes.length);
  document.getElementById("quote").textContent = quotes[random];
}

/* ---------- Welcome User ---------- */
function showWelcome() {
  const username = localStorage.getItem("username");
  if (username) {
    document.getElementById("welcome-user").textContent = `Hello, ${username}! Ready to learn today?`;
  }
}

/* ---------- On Page Load ---------- */
window.onload = function() {
  loadTrainings();
  showQuote();
  showWelcome();
};
