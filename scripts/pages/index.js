//Fonction qui retourne le tableau recipes
function getRecipes() {
    return recipes;
  }

//Fonction pour gérer l'affichage des recettes
function displayData(recipes) {
    const recipesSection = document.querySelector(".recipes-section");
    //La méthode forEach() permet d'appliquer la fonction à chaque recette
    recipesSection.innerHTML = '';

  recipes.forEach(recipe => {
    const recipesModel = recipesFactory(recipe);
    const recipeCardDOM = recipesModel.getRecipeCardDOM();
    recipesSection.appendChild(recipeCardDOM);
  });
}


function init() {
    const recipes = getRecipes();
    displayData(recipes);
    filterRecipes();
    displayFilters();
}

init();
