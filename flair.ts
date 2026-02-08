import { join } from "https://deno.land/std@0.208.0/path/mod.ts";

const targetDir = 'data/dict/articles';

function removeDivFromContent(content: string): string {
    const id = "jp-post-flair";
    // Loop to remove multiple occurrences if any (though likely one)
    while (true) {
        // Regex to find <div ... id="jp-post-flair" ...>
        const regex = new RegExp(`<div[^>]*\\bid=["']${id}["'][^>]*>`, 'i');
        const match = content.match(regex);
        
        if (!match || match.index === undefined) {
            break;
        }
        const startIndex = match.index;
        let currentIndex = startIndex;
        let openDivs = 0;
        let foundEnd = false;
        
        while (currentIndex < content.length) {
            // Check for start tag
            if (content.substring(currentIndex).startsWith('<div')) {
                openDivs++;
                currentIndex += 4;
            } 
            // Check for end tag
            else if (content.substring(currentIndex).startsWith('</div')) {
                openDivs--;
                currentIndex += 5; // </div
                // Skip until >
                while (currentIndex < content.length && content[currentIndex] !== '>') {
                    currentIndex++;
                }
                currentIndex++; // >
                
                if (openDivs === 0) {
                    foundEnd = true;
                    break;
                }
            } else {
                currentIndex++;
            }
        }
        
        if (foundEnd) {
            content = content.substring(0, startIndex) + content.substring(currentIndex);
        } else {
            console.warn(`Could not find closing div for id="${id}" starting at index ${startIndex}`);
            // Remove up to startIndex to avoid infinite loop on broken HTML?
            // Or just break. If we break, we might leave partial content.
            // Better to break and warn.
            break;
        }
    }
    return content;
}

function processDirectory(dir: string): void {
    try {
        Deno.statSync(dir);
    } catch {
        console.error(`Directory not found: ${dir}`);
        return;
    }
    
    let count = 0;
    
    for (const entry of Deno.readDirSync(dir)) {
        const filePath = join(dir, entry.name);
        
        if (entry.isDirectory) {
            processDirectory(filePath); // Recursive
        } else if (entry.isFile && entry.name.endsWith('.md')) {
            try {
                const content = Deno.readTextFileSync(filePath);
                const newContent = removeDivFromContent(content);
                
                if (content !== newContent) {
                    Deno.writeTextFileSync(filePath, newContent);
                    console.log(`Updated: ${filePath}`);
                    count++;
                }
            } catch (err) {
                console.error(`Error processing ${filePath}:`, err);
            }
        }
    }
    
    if (count > 0) {
        console.log(`Processed ${count} files in ${dir}`);
    }
}

console.log(`Starting cleanup in ${targetDir}...`);
processDirectory(targetDir);
console.log('Done.');