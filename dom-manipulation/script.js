// Initial list of quotes
let quotes = [
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "motivation" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "inspiration" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const categorySelect = document.getElementById('categorySelect');
const newQuoteButton = document.getElementById('newQuote');

// Show random quote based on selected category
function showRandomQuote() {
  const selectedCategory = categorySelect.value;

  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(quote => quote.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found for this category.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `<p>"${quote.text}" — <em>${quote.category}</em></p>`;
}

// Add a new quote
function addQuote() {
  const quoteTextInput = document.getElementById('newQuoteText');
  const quoteCategoryInput = document.getElementById('newQuoteCategory');

  const quoteText = quoteTextInput.value.trim();
  const quoteCategory = quoteCategoryInput.value.trim().toLowerCase();

  if (quoteText === '' || quoteCategory === '') {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });
  addCategoryToDropdown(quoteCategory);

  quoteTextInput.value = '';
  quoteCategoryInput.value = '';

  alert("Quote added successfully!");
}

// Add category to dropdown if it doesn't exist
function addCategoryToDropdown(category) {
  const options = Array.from(categorySelect.options).map(opt => opt.value.toLowerCase());

  if (!options.includes(category.toLowerCase())) {
    categorySelect.innerHTML += `<option value="${category}">${capitalize(category)}</option>`;
  }
}

// Capitalize first letter
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// ✅ Required function: creates the quote form dynamically
function createAddQuoteForm() {
  const formContainer = document.getElementById('addQuoteFormContainer');

  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteButton">Add Quote</button>
  `;

  // Attach event listener to the newly created button
  const addButton = document.getElementById('addQuoteButton');
  addButton.addEventListener('click', addQuote);
}

// Page load setup
window.onload = () => {
  // Populate initial categories
  const uniqueCategories = [...new Set(quotes.map(q => q.category.toLowerCase()))];
  uniqueCategories.forEach(cat => addCategoryToDropdown(cat));

  // ✅ Create the add-quote form dynamically
  createAddQuoteForm();
};

// Event listener for showing quotes
newQuoteButton.addEventListener('click', showRandomQuote);
