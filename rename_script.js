import { parse } from "jsr:@std/yaml";

const dir = "data/dict/articles";
const files = [];

for await (const entry of Deno.readDir(dir)) {
  if (entry.isFile && entry.name.endsWith(".yaml")) {
    const yamlContent = await Deno.readTextFile(`${dir}/${entry.name}`);
    const meta = parse(yamlContent);
    const date = meta.datePublished;
    const oldSlug = entry.name.replace(".yaml", "");

    // Generate new URL-friendly slug
    const cleanTitle = meta.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newSlug = `${date}-${cleanTitle}`;

    if (oldSlug !== newSlug) {
      console.log(`Renaming ${oldSlug} to ${newSlug}`);
      // Rename files
      await Deno.rename(`${dir}/${oldSlug}.md`, `${dir}/${newSlug}.md`);

      // Update slug in YAML
      meta.slug = newSlug;
      const newYamlContent = yamlContent.replace(/^slug:\s*".*?"/m, `slug: "${newSlug}"`);

      // Write new YAML file and delete old one
      await Deno.writeTextFile(`${dir}/${newSlug}.yaml`, newYamlContent);
      await Deno.remove(`${dir}/${entry.name}`);
    }
  }
}
console.log("Done renaming.");
