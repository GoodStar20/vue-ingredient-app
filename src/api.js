export const fetchFridges = () => {
  const fridges = [
    { value: 'Fridge 1', name: 'Fridge 1' },
    { value: 'Fridge 2', name: 'Fridge 2' },
  ];
  return Promise.resolve(fridges);
};

export const fetchIngredients = (fridge) => {
  const data = JSON.parse(localStorage.getItem('vue_app_data'));
  const ingredients = [];
  if (data) {
    data.forEach((i) => {
      if (fridge === '' || i.fridge === fridge) {
        ingredients.push(i);
      }
    });
  }
  return Promise.resolve(ingredients);
};

export const addIngredient = (ingredient) => {
  const data = JSON.parse(localStorage.getItem('vue_app_data'));
  const ingredients = data || [];
  const index = ingredients.findIndex(c => c.name === ingredient.name && c.fridge === ingredient.fridge);
  if (index > -1) {
    ingredients[index].count = +ingredients[index].count + 1;
  } else {
    ingredient.count = 1;
    ingredients.push(ingredient);
  }
  localStorage.setItem('vue_app_data', JSON.stringify(ingredients));
  return Promise.resolve(ingredient);
};

export const deleteIngredient = (ingredient) => {
  const data = JSON.parse(localStorage.getItem('vue_app_data'));
  const ingredients = data || [];
  const index = ingredients.findIndex(c => c.name === ingredient.name && c.fridge === ingredient.fridge);
  if (index > -1) {
    if (ingredients[index].count > 1) {
      ingredients[index].count -= 1;
    } else {
      ingredients.splice(index, 1);
    }
  }
  localStorage.setItem('vue_app_data', JSON.stringify(ingredients));
  return Promise.resolve(true);
};

export default {
  fetchFridges,
  fetchIngredients,
  addIngredient,
  deleteIngredient,
};
