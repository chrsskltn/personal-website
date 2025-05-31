document.addEventListener('DOMContentLoaded', function() { // Wait for the HTML to load

    const animatedSubheading = document.getElementById('animated-subheading');
    const textToAnimate = "search and you shall find";
    let charIndex = 0;
    let typingSpeed = 150; // Milliseconds per character
    let delayBeforeRestart = 2000; // Milliseconds to wait after text is typed

    function typeText() {
        if (charIndex < textToAnimate.length) {
            animatedSubheading.textContent += textToAnimate.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, typingSpeed);
        } else {
            // Text fully typed
            setTimeout(eraseAndRestart, delayBeforeRestart);
        }
    }

    function eraseAndRestart() {
        animatedSubheading.textContent = ''; // Clear the text
        charIndex = 0; // Reset character index
        // Optional: slight delay before typing starts again
        // setTimeout(typeText, 500);
        typeText(); // Start typing again immediately
    }

    // Initial call to start the animation
    typeText();

});