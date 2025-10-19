// Initial array of quotes
let quotes = [
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "motivation" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "inspiration" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelect = document.getElementById("categorySelect");
const newQuoteButton = document.getElementById("newQuote");

// Show a random quote
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    // ✅ Use innerHTML here
    quoteDisplay.innerHTML = "<p>No quotes found for this category.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  // ✅ Use innerHTML to show the quote
  quoteDisplay.innerHTML = `<p>"${quote.text}" — <em>${quote.category}</em></p>`;
}

// Add a new quote
function addQuote() {
  const quoteTextInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");

  const text = quoteTextInput.value.trim();
  const category = quoteCategoryInput.value.trim().toLowerCase();

  if (text === "" || category === "") {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text, category });
  addCategoryToDropdown(category);

  quoteTextInput.value = "";
  quoteCategoryInput.value = "";

  alert("Quote added successfully!");
}

// ✅ Create the add-quote form using createElement + appendChild
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteFormContainer");

  const inputText = document.createElement("input");
  inputText.setAttribute("id", "newQuoteText");
  inputText.setAttribute("type", "text");
  inputText.setAttribute("placeholder", "Enter a new quote");

  const inputCategory = document.createElement("input");
  inputCategory.setAttribute("id", "newQuoteCategory");
  inputCategory.setAttribute("type", "text");
  inputCategory.setAttribute("placeholder", "Enter quote category");

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  // ✅ Use appendChild to add elements to the form
  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);
}

// Add category to dropdown (if it doesn’t already exist)
function addCategoryToDropdown(category) {
  const options = Array.from(categorySelect.options).map(opt => opt.value.toLowerCase());

  if (!options.includes(category.toLowerCase())) {
    const newOption = document.createElement("option");
    newOption.value = category;
    newOption.textContent = capitalize(category);
    categorySelect.appendChild(newOption);
  }
}

// Capitalize first letter of a word
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Setup on page load
window.onload = () => {
  const uniqueCategories = [...new Set(quotes.map(q => q.category.toLowerCase()))];
  uniqueCategories.forEach(addCategoryToDropdown);

  // ✅ Call the required function
  createAddQuoteForm();
};

// Event listener for Show Quote button
newQuoteButton.addEventListener("click", showRandomQuote);
