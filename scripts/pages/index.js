function getRecipes() {
    return recipes;
  }

function displayData(recipes) {
    const recipesSection = document.querySelector(".recipes-section");
    //La méthode forEach() permet d'appliquer la fonction à chaque photographe
    recipes.forEach((recipe) => {
        //On créé une variable photographerModel qui se base sur la factory fonction photographerFactory()
        const recipesModel = recipesFactory(recipe);
        const recipeCardDOM = recipesModel.getRecipeCardDOM();
        recipesSection.appendChild(recipeCardDOM);
    });
}

function init() {
    // Récupère les datas des photographes
    const recipes = getRecipes();
    displayData(recipes);
}

init();
