import { MediaPage } from "./media-page.jsx";
import { GalleryPage } from "./gallery-page.jsx";
import { AudioPage } from "./audio-page.jsx";
import { PdfPage } from "./pdf-page.jsx";
import { scanMediaFiles } from "../../utils/media-scanner.js";

export const mediaHandler = {
  index: async (c) => {
    const seo = {
      title: "IntelKartel - Classified Media Archive",
      description: "Access our top-secret media files: Gallery, Audio intercepted communications, and Declassified PDFs.",
      canonical: "https://intelkartel.com/media"
    };

    return c.render(MediaPage, { seo });
  },

  gallery: async (c) => {
    const files = await scanMediaFiles();
    const seo = {
      title: "IntelKartel - Visual Intel Gallery",
      description: "A comprehensive grid of operational imagery and intercepted visuals.",
      canonical: "https://intelkartel.com/media/gallery"
    };

    return c.render(GalleryPage, { images: files.images, seo });
  },

  audio: async (c) => {
    const files = await scanMediaFiles();
    const seo = {
      title: "IntelKartel - Audio Intercepts",
      description: "Listen to our collected audio intel and unredacted recordings.",
      canonical: "https://intelkartel.com/media/audio"
    };

    return c.render(AudioPage, { audioFiles: files.audio, seo });
  },

  pdf: async (c) => {
    const files = await scanMediaFiles();
    const seo = {
      title: "IntelKartel - Classified Library",
      description: "Browse and download raw intelligence reports and dossiers in PDF format.",
      canonical: "https://intelkartel.com/media/pdf"
    };

    return c.render(PdfPage, { pdfFiles: files.pdfs, seo });
  }
};
