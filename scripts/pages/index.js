//Fonction qui retourne le tableau recipes
function getRecipes() {
    return recipes;
  }

//Fonction pour gérer l'affichage des recettes
function displayData(recipes) {
  const recipesSection = document.querySelector(".recipes-section");
  const noRecipesMessage = document.querySelector(".no-recipes-message");
  const recipeCount = document.querySelector(".recipe-count");
  
  //On créé une condition pour vérifier si le tableau des recettes est vide
  if (recipes.length === 0) {
    //S'il est vide, on affiche un message d'erreur, avec le contenu de ce qui a été entré dans la barre de recherche
    noRecipesMessage.textContent = `Aucune recette ne contient "${mainSearch.value}".`;
    recipesSection.innerHTML = "";
  } else {
    //Le message est vide si des recettes sont là
    noRecipesMessage.textContent = "";
    recipesSection.innerHTML = "";
    recipes.forEach(recipe => {
      const recipesModel = recipesFactory(recipe);
      const recipeCardDOM = recipesModel.getRecipeCardDOM();
      recipesSection.appendChild(recipeCardDOM);
    });
    recipeCount.textContent = `${recipes.length} recettes`;
  }
}


function init() {
    const recipes = getRecipes();
    displayData(recipes);
    filterRecipes();
    displayFilters();
}

init();
