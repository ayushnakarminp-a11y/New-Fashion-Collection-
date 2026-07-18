const collectionCatalogs = {
  lehenga: {
    title: 'LEHENGA COLLECTION',
    intro: 'Celebration silhouettes with movement, color and intricate detail.',
    searchLabel: 'Search the Lehenga collection',
    searchPlaceholder: 'Try “crimson zardozi”',
    products: [
      ['Crimson Zardozi Lehenga', 'Regal wedding embroidery', 'NPR 12,850', 'Crimson embroidered lehenga in a heritage palace courtyard'],
      ['Powder Blue Floral Lehenga', 'Airy organza florals', 'NPR 9,750', 'Powder blue floral lehenga on a rooftop at dawn'],
      ['Mustard Mirrorwork Lehenga', 'Bright festive shimmer', 'NPR 8,950', 'Mustard mirrorwork lehenga in a botanical conservatory'],
      ['Emerald Velvet Lehenga', 'Rich evening texture', 'NPR 13,500', 'Emerald velvet lehenga in a modern art gallery'],
      ['Ivory Pearl Lehenga', 'Soft pearl embellishment', 'NPR 11,250', 'Ivory pearl lehenga on a lakeside stone terrace'],
      ['Coral Threadwork Lehenga', 'Detailed tonal embroidery', 'NPR 8,650', 'Coral threadwork lehenga in an old brick lane'],
      ['Navy Sequin Lehenga', 'Midnight celebration shine', 'NPR 10,950', 'Navy sequin lehenga in a marigold garden'],
      ['Lavender Organza Lehenga', 'Light layered volume', 'NPR 9,450', 'Lavender organza lehenga on a carved wooden veranda'],
      ['Teal Brocade Lehenga', 'Woven occasion finish', 'NPR 10,250', 'Teal brocade lehenga at a concrete pavilion'],
      ['Black Antique Gold Lehenga', 'Dramatic heritage border', 'NPR 14,250', 'Black and antique gold lehenga in a desert garden'],
      ['Rose Embroidered Lehenga', 'Romantic tonal detail', 'NPR 9,950', 'Rose embroidered lehenga in a candlelit banquet hall'],
      ['White Cobalt Lehenga', 'Crisp blue threadwork', 'NPR 10,650', 'White and cobalt lehenga in a sunlit library']
    ]
  },
  pants: {
    title: 'PANTS COLLECTION',
    intro: 'Easy tailoring, versatile shapes and considered everyday comfort.',
    searchLabel: 'Search the Pants collection',
    searchPlaceholder: 'Try “olive wide-leg”',
    products: [
      ['Olive Wide-Leg Linen', 'Breathable relaxed tailoring', 'NPR 2,950', 'Woman in olive wide-leg linen pants in a tailoring studio'],
      ['Ivory Straight Cotton', 'Clean everyday shape', 'NPR 2,450', 'Woman in ivory straight cotton pants on a tree-lined promenade'],
      ['Black Tailored Pleat', 'Polished ankle-length fit', 'NPR 3,250', 'Woman in black tailored pants at a cafe terrace'],
      ['Rust Fluid Palazzo', 'Soft movement and drape', 'NPR 2,850', 'Woman in rust palazzo pants in a modern office lobby'],
      ['Powder Blue Cigarette Pant', 'Refined slim tailoring', 'NPR 2,650', 'Woman in powder blue cigarette pants on museum steps'],
      ['Navy Easy Trouser', 'Comfort with a smart finish', 'NPR 2,750', 'Woman in navy fluid trousers in a flower market lane'],
      ['Sand Tapered Pant', 'A versatile neutral fit', 'NPR 2,550', 'Woman in sand tapered pants at a university arcade'],
      ['Deep Green Culotte', 'Cropped wide-leg ease', 'NPR 2,950', 'Woman in deep green culottes on a riverside boardwalk'],
      ['Charcoal High-Waist Trouser', 'Structured classic tailoring', 'NPR 3,350', 'Woman in charcoal high-waist trousers in a minimalist apartment'],
      ['Rose Relaxed Pant', 'Fluid day-to-evening style', 'NPR 2,850', 'Woman in rose relaxed pants in an art-filled lounge'],
      ['White Embroidered Palazzo', 'Delicate hem detailing', 'NPR 3,150', 'Woman in white embroidered palazzo pants in a sunlit courtyard'],
      ['Cobalt Wide-Leg Pant', 'Bold tailored color', 'NPR 3,250', 'Woman in cobalt wide-leg pants at a green hillside overlook']
    ]
  },
  tops: {
    title: 'SHIRT TOPS & BLOUSES COLLECTION',
    intro: 'Detailed separates for everyday dressing and special occasions.',
    searchLabel: 'Search the Shirt Tops and Blouses collection',
    searchPlaceholder: 'Try “blue chikankari”',
    products: [
      ['Red Embroidered Blouse', 'Delicate floral threadwork', 'NPR 2,950', 'Woman in a red embroidered blouse in a textile workshop'],
      ['Powder Blue Chikankari Top', 'Soft cotton embroidery', 'NPR 2,650', 'Woman in a powder blue chikankari top by a garden wall'],
      ['Mustard Cotton Shirt Top', 'Relaxed everyday tailoring', 'NPR 2,250', 'Woman in a mustard cotton shirt top in a bookshop'],
      ['Ivory Cutwork Blouse', 'Airy scalloped detail', 'NPR 2,850', 'Woman in an ivory cutwork blouse in a ceramic studio'],
      ['Olive Wrap Top', 'Flattering adjustable shape', 'NPR 2,450', 'Woman in an olive wrap top in a heritage corridor'],
      ['Coral Printed Tunic', 'Easy artisanal pattern', 'NPR 2,350', 'Woman in a coral printed tunic at a tea house patio'],
      ['Slate Blue Silk Blouse', 'Polished evening drape', 'NPR 3,250', 'Woman in a slate blue silk blouse at a sculpture park'],
      ['Lavender Tie-Neck Top', 'Soft statement detailing', 'NPR 2,650', 'Woman in a lavender tie-neck top at a colorful doorway'],
      ['Teal Pintuck Shirt', 'Textured everyday cotton', 'NPR 2,550', 'Woman in a teal pintuck shirt in a bright home kitchen'],
      ['Black Gold Evening Blouse', 'Subtle festive embroidery', 'NPR 3,450', 'Woman in a black and gold blouse in a rooftop garden'],
      ['Rose Floral Top', 'Gentle printed color', 'NPR 2,350', 'Woman in a rose floral top on a lakeside pier'],
      ['White Cobalt Blouse', 'Crisp traditional threadwork', 'NPR 2,950', 'Woman in a white and cobalt blouse in an elegant music room']
    ]
  }
};

