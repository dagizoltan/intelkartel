export const menuHandlerSeo = {
  getSeo: (t, lang) => {
    // Build Schema.org Menu
    const menuSchema = {
      "@context": "https://schema.org",
      "@type": "Menu",
      "name": t.meta?.title || 'Menu',
      "mainEntityOfPage": `https://zummogo.hu/${lang}/menu`,
      "hasMenuSection": t.sections?.map(section => ({
        "@type": "MenuSection",
        "name": section.title,
        "hasMenuItem": section.items?.map(item => ({
          "@type": "MenuItem",
          "name": item.name,
          "description": item.description,
          "image": item.image ? `https://zummogo.hu${item.image}` : undefined,
          "offers": {
            "@type": "Offer",
            "price": item.price?.replace(/[^0-9.,]+/g, '').replace(',', '.'),
            "priceCurrency": "HUF"
          }
        }))
      }))
    };

    // Merge with existing jsonld if present, or use the new one
    // Here we wrap menuSchema in t.jsonld if present?
    // The original code was: const jsonLd = t.jsonld ? { ...t.jsonld, hasMenu: menuSchema } : menuSchema;
    // This seems correct as it adds 'hasMenu' to the Restaurant object in t.jsonld.
    const jsonLd = t.jsonld ? { ...t.jsonld, hasMenu: menuSchema } : menuSchema;

    return {
      title: t.meta?.title || 'Menu - Zümmögő',
      description: t.meta?.description || 'Explore our menu',
      keywords: t.meta?.keywords,
      jsonLd: jsonLd,
      canonical: `https://zummogo.hu/${lang}/menu`,
      type: 'restaurant.menu'
    };
  }
};
