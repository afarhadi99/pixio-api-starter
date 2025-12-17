const fs = require('fs');
const path = require('path');

const dir = path.join('packages', 'ui', 'src', 'components', 'ui');

function getFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'))
        .map(file => path.join(dir, file));
}

try {
    const files = getFiles(dir);
    console.log(`Scanning ${files.length} UI files...`);

    let count = 0;

    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let original = content;

        // Replace @/lib/utils with relative path
        // Since we are in src/components/ui, lib/utils is ../../lib/utils
        content = content.replace(/from\s+["']@\/lib\/utils["']/g, 'from "../../lib/utils"');

        // Replace @/components/ui/X with ./X
        content = content.replace(/from\s+["']@\/components\/ui\/([^"']+)["']/g, 'from "./$1"');

        if (content !== original) {
            console.log(`Fixed internal imports in: ${file}`);
            fs.writeFileSync(file, content, 'utf8');
            count++;
        }
    });

    console.log(`Fixed ${count} files in packages/ui.`);
} catch (e) {
    console.error("Error fixing UI imports:", e);
}
