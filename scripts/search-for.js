////////////////////////// Code utilisant les boucles for //////////////////////////


//Variables pour récupérer les classes CSS du HTML
const ingredientList = document.querySelector(".ingredient-list");
const applianceList = document.querySelector(".appliance-list");
const utensilList = document.querySelector(".utensil-list");
const filterSection = document.querySelector(".filter-section");
const filtersAdded = document.querySelector(".filters-added");
const filtersDiv = document.querySelector(".filter-container");
const mainSearch = document.querySelector(".main-search");
const clearSearchIcon = document.querySelector(".clear-search");
const recipesSection = document.querySelector(".recipes-section");


//Sets pour stocker les valeurs uniques des ingrédients, appareils et ustensiles
//Les Set() stockent des valeurs uniques de manière non ordonnée, contrairement aux tableaux
const uniqueIngredients = new Set();
const uniqueAppliances = new Set();
const uniqueUtensils = new Set();

//Sets pour stocker les valeurs filtrées des ingrédients, appareils et ustensiles
const filteredIngredients = new Set();
const filteredAppliances = new Set();
const filteredUtensils = new Set();

//Fonction pour normaliser la casse du texte, pour que tout soit en minuscule
//Cela va nous permettre d'éviter les doublons pour certains ingrédients qui sont parfois réécrits avec des majuscules
function textNormalize(word) {
  return word.toLowerCase();
}

//Boucle for pour extraire les valeurs uniques des ingrédients, appareils et ustensiles et les stocker dans les Set()
for (const recipe of recipes) {
  //Pour chaque cas, on normalise la casse, et on ajoute au Set() correspondant

  //Les ingrédients sont dans un tableau, on extrait la valeur "ingredient" de "ingredients" avec une boucle for
  for (const recipeIngredient of recipe.ingredients) {
    const { ingredient } = recipeIngredient;
    const uniqueIngredient = textNormalize(ingredient);
    uniqueIngredients.add(uniqueIngredient);
  }

  //Les appareils sont directement accessibles
  const uniqueAppliance = textNormalize(recipe.appliance);
  uniqueAppliances.add(uniqueAppliance);

  //Les ustensiles sont également dans un tableau, on utilise une boucle for pour les récupérer
  for (const utensil of recipe.ustensils) {
    const uniqueUtensil = textNormalize(utensil);
    uniqueUtensils.add(uniqueUtensil);
  }
}



////////////////////////// Filtrage des recettes //////////////////////////



//Tableau pour stocker les filtres qui seront sélectionnés
const selectedFilters = {
  ingredients: [],
  appliances: [],
  utensils: []
};


//Fonction pour mettre à jour et afficher la liste des recettes mise à jour lorsqu'une recherche est effectuée
function filterRecipes() {
  const searchValue = textNormalize(mainSearch.value);
  //On créé une boucle for pour que la recherche démarre uniquement lorsque 3 caractères sont entrés
  const searchWords = [];
  const words = searchValue.split(/\s+/);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word.length >= 3) {
      searchWords.push(word);
    }
  }

  //On créé un tableau pour contenir nos recettes filtrées
  const filteredRecipes = [];

  //On créé une boucle for pour utiliser les fonctionnalités suivantes pour chaque recette du tableau recipes
  for (const recipe of recipes) {
    const lowerCaseName = textNormalize(recipe.name);
    const lowerCaseDescription = textNormalize(recipe.description);

    //On créé une boucle for pour vérifier si le contenu de la recherche correspond au nom, à la description ou aux ingrédients d'une recette
    let matchesSearchWords = true;
    for (const word of searchWords) {
      if (!lowerCaseName.includes(word) && !lowerCaseDescription.includes(word) && !recipe.ingredients.some(ingredient =>
          textNormalize(ingredient.ingredient).includes(word)
        )
      ) {
        matchesSearchWords = false;
        break;
      }
    }

    //On normalise la casse de chaque ingrédient contenu dans selectedFilters, et on l'ajoute dans un tableau pour les ingrédients
    const selectedIngredients = [];
    for (const ingredient of selectedFilters.ingredients) {
      selectedIngredients.push(textNormalize(ingredient));
    }

    //Même chose pour les appareils
    const selectedAppliances = [];
    for (const appliance of selectedFilters.appliances) {
      selectedAppliances.push(textNormalize(appliance));
    }

    //Même chose pour les ustensiles
    const selectedUtensils = [];
    for (const utensil of selectedFilters.utensils) {
      selectedUtensils.push(textNormalize(utensil));
    }

    //On vérifie si les éléments entrés dans le tableau selectedIngredients correspondent aux ingrédients du tableau recipe.ingredients
    //On initialise une variable à true, on utilise la méthode some() pour vérifier si au moins un ingrédient correspondant est utilisé dans la recette
    //Si aucun ingrédient n'est trouvé, la variable est false
    let hasSelectedIngredients = true;
    for (const ingredient of selectedIngredients) {
      if (!recipe.ingredients.some(item => textNormalize(item.ingredient) === ingredient)) {
        hasSelectedIngredients = false;
        break;
      }
    }

    //Pour les appareils, pas besoin de boucle, on vérifie uniquement si le tableau est vide ou non
    let hasSelectedAppliance = selectedAppliances.length === 0 || selectedAppliances.includes(textNormalize(recipe.appliance));

    //Même chose que les ingrédients pour les ustensiles
    let hasSelectedUtensils = true;
    for (const utensil of selectedUtensils) {
      if (!recipe.ustensils.some(item => textNormalize(item) === utensil)) {
        hasSelectedUtensils = false;
        break;
      }
    }

    //Si la recette correspond aux informations données, on l'inclut dans le tableau et on l'affiche sur la page
    if (matchesSearchWords && hasSelectedIngredients && hasSelectedAppliance && hasSelectedUtensils) {
      filteredRecipes.push(recipe);
    }
  }

  //On remet à jour la liste des recettes
  displayData(filteredRecipes);
  //On remet également à jour les listes d'ingrédients, d'ustensiles et d'appareils en fonction des recettes filtrées
  filterDropdownLists(filteredRecipes); 
}


