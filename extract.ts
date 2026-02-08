import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { join } from "https://deno.land/std/path/mod.ts";

const OUTPUT_DIR = "data/dict/articles";
await ensureDir(OUTPUT_DIR);

function getFilenameFromUrl(url: string): string {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/^\/|\/$/g, '');
    const parts = path.split('/');
    
    // Handle /YYYY/MM/DD/slug/ format
    if (parts.length >= 4 && /^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1]) && /^\d+$/.test(parts[2])) {
        return `${parts[0]}-${parts[1]}-${parts[2]}-${parts[3]}.md`;
    }
    
    // Handle /slug/ format
    const slug = parts.length > 0 && parts[parts.length - 1] ? parts[parts.length - 1] : "index";
    return `${slug}.md`;
}

async function extractArticle(url: string): Promise<void> {
    const filename = getFilenameFromUrl(url);
    const filepath = join(OUTPUT_DIR, filename);
    
    try {
        await Deno.stat(filepath);
        // File exists, skip (like Python version)
        return;
    } catch {
        // File doesn't exist, continue
    }
    
    console.log(`Processing ${url} -> ${filename}`);
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        
        if (!doc) {
            throw new Error("Failed to parse HTML");
        }
        
        const contentDiv = doc.querySelector('div.entry-content');
        
        if (contentDiv) {
            // Extract the div tag itself and its content
            const content = contentDiv.outerHTML.trim();
            
            await Deno.writeTextFile(filepath, content);
            console.log(`Saved ${filename}`);
        } else {
            console.log(`Warning: No entry-content found for ${url}`);
        }
        
    } catch (error) {
        console.error(`Error processing ${url}:`, error);
    }
}

async function main(): Promise<void> {
    let urls: string[];
    
    try {
        const content = await Deno.readTextFile('articles_list.txt');
        urls = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    } catch {
        console.log("articles_list.txt not found");
        return;
    }
    
    for (const url of urls) {
        await extractArticle(url);
    }
}

if (import.meta.main) {
    await main();
}