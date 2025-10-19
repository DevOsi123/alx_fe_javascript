// Initial set of quotes
let quotes = [
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "motivation" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "inspiration" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const categorySelect = document.getElementById('categorySelect');
const newQuoteButton = document.getElementById('newQuote');

// Display a random quote
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  
  let filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" — ${filteredQuotes[randomIndex].category}`;
}

// Add a new quote
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (quoteText === '' || quoteCategory === '') {
    alert('Please fill in both fields.');
    return;
  }

  const newQuote = {
    text: quoteText,
    category: quoteCategory.toLowerCase()
  };

  quotes.push(newQuote);
  addCategoryToDropdown(quoteCategory);
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  alert("Quote added successfully!");
}

// Add new category to the dropdown if it doesn't exist
function addCategoryToDropdown(category) {
  const categoryLower = category.toLowerCase();
  const options = Array.from(categorySelect.options).map(opt => opt.value.toLowerCase());
  
  if (!options.includes(categoryLower)) {
    const newOption = document.createElement('option');
    newOption.value = category;
    newOption.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categorySelect.appendChild(newOption);
  }
}

// Event Listeners
newQuoteButton.addEventListener('click', showRandomQuote);

// Populate initial categories
window.onload = () => {
  const uniqueCategories = [...new Set(quotes.map(q => q.category.toLowerCase()))];

  uniqueCategories.forEach(category => {
    addCategoryToDropdown(category);
  });
};
