import { parse } from "@std/yaml";

const loadDict = async (path) => {
  try {
    const yamlContent = await Deno.readTextFile(path + ".yaml");
    return parse(yamlContent);
  } catch (e) {
    console.error(`Failed to load dict at ${path}`, e);
    return {};
  }
};

export const contextMiddleware = async (c, next) => {
  // Mock context with queries placeholder
  const ctx = {
    queries: {
      // Future queries will go here
    }
  };
  c.set('ctx', ctx);

  // Attach dict helper
  c.dict = loadDict;

  await next();
};
