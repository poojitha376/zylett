// Slideshow functionality
let slideIndex = 1;

// Initialize the slideshow when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize slideshow if we're on the birthplace page
    if (document.querySelector('.slideshow-container')) {
        showSlides(slideIndex);
    }
    
    // Add search functionality
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// Next/previous controls
function changeSlide(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    
    if (!slides.length) return;
    
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
}

// Search functionality
function performSearch() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    if (!searchText) return;
    
    // Remove previous highlights
    removeHighlights();
    
    // Get all text nodes in the main content
    const mainContent = document.querySelector('main');
    let matchesFound = 0;
    
    if (mainContent) {
        matchesFound = searchInNode(mainContent, searchText);
    }
    
    // Alert the user of the results
    if (matchesFound > 0) {
        alert(`Found ${matchesFound} matches for "${searchText}"`);
        // Scroll to the first highlighted element
        const firstHighlight = document.querySelector('.highlight');
        if (firstHighlight) {
            firstHighlight.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    } else {
        alert(`No matches found for "${searchText}"`);
    }
}

function searchInNode(node, searchText) {
    let count = 0;
    
    if (node.nodeType === 3) { // Text node
        const text = node.nodeValue.toLowerCase();
        if (text.includes(searchText)) {
            // Replace the text with highlighted version
            const highlightedText = node.nodeValue.replace(
                new RegExp(`(${searchText})`, 'gi'),
                '<span class="highlight">$1</span>'
            );
            
            // Create a temporary element to hold the highlighted HTML
            const tempElement = document.createElement('span');
            tempElement.innerHTML = highlightedText;
            
            // Replace the text node with the highlighted element
            node.parentNode.replaceChild(tempElement, node);
            
            // Count occurrences
            const matches = text.match(new RegExp(searchText, 'gi'));
            count += matches ? matches.length : 0;
        }
    } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') { // Element node
        // Clone the childNodes array to avoid modification during iteration
        const childNodes = Array.from(node.childNodes);
        for (const child of childNodes) {
            count += searchInNode(child, searchText);
        }
    }
    
    return count;
}

function removeHighlights() {
    const highlights = document.querySelectorAll('.highlight');
    
    highlights.forEach(highlight => {
        // Get the parent node
        const parent = highlight.parentNode;
        
        // Create a text node with the highlighted text
        const text = document.createTextNode(highlight.textContent);
        
        // Replace the highlight element with the text node
        parent.replaceChild(text, highlight);
        
        // Normalize the parent node to merge adjacent text nodes
        parent.normalize();
    });
}