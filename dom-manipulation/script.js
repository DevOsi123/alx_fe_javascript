// ---------- Data & Storage Setup ----------

// Load stored quotes or default ones
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "motivation" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteButton = document.getElementById("newQuote");
const syncMessageDiv = document.getElementById("syncMessage");

// ---------- Display & Filtering ----------

function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = (selectedCategory === "all")
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found for this category.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${quote.text}" — <em>${quote.category}</em></p>`;

  // Save last viewed to session
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

function filterQuotes() {
  const sel = categoryFilter.value;
  localStorage.setItem("selectedCategory", sel);
  showRandomQuote();
}

// ---------- Persistence Helpers ----------

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ---------- Quote Addition ----------

function addQuote() {
  const inpText = document.getElementById("newQuoteText");
  const inpCategory = document.getElementById("newQuoteCategory");
  const text = inpText.value.trim();
  const category = inpCategory.value.trim().toLowerCase();

  if (!text || !category) {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();

  inpText.value = "";
  inpCategory.value = "";
  alert("Quote added successfully!");
}

// Build the add‑quote form dynamically
function createAddQuoteForm() {
  const container = document.getElementById("addQuoteFormContainer");

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  container.appendChild(inputText);
  container.appendChild(inputCategory);
  container.appendChild(addButton);
}

// Populate category filter dropdown dynamically
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category.toLowerCase()))];
  // Reset dropdown
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = capitalize(cat);
    categoryFilter.appendChild(option);
  });

  const saved = localStorage.getItem("selectedCategory");
  if (saved && categories.includes(saved)) {
    categoryFilter.value = saved;
  }
}

// Utility: capitalize first letter
function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------- Import / Export JSON ----------

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        displaySyncMessage("Imported quotes from JSON file.");
      } else {
        alert("Invalid JSON: Expect an array of quote objects.");
      }
    } catch (err) {
      alert("Failed to parse JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ---------- Sync with Mock Server ----------

// Simulate fetching quotes from server periodically and merging
async function fetchServerQuotes() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const data = await response.json();

    // Map server data into your quote structure
    const serverQuotes = data.map(post => ({
      text: post.title,
      category: "server"
    }));

    handleServerSync(serverQuotes);
  } catch (err) {
    console.error("Server fetch error:", err);
  }
}

function handleServerSync(serverQuotes) {
  let addedAny = false;

  serverQuotes.forEach(sq => {
    const exists = quotes.some(lq => lq.text === sq.text && lq.category === sq.category);
    if (!exists) {
      quotes.push(sq);
      addedAny = true;
    }
  });

  if (addedAny) {
    saveQuotes();
    populateCategories();
    displaySyncMessage("✅ Synced new quotes from server.");
  }
}

// Display a message in the UI for sync / conflict
function displaySyncMessage(msg) {
  syncMessageDiv.textContent = msg;
  syncMessageDiv.style.display = "block";
  setTimeout(() => {
    syncMessageDiv.style.display = "none";
  }, 4000);
}

// ---------- Initialization & Periodic Sync ----------

window.onload = () => {
  populateCategories();
  createAddQuoteForm();

  const last = sessionStorage.getItem("lastViewedQuote");
  if (last) {
    try {
      const q = JSON.parse(last);
      quoteDisplay.innerHTML = `<p>"${q.text}" — <em>${q.category}</em></p>`;
    } catch (_) {
      showRandomQuote();
    }
  } else {
    showRandomQuote();
  }

  // Kick off server sync immediately, then every 30 seconds
  fetchServerQuotes();
  setInterval(fetchServerQuotes, 30000);
};

newQuoteButton.addEventListener("click", showRandomQuote);
