// Slideshow functionality
let slideIndex = 1;

// Initialize the slideshow when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize event tracking
    initializeEventTracking();
    
    // Log page view on initial load
    logEvent('view', 'page', document.title || 'Unknown Page');
    
    // Initialize slideshow if we're on the birthplace page
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
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

// Event tracking functionality
function initializeEventTracking() {
    // Track all clicks on the document
    document.addEventListener('click', function(event) {
        // Get the clicked element
        const element = event.target;
        
        // Determine element type for more descriptive logging
        let elementType = element.tagName.toLowerCase();
        let description = '';
        
        // Add more details based on element type
        if (elementType === 'a') {
            description = element.textContent || element.href || 'link';
        } else if (elementType === 'button') {
            description = element.textContent || element.id || 'button';
        } else if (elementType === 'img') {
            description = element.alt || element.src.split('/').pop() || 'image';
        } else if (element.classList.contains('box')) {
            elementType = 'navigation box';
            const heading = element.querySelector('h3');
            description = heading ? heading.textContent : 'Unknown box';
        } else if (element.classList.contains('dot')) {
            elementType = 'slideshow dot';
            const index = Array.from(document.querySelectorAll('.dot')).indexOf(element) + 1;
            description = `dot ${index}`;
        } else if (element.classList.contains('prev')) {
            elementType = 'slideshow control';
            description = 'previous button';
        } else if (element.classList.contains('next')) {
            elementType = 'slideshow control';
            description = 'next button';
        } else if (elementType === 'li' || element.parentElement.tagName === 'LI') {
            elementType = 'nav item';
            description = element.textContent || 'menu item';
        } else {
            // For other elements, try to get some identifying information
            description = element.id || element.className || element.textContent || 'unknown element';
        }
        
        // Log the click event
        logEvent('click', elementType, description);
    });
    
    // Track viewport visibility changes to log page views
    // Using the Page Visibility API
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            logEvent('view', 'page', document.title || 'Unknown Page');
        }
    });
}

function logEvent(eventType, objectType, description) {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}, ${eventType}, ${objectType}: ${description}`);
}

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
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    
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
    
    // Log slide viewing event
    const currentSlideCaption = slides[slideIndex-1].querySelector('.slide-caption');
    const slideDescription = currentSlideCaption ? currentSlideCaption.textContent : `slide ${slideIndex}`;
    logEvent('view', 'slide', slideDescription);
}

// Search functionality
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchText = searchInput.value.toLowerCase();
    if (!searchText) return;
    
    // Log search event
    logEvent('click', 'search', `Search for: ${searchText}`);
    
    // Remove previous highlights
    removeHighlights();
    
    // Get all text nodes in the main content
    const mainContent = document.querySelector('main');
    if (!mainContent) return;
    
    let matchesFound = searchInNode(mainContent, searchText);
    
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
        // Log search results found event
        logEvent('view', 'search results', `Found ${matchesFound} matches for: ${searchText}`);
    } else {
        alert(`No matches found for "${searchText}"`);
        // Log no search results event
        logEvent('view', 'search results', `No matches found for: ${searchText}`);
    }
}

function searchInNode(node, searchText) {
    let count = 0;
    
    // Check if node exists
    if (!node) return count;
    
    if (node.nodeType === 3) { // Text node
        const text = node.nodeValue.toLowerCase();
        if (text.includes(searchText)) {
            try {
                // Replace the text with highlighted version
                const highlightedText = node.nodeValue.replace(
                    new RegExp(`(${escapeRegExp(searchText)})`, 'gi'),
                    '<span class="highlight">$1</span>'
                );
                
                // Create a temporary element to hold the highlighted HTML
                const tempElement = document.createElement('span');
                tempElement.innerHTML = highlightedText;
                
                // Replace the text node with the highlighted element
                if (node.parentNode) {
                    node.parentNode.replaceChild(tempElement, node);
                }
                
                // Count occurrences
                const matches = text.match(new RegExp(escapeRegExp(searchText), 'gi'));
                count += matches ? matches.length : 0;
            } catch (e) {
                console.error("Error highlighting text:", e);
            }
        }
    } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') { // Element node
        // Clone the childNodes array to avoid modification during iteration
        if (node.childNodes) {
            const childNodes = Array.from(node.childNodes);
            for (const child of childNodes) {
                count += searchInNode(child, searchText);
            }
        }
    }
    
    return count;
}

function removeHighlights() {
    const highlights = document.querySelectorAll('.highlight');
    
    highlights.forEach(highlight => {
        try {
            // Get the parent node
            const parent = highlight.parentNode;
            if (!parent) return;
            
            // Create a text node with the highlighted text
            const text = document.createTextNode(highlight.textContent || "");
            
            // Replace the highlight element with the text node
            parent.replaceChild(text, highlight);
            
            // Normalize the parent node to merge adjacent text nodes
            parent.normalize();
        } catch (e) {
            console.error("Error removing highlight:", e);
        }
    });
}

// Helper function to escape special characters in search string for RegExp
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Track page navigation events
window.addEventListener('hashchange', function() {
    logEvent('view', 'page', `Hash changed to: ${location.hash}`);
});

window.addEventListener('popstate', function() {
    logEvent('view', 'page', `Navigated to: ${document.title || location.pathname}`);
});

// Track when user interacts with the CV embed
// Add error handling and cleanup
window.addEventListener('load', function() {
    const cvEmbed = document.querySelector('.cv-embed iframe');
    
    if (!cvEmbed) return; // Exit early if no embed found

    logEvent('view', 'cv', 'CV document loaded');

    const focusHandler = () => logEvent('click', 'cv', 'CV document interaction');
    
    cvEmbed.addEventListener('focus', focusHandler);
    
    // Cleanup listener if needed later
    return () => cvEmbed.removeEventListener('focus', focusHandler);
});