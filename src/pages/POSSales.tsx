
// Update the category filtering functions to work with the category object
const handleCategorySelect = (category: string | null) => {
  setSelectedCategory(category);
  
  if (category === null) {
    setFilteredProducts(products);
  } else {
    const filtered = products.filter(product => 
      product.category && product.category.id === category
    );
    setFilteredProducts(filtered);
  }
};

// And update the search function as well
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const query = e.target.value.toLowerCase();
  setSearchQuery(query);
  
  let filtered = products;
  
  // Apply category filter if selected
  if (selectedCategory) {
    filtered = filtered.filter(product => 
      product.category && product.category.id === selectedCategory
    );
  }
  
  // Apply search filter
  if (query.trim() !== "") {
    filtered = filtered.filter(
      product => 
        product.name.toLowerCase().includes(query) || 
        product.barcode?.toLowerCase().includes(query)
    );
  }
  
  setFilteredProducts(filtered);
};