const collectionKey = document.body.dataset.collection;
const collection = collectionCatalogs[collectionKey];

if (collection) {
  const catalogGrid = document.querySelector('.catalog-grid');
  const catalogTitle = document.querySelector('#catalog-title');
  const catalogIntro = document.querySelector('.catalog-heading div > p');
  const searchLabel = document.querySelector('.search-form label');
  const searchInput = document.querySelector('#siteSearch');
  const currentPage = window.location.pathname.split('/').pop();

  catalogTitle.textContent = collection.title;
  catalogIntro.textContent = collection.intro;
  searchLabel.textContent = collection.searchLabel;
  searchInput.placeholder = collection.searchPlaceholder;

  document.querySelectorAll('.desktop-nav a, .mobile-menu a').forEach((link) => {
    const active = link.getAttribute('href') === currentPage;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  catalogGrid.innerHTML = collection.products.map((product, index) => {
    const number = String(index + 1).padStart(2, '0');
    const loading = index === 0 ? '' : ' loading="lazy"';
    const priority = index === 0 ? ' fetchpriority="high"' : '';
    return `
      <article class="catalog-card">
        <a class="catalog-image image-shell" href="#" aria-label="View ${product[0]}">
          <img src="images/${collectionKey === 'tops' ? 'tops-blouses' : collectionKey}/${number}.webp" alt="${product[3]}"${loading}${priority} decoding="async" width="362" height="362">
        </a>
        <div class="catalog-info"><div><h3>${product[0]}</h3><p>${product[1]}</p></div><strong>${product[2]}</strong></div>
      </article>`;
  }).join('');
}
