import { parse } from "@std/yaml";
import { CareersPage } from "./careers-page.jsx";

const CAREERS_DATA_PATH = "data/dict/careers.yaml";

const getCareers = async () => {
  try {
    const yamlContent = await Deno.readTextFile(CAREERS_DATA_PATH);
    return parse(yamlContent);
  } catch (e) {
    console.error("Error reading careers data:", e);
    return [];
  }
};

export const careersHandler = {
  index: async (c) => {
    const lang = c.req.param('lang') || 'en';
    const t = await c.dict(`src/interface/web/handlers/careers/dict/${lang}`);
    const jobs = await getCareers();
    const seo = {
      title: t.meta?.title || "Careers - IntelKartel",
      description: t.meta?.description || "Join the IntelKartel. Explore our job openings.",
      canonical: "https://intelkartel.com/careers"
    };

    return c.render(CareersPage, { jobs, seo, t });
  }
};
