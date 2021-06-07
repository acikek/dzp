function scriptCategories(scripts, data) {
  const categories = {};

  scripts.forEach(s => {
    const type = s.type;
    const val = data ? s.data : s.name;

    if (!categories[type]) {
      categories[type] = [val];
    } else {
      categories[type].push(val);
    }
  });

  return categories;
}

module.exports = scriptCategories;