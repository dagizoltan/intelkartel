export const parseArticle = (filename, content) => {
    const slug = filename.replace(/\.md$/, "");
    let date = "1970-01-01"; // Default to very old date

    // Extract date from filename if possible (YYYY-MM-DD-slug)
    const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
        date = dateMatch[1];
    }

    // Extract Title
    let title = slug;
    // Try to find h1 or h1 with wp-block-heading class
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/s);
    if (h1Match) {
        title = h1Match[1].replace(/<[^>]+>/g, "").trim(); // Remove inner tags
    } else {
         // Fallback to h2 if h1 is missing
         const h2Match = content.match(/<h2[^>]*>(.*?)<\/h2>/s);
         if (h2Match) {
             title = h2Match[1].replace(/<[^>]+>/g, "").trim();
         }
    }

    // Extract Description
    // Find first paragraph that has some text length > 20
    const pMatches = content.matchAll(/<p[^>]*>(.*?)<\/p>/gs);
    let description = "";
    for (const match of pMatches) {
        const text = match[1].replace(/<[^>]+>/g, "").trim();
        if (text.length > 20) {
            description = text.substring(0, 160) + (text.length > 160 ? "..." : "");
            break;
        }
    }

    // Extract Image (first img src)
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    let image = null;
    if (imgMatch) {
        image = imgMatch[1];
    }

    return {
        title,
        description,
        datePublished: date,
        slug,
        image,
        content
    };
};