//Fonction pour afficher les filtres lorsqu'ils sont sélectionnés
function displayFilters() {
  filtersAdded.appendChild(filtersDiv);
  filtersDiv.innerHTML = "";

  //On utilise une boucle for...in pour parcourir les propriétés de selectedFilters
  for (const filterType in selectedFilters) {

    const filterValues = selectedFilters[filterType];
    let updatedFilterValues = [];

    //Pour chaque filtre rajouté, on manipule le DOM pour créer le filtre
    for (let filterIndex = 0; filterIndex < filterValues.length; filterIndex++) {

      //On créé le div du filtre
      const value = filterValues[filterIndex];
      const filterContainer = document.createElement("div");
      filterContainer.classList.add("new-filter");
      filtersDiv.appendChild(filterContainer);

      //On créé un span qui contiendra le nom du filtre
      const filterValueSpan = document.createElement("span");
      filterValueSpan.textContent = value;
      filterContainer.appendChild(filterValueSpan);

      //On créé le bouton de suppression de filtre, une icone fontawesome
      const removeFilterButton = document.createElement("i");
      removeFilterButton.classList.add("fa-solid", "fa-xmark");
      filterContainer.appendChild(removeFilterButton);
          
      //On écoute l'évènement clic lorsqu'on appuie sur un filtre
      removeFilterButton.addEventListener("click", () => {

        //On créé une boucle for pour supprimer chaque filtre individuellement
        for (let i = 0; i < selectedFilters[filterType].length; i++) {
          const item = selectedFilters[filterType][i];
          if (item !== value) {
            updatedFilterValues.push(item);
          }
        }

        //On supprime l'aspect de filtre sélectionné dans la liste des filtres même lorsqu'on clique sur la fermeture du filtre dans la liste des filtres actifs
        const dropdownMenus = filterSection.querySelectorAll(".dropdown-menu");
        for (let dropdownIndex = 0; dropdownIndex < dropdownMenus.length; dropdownIndex++) {
          const dropdownMenu = dropdownMenus[dropdownIndex];
          const filterItems = dropdownMenu.querySelectorAll("li");
          for (let itemIndex = 0; itemIndex < filterItems.length; itemIndex++) {
            const item = filterItems[itemIndex];
            if (item.textContent === value) {
              item.classList.remove("selected");
            }
          }
        }

        selectedFilters[filterType] = updatedFilterValues;
        filterRecipes();
        displayFilters();
      });
    }
  }
}



////////////////////////// Création des listes //////////////////////////



//Fonction pour créer un élément <li> avec gestion des classes sélectionnées
//La fonction prend l'argument "text" pour générer le contenu de la liste (ici, les ingrédients, ustensiles ou appareils)
//Elle prend également l'argument isSelected pour ajouter une classe CSS et changer l'apparence/le comportement si l'élément de liste est sélectionné
function createListItem(text, isSelected) {
  const li = document.createElement("li");
  li.textContent = text;
  if (isSelected) {
    li.classList.add("selected");
  }
  return li;
}

