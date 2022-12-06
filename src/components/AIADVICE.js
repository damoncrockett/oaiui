// Get the textarea element
var textarea = document.getElementById('myTextarea');

// Get the selected text
var start = textarea.selectionStart;
var end = textarea.selectionEnd;
var selectedText = textarea.value.substring(start, end);

// Output the selected text
console.log(selectedText);


// Get the textarea element
var textarea = document.getElementById('myTextarea');

// Change the text inside the textarea
textarea.value = "This is the new text inside the textarea";


// Get the textarea element
var textarea = document.getElementById('myTextarea');

// Add new text to the end of the existing text inside the textarea
textarea.value += " This is the new text that will be appended to the end of the existing text.";


// Get the textarea element
var textarea = document.getElementById('myTextarea');

// Change the text inside the textarea
textarea.value = "This is the new text inside the textarea";

// Trigger the change event to update the text that is displayed on the page
textarea.dispatchEvent(new Event('change'));


// Get the textarea element
var textarea = document.getElementById('myTextarea');

// Create a selection that starts at the 10th character and ends at the 20th character
textarea.setSelectionRange(10, 20);


// Get the textarea element
var textarea = document.getElementById('myTextarea');

// Focus the textarea
textarea.focus();

// Create a selection that starts at the 10th character and ends at the 20th character
textarea.setSelectionRange(10, 20);


// Get the textarea element
var textarea = document.getElementById('myTextarea');

// Set the initial number of rows and columns for the textarea
textarea.rows = 1;
textarea.cols = 20;

// Listen for changes to the text inside the textarea
textarea.addEventListener('input', function() {
  // Calculate the number of rows and columns needed to fit the text
  var numRows = Math.ceil(textarea.scrollHeight / textarea.offsetHeight);
  var numCols = Math.ceil(textarea.scrollWidth / textarea.offsetWidth);

  // Set the number of rows and columns for the textarea
  textarea.rows = numRows;
  textarea.cols = numCols;
});


