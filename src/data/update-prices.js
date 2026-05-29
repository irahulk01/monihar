const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'products.json');

try {
  const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Price range variety mapping per category under ₹1,500
  const priceVariety = {
    "Rings": { min: 199, max: 899 },
    "Earrings": { min: 149, max: 799 },
    "Necklaces": { min: 399, max: 1499 },
    "Bracelets": { min: 299, max: 1199 },
    "Anklets": { min: 149, max: 599 },
    "Sets": { min: 599, max: 1499 },
    "Men's Collection": { min: 299, max: 1399 }
  };

  const niceEndings = [9, 5, 0];

  function getRandomPrice(min, max) {
    let price = Math.floor(Math.random() * (max - min + 1)) + min;
    const ending = niceEndings[Math.floor(Math.random() * niceEndings.length)];
    if (ending === 9) {
      price = Math.floor(price / 10) * 10 + 9;
    } else if (ending === 5) {
      price = Math.floor(price / 10) * 10 + 5;
    } else {
      price = Math.floor(price / 10) * 10;
    }
    return price;
  }

  const updatedProducts = products.map(product => {
    const range = priceVariety[product.category] || { min: 199, max: 1499 };
    const price = getRandomPrice(range.min, range.max);
    
    // Generate a random higher comparative price for discount listings
    let originalPrice = null;
    if (Math.random() > 0.4) {
      const markup = Math.floor(price * (1.1 + Math.random() * 0.3));
      originalPrice = Math.floor(markup / 10) * 10 + 9;
      if (originalPrice <= price) {
        originalPrice = price + 100;
      }
    }

    return {
      ...product,
      price,
      originalPrice
    };
  });

  fs.writeFileSync(filePath, JSON.stringify(updatedProducts, null, 2), 'utf8');
  console.log(`Successfully updated prices under 1500 for ${updatedProducts.length} products.`);
} catch (err) {
  console.error("Error updating prices:", err);
  process.exit(1);
}
