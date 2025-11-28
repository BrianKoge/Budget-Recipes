// Dark mode toggle functionality
const modeToggle = document.getElementById('modeToggle');
const body = document.body;

// Check for saved theme preference or respect OS setting
const savedTheme = localStorage.getItem('theme');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    body.classList.add('dark-mode');
    modeToggle.textContent = '☀️';
}

modeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Update button icon
    if (body.classList.contains('dark-mode')) {
        modeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        modeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
});

// Hamburger menu functionality
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.getElementById('mobileNav');
    
    if (hamburger && mobileNav) {
        // Toggle menu function
        function toggleMenu() {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            // Update aria-expanded attribute for accessibility
            const isExpanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        }
        
        // Close menu function
        function closeMenu() {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
        
        // Add event listener to hamburger
        hamburger.addEventListener('click', toggleMenu);
        
        // Add event listeners to nav links
        const navLinks = document.querySelectorAll('.mobile-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = mobileNav.contains(event.target) || hamburger.contains(event.target);
            if (!isClickInsideNav && mobileNav.classList.contains('active')) {
                closeMenu();
            }
        });
    } else {
        // Silently fail if elements not found
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initHamburgerMenu();
    
    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            
            // For now, we'll just show a success message
            alert(`Thank you ${name}! Your message has been received. We'll contact you at ${email} soon.`);
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Load recipes from XML automatically when page loads
    loadRecipesFromXML();
});

// Function to load recipes from XML
function loadRecipesFromXML() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'recipes.xml', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                parseXMLRecipes(xhr.responseXML);
            } else {
                // Check if recipeContainer exists before trying to access it
                const recipeContainer = document.getElementById('recipeContainer');
                if (recipeContainer) {
                    recipeContainer.innerHTML = '<p>Error loading recipes. Please try again later.</p>';
                }
            }
        }
    };
    xhr.onerror = function() {
        // Check if recipeContainer exists before trying to access it
        const recipeContainer = document.getElementById('recipeContainer');
        if (recipeContainer) {
            recipeContainer.innerHTML = '<p>Network error occurred. Please check your connection and try again.</p>';
        }
    };
    xhr.send();
}

// Function to parse XML and display recipes
function parseXMLRecipes(xmlDoc) {
    if (!xmlDoc) {
        // Check if recipeContainer exists before trying to access it
        const recipeContainer = document.getElementById('recipeContainer');
        if (recipeContainer) {
            recipeContainer.innerHTML = '<p>Error parsing recipes. Please try again later.</p>';
        }
        return;
    }
    
    const recipes = xmlDoc.getElementsByTagName('recipe');
    const recipeContainer = document.getElementById('recipeContainer');
    
    // Check if recipeContainer exists
    if (!recipeContainer) {
        return;
    }
    
    // Clear container
    recipeContainer.innerHTML = '';
    
    // Loop through recipes and create HTML
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        
        // Get recipe data
        const id = recipe.getAttribute('id');
        const category = recipe.getAttribute('category');
        const name = recipe.getElementsByTagName('name')[0].textContent;
        const description = recipe.getElementsByTagName('description')[0].textContent;
        const image = recipe.getElementsByTagName('image')[0].textContent;
        const prepTime = recipe.getElementsByTagName('prepTime')[0].textContent;
        const cookTime = recipe.getElementsByTagName('cookTime')[0].textContent;
        const servings = recipe.getElementsByTagName('servings')[0].textContent;
        const cost = recipe.getElementsByTagName('cost')[0].textContent;
        const costCurrency = recipe.getElementsByTagName('cost')[0].getAttribute('currency');
        
        // Create recipe card
        const recipeCard = document.createElement('article');
        recipeCard.className = 'card recipe-card';
        recipeCard.setAttribute('data-category', category);
        recipeCard.setAttribute('data-time', parseInt(prepTime) + parseInt(cookTime));
        recipeCard.setAttribute('tabindex', '0'); // Make card focusable for accessibility
        
        recipeCard.innerHTML = `
            <img src="${image}" alt="${name}">
            <div class="card-content">
                <h3>${name}</h3>
                <p>${description}</p>
                <div class="recipe-meta">
                    <span class="meta-item">⏱️ ${parseInt(prepTime) + parseInt(cookTime)} mins</span>
                    <span class="meta-item">👥 ${servings} servings</span>
                    <span class="meta-item">💰 ${costCurrency} ${cost}</span>
                </div>
                <button class="btn view-recipe-btn" data-id="${id}" aria-label="View recipe for ${name}">View Recipe</button>
            </div>
        `;
        
        recipeContainer.appendChild(recipeCard);
    }
    
    // Add event listeners to view recipe buttons
    const viewRecipeButtons = document.querySelectorAll('.view-recipe-btn');
    viewRecipeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const recipeId = this.getAttribute('data-id');
            showRecipeModal(recipeId);
        });
        
        // Add keyboard support for buttons
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const recipeId = this.getAttribute('data-id');
                showRecipeModal(recipeId);
            }
        });
    });
    
    // Add event listeners for filtering
    addFilterEventListeners();
}

