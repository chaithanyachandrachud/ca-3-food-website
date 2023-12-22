document.addEventListener('DOMContentLoaded', loadRandomMeal);

function loadRandomMeal() {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => displayMeal(data.meals[0]))
        .catch(error => console.error('Error fetching random meal:', error));
}

function displayMeal(meal) {
    const mealDisplay = document.getElementById('mealDisplay');
    mealDisplay.dataset.mealId = meal.idMeal; // Store meal ID for later use
    mealDisplay.innerHTML = `
        <h2 id="name1">${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" id="img1" alt="${meal.strMeal}" onclick="showRandomMealDetails()">
    `;
}

function showRandomMealDetails() {
    const mealDisplay = document.getElementById('mealDisplay');
    const mealId = mealDisplay.dataset.mealId;

    if (mealId) {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then(response => response.json())
            .then(data => displayMealDetails(data.meals[0]))
            .catch(error => console.error('Error fetching meal details:', error));
    }
}

function displayMealDetails(meal) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
        <div class="popup-content">
            <h2>${meal.strMeal}</h2>
            <div class="popup-details">
                <div class="ingredients">
                    <h3>Ingredients</h3>
                    <ul>
                        ${createIngredientList(meal)}
                    </ul>
                </div>
                <div class="instructions">
                    <h3>Instructions</h3>
                    <p>${meal.strInstructions}</p>
                </div>
            </div>
            <button class="close-btn" onclick="closePopup()">Close</button>
        </div>
    `;
    document.body.appendChild(popup);
    // Use setTimeout to allow for DOM rendering before applying styles
    setTimeout(() => {
        popup.style.display = 'flex';
    }, 0);
}

function createIngredientList(meal) {
    let ingredientList = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== '') {
            ingredientList += `<li>${measure ? `${measure} ` : ''}${ingredient}</li>`;
        }
    }
    return ingredientList;
}

function closePopup() {
    const popup = document.querySelector('.popup');
    if (popup) {
        popup.style.display = 'none';
        document.body.removeChild(popup); // Remove the popup from the DOM
    }
}

function searchMeal() {
    const searchInput = document.getElementById('searchInput').value.trim();

    if (searchInput !== '') {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchInput}`)
            .then(response => response.json())
            .then(data => displaySearchResults(data.meals))
            .catch(error => console.error('Error fetching search results:', error));
    }
}

function displaySearchResults(meals) {
    const mealDisplay = document.getElementById('mealDisplay');
    mealDisplay.innerHTML = ''; // Clear previous results

    if (meals) {
        const gridContainer = document.createElement('div');
        gridContainer.classList.add('grid-container');
        

        meals.forEach(meal => {
            const mealCard = document.createElement('div');
            mealCard.classList.add('meal-card');
            mealCard.innerHTML = `
                <h2>${meal.strMeal}</h2>
                <img src="${meal.strMealThumb}" class="img2" alt="${meal.strMeal}" onclick="showIngredients('${meal.strIngredient1}', '${meal.strIngredient2}', '${meal.strIngredient3}')">
            `;
            gridContainer.appendChild(mealCard);
        });

        mealDisplay.appendChild(gridContainer);
    } else {
        mealDisplay.innerHTML = '<p>No results found.</p>';
    }
}