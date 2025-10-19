// Array of initial quotes
let quotes = [
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "motivation" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "inspiration" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelect = document.getElementById("categorySelect");
const newQuoteButton = document.getElementById("newQuote");

// Function to show a random quote
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
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
}

// Function to add a new quote
function addQuote() {
  const quoteTextInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");

  const text = quoteTextInput.value.trim();
  const category = quoteCategoryInput.value.trim().toLowerCase();

  if (text === "" || category === "") {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text: text, category: category });

  addCategoryToDropdown(category);

  quoteTextInput.value = "";
  quoteCategoryInput.value = "";

  alert("Quote added successfully!");
}

// ✅ Function required: creates the quote form using innerHTML
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteFormContainer");

  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteButton">Add Quote</button>
  `;

  // Attach event listener to the "Add Quote" button
  document.getElementById("addQuoteButton").addEventListener("click", addQuote);
}

// Function to add category to dropdown (if not already there)
function addCategoryToDropdown(category) {
  const options = Array.from(categorySelect.options).map(opt => opt.value.toLowerCase());

  if (!options.includes(category.toLowerCase())) {
    // Use innerHTML to add a new <option>
    categorySelect.innerHTML += `<option value="${category}">${capitalize(category)}</option>`;
  }
}

// Capitalize the first letter of a string
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Initialize on page load
window.onload = () => {
  // Populate categories into dropdown
  const uniqueCategories = [...new Set(quotes.map(q => q.category.toLowerCase()))];
  uniqueCategories.forEach(addCategoryToDropdown);

  // Create the quote form dynamically
  createAddQuoteForm();
};

// Event listener to show quote
newQuoteButton.addEventListener("click", showRandomQuote);