//Fonction pour créer les 3 menus contenant les listes des ingrédients, appareils et ustensiles. Cette fonction prend 4 paramètres :
//Le premier, "container", pour définir le container où la liste sera créée
//Le second "dropdownId", pour définir un identifiant unique à chaque liste
//Le troisième "optionsSet" permet de définir l'ensemble des options de la liste, donc chaque élément qui sera listé
//Le quatrième, "label", est le label de la liste, ce qui sera écrit dessus pour savoir quelle liste on ouvre
function createDropdownList(container, dropdownId, optionsSet, label) {
    const dropdown = document.createElement("div");
    dropdown.classList.add("dropdown");
    container.appendChild(dropdown);

    //On créé un div qui servira à toggle l'affichage de liste, pour simuler une liste
    //Impossible d'utiliser <select> comme notre dropdown possède une barre de recherche, on simulera donc l'effet
    const dropdownToggle = document.createElement("div");
    dropdownToggle.classList.add("dropdown-toggle");
    dropdownToggle.tabIndex = 0;
    dropdownToggle.textContent = label;
    dropdown.appendChild(dropdownToggle);

    //On créé l'icone de flèche du menu dropdown
    const dropdownIcon = document.createElement("i");
    dropdownIcon.classList.add("fa-solid", "fa-angle-down");
    dropdownToggle.appendChild(dropdownIcon);

    //On créé la liste <ul> qui contiendra les éléments <li>
    const dropdownMenu = document.createElement("ul");
    dropdownMenu.classList.add("dropdown-menu");
    dropdown.appendChild(dropdownMenu);

    //On créé la barre de recherche intégrée dans chaque menu dropdown
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.classList.add("search-input");
    dropdownMenu.appendChild(searchInput);

    //On créé une icône de fermeture pour réinitialiser la barre de recherche intégrée
    const clearSearchIconDropdown = document.createElement("i");
    clearSearchIconDropdown.classList.add("clear-icon", "fa-solid", "fa-xmark");
    searchInput.parentNode.insertBefore(clearSearchIconDropdown, searchInput.nextSibling);

    //On créé l'icone loupe de la barre de recherche
    const searchIcon = document.createElement("i");
    searchIcon.classList.add("fa-solid", "fa-magnifying-glass");
    searchInput.parentNode.insertBefore(searchIcon, searchInput);

    //Pour chaque option, on créé un nouvel élément <li>, grâce à la fonction createListItem
    optionsSet.forEach(option => {
      const li = createListItem(option, false);
      dropdownMenu.appendChild(li);
    });
    
    //On écoute l'évènement clic sur le dropdown, et grâce à la méthode toggle(), on change la visibilité de l'élément
    dropdownToggle.addEventListener("click", () => {
      dropdown.classList.toggle("open");
      const dropdownIcon = dropdownToggle.querySelector("i");
      dropdownIcon.classList.toggle("fa-angle-up", dropdown.classList.contains("open"));
      dropdownIcon.classList.toggle("fa-angle-down", !dropdown.classList.contains("open"));
    });
    
    const listItems = dropdownMenu.querySelectorAll("li");

    //On créé une boucle for, qui va permettre d'écouter le clic sur un élément <li>
    for (let i = 0; i < listItems.length; i++) {
      const li = listItems[i];
      
      li.addEventListener("click", () => {
        const selectedValue = li.textContent;
        const isSelected = li.classList.contains("selected");

        //Si l'élément de la liste est sélectionné (et donc actif en tant que filtre), un clic dessus supprimera le filtre
        if (isSelected) {
          li.classList.remove("selected");
          const updatedFilterValues = [];
          for (let j = 0; j < selectedFilters[dropdownId].length; j++) {
            const item = selectedFilters[dropdownId][j];
            if (item !== selectedValue) {
              updatedFilterValues.push(item);
            }
          }
          selectedFilters[dropdownId] = updatedFilterValues;
        //Sinon, l'élément sera rajouté en tant que filtre actif
        } else {
          li.classList.add("selected");
          selectedFilters[dropdownId].push(selectedValue);
        }

        filterRecipes();
        displayFilters();
      });
    }
    
    //Ecoute de l'input sur la barre de recherche du menu des filtres
    searchInput.addEventListener("input", () => {
      const searchValue = textNormalize(searchInput.value);
      const items = dropdownMenu.querySelectorAll("li");

      //On utilise les ensembles filtrés pour la recherche
      const filteredSet =
      dropdownId === "ingredients"
        ? filteredIngredients
        : dropdownId === "appliances"
        ? filteredAppliances
        : filteredUtensils;
      
      //On parcourt les éléments <li> pour normaliser le texte, et afficher les résultats de la recherche
      items.forEach(item => {
        const text = textNormalize(item.textContent);
        if (text.includes(searchValue) && filteredSet.has(textNormalize(text))) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });

      //On change le style de la croix dans la barre de recherche des filtres, pour l'afficher ou non selon la présence de texte ou non
      clearSearchIconDropdown.style.display = searchInput.value.trim() !== "" ? "block" : "none";
    });

    //Ecoute de l'évènement clic sur l'icône de fermeture (croix) pour effacer le contenu de la barre de recherche
    clearSearchIconDropdown.addEventListener("click", () => {
        searchInput.value = "";
        //On déclenche l'évènement input pour mettre à jour les filtres
        searchInput.dispatchEvent(new Event("input")); 
    });
}

