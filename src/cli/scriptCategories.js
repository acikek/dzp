function scriptCategories(scripts) {
  const categories = {};

  scripts.forEach(s => {
    const type = s.type;
    const name = s.name;

    if (!categories[type]) {
      categories[type] = [name];
    } else {
      categories[type].push(name);
    }
  });

  return categories;
}

module.exports = scriptCategories;