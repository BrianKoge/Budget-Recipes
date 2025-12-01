# Budget Recipes Website

A responsive recipe website with Kenyan and global recipes.

## Live Demo

[https://budgetrecipe.netlify.app/](https://budgetrecipe.netlify.app/)

## Source Code

[GitHub Repository](https://github.com/BrianKoge/Budget-Recipes.git)

## Features

- Modern responsive design that works on desktop and mobile devices
- Dark mode support with automatic system preference detection
- Recipe browsing with filtering by category (Kenyan/Global) and cooking time
- Quick meal filter for recipes that take 15 minutes or less
- Modal popups for detailed recipe views
- XML-based data storage for recipe information
- Accessible navigation with keyboard support
- Hamburger menu for mobile devices

## Files

- `index.html` - Home page with featured recipes
- `recipes.html` - Main recipe browsing page
- `aboutus.html` - About the website and mission
- `contact.html` - Contact form and information
- `recipes.xml` - XML data file containing all recipe information
- `style.css` - Main stylesheet with responsive design
- `scripts/script.js` - JavaScript functionality for navigation, dark mode, and recipe display

## How to Use

1. Open `index.html` in a web browser to view the home page
2. Navigate to the Recipes page to browse all recipes
3. Use the filter buttons to sort recipes by category or cooking time
4. Click "View Recipe" on any recipe card to see detailed instructions
5. Toggle dark mode using the moon/sun icon in the navigation bar

## Recipe Data

Recipes are stored in `recipes.xml` in a structured format including:
- Recipe name and description
- Preparation and cooking times
- Servings and cost information
- Ingredients list
- Step-by-step instructions
- Cooking tips

## Technologies Used

- HTML5
- CSS3 (Flexbox and Grid layouts)
- JavaScript (DOM manipulation and XMLHttpRequest for XML loading)
- XML for data storage

## Accessibility Features

- Keyboard navigation support
- Focus indicators for interactive elements
- Semantic HTML structure
- ARIA attributes for screen readers
- High contrast mode support
- Reduced motion preferences support