//On utilise la fonction que nous venons de créer en utilisant chaque paramètre pour créer les 3 listes d'ingrédients, appareils et ustensiles
createDropdownList(ingredientList, "ingredients", uniqueIngredients, "Ingrédients");
createDropdownList(applianceList, "appliances", uniqueAppliances, "Appareils");
createDropdownList(utensilList, "utensils", uniqueUtensils, "Ustensiles");

//On insère les listes en manipulant le DOM
filterSection.appendChild(ingredientList);
filterSection.appendChild(applianceList);
filterSection.appendChild(utensilList);


//Fonction pour filtrer les éléments de liste dans les listes d'ingrédients, d'ustensiles et d'appareils
function filterDropdownLists(filteredRecipes) {

  const ingredientItems = ingredientList.querySelectorAll("li");
  const applianceItems = applianceList.querySelectorAll("li");
  const utensilItems = utensilList.querySelectorAll("li");

  //Ensembles pour stocker les valeurs uniques des ustensiles, appareils et ingrédients filtrés
  filteredIngredients.clear();
  filteredAppliances.clear();
  filteredUtensils.clear();

  //Boucle for pour parcourir les recettes filtrées pour ajouter les éléments de liste aux ensembles filtrés
  for (const recipe of filteredRecipes) {
    filteredAppliances.add(textNormalize(recipe.appliance));
    for (const utensil of recipe.ustensils) {
      filteredUtensils.add(textNormalize(utensil));
    }
    for (const ingredientData of recipe.ingredients) {
      filteredIngredients.add(textNormalize(ingredientData.ingredient));
    }
  }

  //Fonction pour vérifier si un élément de liste doit être affiché en fonction des ensembles filtrés
  function shouldDisplayItem(itemText, set) {
    return set.has(itemText);
  }

  //Pour chaque élément de liste, on masque ou on affiche en fonction des ensembles filtrés
  ingredientItems.forEach(item => {
    const itemText = textNormalize(item.textContent);
    item.style.display = shouldDisplayItem(itemText, filteredIngredients) ? "" : "none";
  });

  applianceItems.forEach(item => {
    const itemText = textNormalize(item.textContent);
    item.style.display = shouldDisplayItem(itemText, filteredAppliances) ? "" : "none";
  });

  utensilItems.forEach(item => {
    const itemText = textNormalize(item.textContent);
    item.style.display = shouldDisplayItem(itemText, filteredUtensils) ? "" : "none";
  });
}


//Fonction pour gérer l'affichage de la croix qui supprime le champ de recherche principal
function toggleClearSearchIcon() {
  clearSearchIcon.style.display = mainSearch.value.trim() !== "" ? "inline-block" : "none";
}



////////////////////////// Ecoute d'évènements //////////////////////////



//On réinitialise le champ de recherche principal lors du rechargement de la page
document.addEventListener("DOMContentLoaded", () => {
  mainSearch.value = "";
});

//On écoute l'évènement input lorsqu'on entre du texte dans la barre de recherche principale
mainSearch.addEventListener("input", () => {
  //On active l'affichage de la croix de suppression lorsqu'un texte est entré
  toggleClearSearchIcon();
  //On filtre en temps réel les recettes
  filterRecipes();
});

//On écoute le clic de la croix de suppression qui sert à supprimer le texte entré dans la barre de recherche principale
clearSearchIcon.addEventListener("click", () => {
  //On vide la barre de recherche lors du clic
  mainSearch.value = "";
  //On cache la croix de suppression de texte
  toggleClearSearchIcon();
  //On filtre de nouveau les recettes
  filterRecipes();
});

//Cela permet par défaut de cacher la croix de suppression de texte
document.addEventListener("DOMContentLoaded", () => {
  mainSearch.dispatchEvent(new Event("input"));
});

const dropdowns = document.querySelectorAll(".dropdown");

//Fonction pour fermer toutes les listes déroulantes ouvertes
function closeDropdowns() {
  dropdowns.forEach(dropdown => {
    dropdown.classList.remove("open");
  });
}

//Ecoute de l'évènement clic pour fermer les listes déroulantes lors d'un clic en dehors d'une liste
document.addEventListener("mousedown", (event) => {
    const isClickInsideDropdown = event.target.closest(".dropdown");
    if (!isClickInsideDropdown) {
      closeDropdowns();
      //On réinitialise les icones de flèches des menus lorsque les listes déroulantes sont fermées
      const dropdownIcons = document.querySelectorAll(".dropdown-toggle i");
      dropdownIcons.forEach(icon => {
          icon.classList.remove("fa-angle-up");
          icon.classList.add("fa-angle-down");
      });
    }
  });