export const homeHandlerSeo = {
  getSeo: (t, lang) => {
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "@id": "https://zummogo.hu",
      "name": "Zümmögő",
      "url": `https://zummogo.hu/${lang}`,
      "image": "https://zummogo.hu/static/img/image_67534337.webp",
      "priceRange": "$$",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "07:00",
          "closes": "19:00"
        }
      ],
      "sameAs": [
        "https://facebook.com/zummogocake",
        "https://instagram.com/zummogocake"
      ],
      "potentialAction": {
        "@type": "ViewAction",
        "target": `https://zummogo.hu/${lang}/menu`,
        "name": "View Menu"
      }
    };

    let jsonLd = t.jsonld ? { ...websiteSchema, ...t.jsonld } : websiteSchema;

    // Add FAQ Schema if available
    if (t.faq && t.faq.items) {
      const faqSchema = {
        "@type": "FAQPage",
        "mainEntity": t.faq.items.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      };

      jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
          jsonLd, // The Restaurant schema
          faqSchema
        ]
      };
    }

    return {
      title: t.meta?.title || 'Zümmögő',
      description: t.meta?.description || 'Zümmögő - Bakery & Cafe',
      keywords: t.meta?.keywords,
      jsonLd: jsonLd,
      canonical: `https://zummogo.hu/${lang}`,
      type: 'website'
    };
  }
};