// Function to show recipe in modal
function showRecipeModal(recipeId) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'recipes.xml', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            displayRecipeInModal(xhr.responseXML, recipeId);
        }
    };
    xhr.send();
}

// Function to display recipe in modal
function displayRecipeInModal(xmlDoc, recipeId) {
    if (!xmlDoc) return;
    
    const recipes = xmlDoc.getElementsByTagName('recipe');
    let selectedRecipe = null;
    
    // Find the recipe with the matching ID
    for (let i = 0; i < recipes.length; i++) {
        if (recipes[i].getAttribute('id') === recipeId) {
            selectedRecipe = recipes[i];
            break;
        }
    }
    
    if (!selectedRecipe) return;
    
    // Get recipe data
    const name = selectedRecipe.getElementsByTagName('name')[0].textContent;
    const description = selectedRecipe.getElementsByTagName('description')[0].textContent;
    const image = selectedRecipe.getElementsByTagName('image')[0].textContent;
    const prepTime = selectedRecipe.getElementsByTagName('prepTime')[0].textContent;
    const cookTime = selectedRecipe.getElementsByTagName('cookTime')[0].textContent;
    const servings = selectedRecipe.getElementsByTagName('servings')[0].textContent;
    const cost = selectedRecipe.getElementsByTagName('cost')[0].textContent;
    const costCurrency = selectedRecipe.getElementsByTagName('cost')[0].getAttribute('currency');
    const difficulty = selectedRecipe.getElementsByTagName('difficulty')[0].textContent;
    
    // Get ingredients
    const ingredients = selectedRecipe.getElementsByTagName('ingredients')[0];
    const ingredientList = ingredients.getElementsByTagName('ingredient');
    let ingredientsHTML = '';
    for (let i = 0; i < ingredientList.length; i++) {
        ingredientsHTML += `<li>${ingredientList[i].textContent}</li>`;
    }
    
    // Get steps
    const steps = selectedRecipe.getElementsByTagName('steps')[0];
    const stepList = steps.getElementsByTagName('step');
    let stepsHTML = '';
    for (let i = 0; i < stepList.length; i++) {
        stepsHTML += `<li>${stepList[i].textContent}</li>`;
    }
    
    // Get tips
    const tips = selectedRecipe.getElementsByTagName('tips')[0];
    const tipList = tips.getElementsByTagName('tip');
    let tipsHTML = '';
    for (let i = 0; i < tipList.length; i++) {
        tipsHTML += `<li>${tipList[i].textContent}</li>`;
    }
    
    // Create modal content
    const modalContent = document.getElementById('modalRecipeContent');
    modalContent.innerHTML = `
        <div class="recipe-header">
            <h1>${name}</h1>
            <p>${description}</p>
            <img src="${image}" alt="${name}" class="recipe-image">
            
            <div class="recipe-meta">
                <span class="meta-item">⏱️ Prep: ${prepTime} mins</span>
                <span class="meta-item">⏱️ Cook: ${cookTime} mins</span>
                <span class="meta-item">👥 Servings: ${servings}</span>
                <span class="meta-item">💰 Cost: ${costCurrency} ${cost}</span>
                <span class="meta-item">⭐ Difficulty: ${difficulty}</span>
            </div>
        </div>

        <div class="recipe-ingredients">
            <h2>Ingredients</h2>
            <ul>
                ${ingredientsHTML}
            </ul>
        </div>

        <div class="recipe-steps">
            <h2>Instructions</h2>
            <ol>
                ${stepsHTML}
            </ol>
        </div>

        <div class="recipe-tips">
            <h2>Cooking Tips</h2>
            <ul>
                ${tipsHTML}
            </ul>
        </div>
    `;
    
    // Show modal
    const modal = document.getElementById("recipeModal");
    modal.style.display = "block";
    
    // Focus the close button for accessibility
    const closeButton = document.querySelector(".modal .close");
    if (closeButton) {
        closeButton.focus();
    }
    
    // Add close functionality
    if (closeButton) {
        closeButton.onclick = function() {
            modal.style.display = "none";
        }
        
        // Add keyboard support for close button
        closeButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                modal.style.display = "none";
            }
        });
    }
}

// Function to add filter event listeners
function addFilterEventListeners() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter category
            const filter = this.getAttribute('data-filter');
            
            // Filter recipes
            recipeCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else if (filter === 'quick') {
                    // For quick meals, show recipes with 15 mins or less
                    const totalTime = parseInt(card.getAttribute('data-time'));
                    card.style.display = totalTime <= 15 ? 'block' : 'none';
                } else {
                    // For kenyan or global filters
                    const cardCategory = card.getAttribute('data-category');
                    if (cardCategory === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
        
        // Add keyboard support for filter buttons
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Trigger click event
                this.click();
            }
        });
    });
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    const modal = document.getElementById("recipeModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Keyboard navigation support for modals
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById("recipeModal");
    if (modal && modal.style.display === "block") {
        if (e.key === 'Escape') {
            modal.style.display = "none";
        }
    }
});

// Function to load recipes from XML (as referenced in original recipes.html)
function loadXML() {
    // This function is now replaced by the new implementation
    console.log("Loading recipes from XML...");
    loadRecipesFromXML();
}