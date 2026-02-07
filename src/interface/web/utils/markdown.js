import { marked } from "https://deno.land/x/marked/mod.ts";

export const renderMarkdown = (content) => {
  return marked.parse(content);
};
