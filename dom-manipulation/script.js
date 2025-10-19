let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "motivation" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteButton = document.getElementById("newQuote");

// Notification banner
const notificationBanner = document.createElement('div');
notificationBanner.style.position = 'fixed';
notificationBanner.style.top = '0';
notificationBanner.style.left = '0';
notificationBanner.style.width = '100%';
notificationBanner.style.backgroundColor = '#ffeb3b';
notificationBanner.style.color = '#000';
notificationBanner.style.textAlign = 'center';
notificationBanner.style.padding = '10px';
notificationBanner.style.fontWeight = 'bold';
notificationBanner.style.display = 'none';
notificationBanner.style.zIndex = '1000';
document.body.appendChild(notificationBanner);

function showNotification(message) {
  notificationBanner.textContent = message;
  notificationBanner.style.display = 'block';
  setTimeout(() => {
    notificationBanner.style.display = 'none';
  }, 4000);
}

// Show random quote logic remains unchanged
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found for this category.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${quote.text}" — <em>${quote.category}</em></p>`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim().toLowerCase();

  if (!text || !category) {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  textInput.value = "";
  categoryInput.value = "";
  alert("Quote added successfully!");
}

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

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category.toLowerCase()))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = capitalize(cat);
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter && categories.includes(savedFilter)) {
    categoryFilter.value = savedFilter;
  }
}

function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid format. Expecting an array of quotes.");
      }
    } catch (err) {
      alert("Error reading JSON: " + err.message);
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

// --- New: syncQuotes function ---

async function syncQuotes() {
  try {
    // Fetch server quotes from mock API (simulate server data)
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    if (!response.ok) throw new Error('Failed to fetch from server');

    const serverData = await response.json();

    // Map server posts to quote format
    const serverQuotes = serverData.map(post => ({
      text: post.title,
      category: 'server-sync'
    }));

    // Conflict resolution: server data takes precedence
    let updated = false;
    serverQuotes.forEach(serverQuote => {
      const existsLocally = quotes.some(localQuote =>
        localQuote.text === serverQuote.text &&
        localQuote.category === serverQuote.category
      );
      if (!existsLocally) {
        quotes.push(serverQuote);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
      populateCategories();
      showNotification("Quotes updated from server.");
      showRandomQuote();
    }

    // Now post local quotes back to the server to simulate syncing local changes
    const postResponse = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quotes)
    });

    if (!postResponse.ok) throw new Error('Failed to post to server');

    showNotification("Local quotes synced to server.");

  } catch (error) {
    console.error("Sync error:", error);
    showNotification("Sync failed: " + error.message);
  }
}

// Periodic sync every 30 seconds
function startPeriodicSync() {
  syncQuotes(); // Initial sync
  setInterval(syncQuotes, 30000);
}

// Manual sync button added below the main heading
const manualSyncBtn = document.createElement('button');
manualSyncBtn.textContent = 'Sync Now';
manualSyncBtn.style.marginLeft = '10px';
manualSyncBtn.onclick = syncQuotes;
document.querySelector('h1').after(manualSyncBtn);

// --- Initialization ---
window.onload = () => {
  populateCategories();
  createAddQuoteForm();

  const lastViewed = sessionStorage.getItem("lastViewedQuote");
  if (lastViewed) {
    const quote = JSON.parse(lastViewed);
    quoteDisplay.innerHTML = `<p>"${quote.text}" — <em>${quote.category}</em></p>`;
  } else {
    showRandomQuote();
  }

  startPeriodicSync();
};

newQuoteButton.addEventListener("click", showRandomQuote);
