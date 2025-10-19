// Initial list of quotes
let quotes = [
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "motivation" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "inspiration" }
];

// Get DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const categorySelect = document.getElementById('categorySelect');
const newQuoteButton = document.getElementById('newQuote');

// Show a random quote from the selected category
function showRandomQuote() {
  const selectedCategory = categorySelect.value;

  // Filter quotes by category
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

  // Add quote to array
  quotes.push({ text: quoteText, category: quoteCategory });

  // Add new category to dropdown if needed
  addCategoryToDropdown(quoteCategory);

  // Clear input fields
  quoteTextInput.value = '';
  quoteCategoryInput.value = '';

  alert("Quote added successfully!");
}

// Add category to the dropdown if it doesn't already exist
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

// Populate dropdown on load
window.onload = () => {
  const uniqueCategories = [...new Set(quotes.map(q => q.category.toLowerCase()))];
  uniqueCategories.forEach(cat => {
    addCategoryToDropdown(cat);
  });
};

// Event listener for quote button
newQuoteButton.addEventListener('click', showRandomQuote);
