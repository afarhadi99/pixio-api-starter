const fs = require('fs');
const path = require('path');

const dir = 'apps/web/src';

function getAllFiles(dirPath, arrayOfFiles) {
    let files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}

try {
    const files = getAllFiles(dir);

    files.forEach(file => {
        if (!file.match(/\.(ts|tsx|js|jsx)$/)) return;

        let content = fs.readFileSync(file, 'utf8');
        let original = content;

        // Replacements using RegExp constructor to avoid syntax errors in tool passing
        content = content.replace(new RegExp('from "@/components/ui/[^"]+"', 'g'), 'from "@repo/ui"');
        content = content.replace(new RegExp('from "@/lib/utils"', 'g'), 'from "@repo/ui/utils"');
        content = content.replace(new RegExp('from "@/lib/pixio-api"', 'g'), 'from "@repo/pixio-api"');
        content = content.replace(new RegExp('from "@/lib/stripe"', 'g'), 'from "@repo/stripe"');

        // Supabase replacements
        content = content.replace(new RegExp('from "@/lib/supabase/client"', 'g'), 'from "@repo/supabase/client"');
        content = content.replace(new RegExp('from "@/lib/supabase/server"', 'g'), 'from "@repo/supabase/server"');
        content = content.replace(new RegExp('from "@/lib/supabase/middleware"', 'g'), 'from "@repo/supabase/middleware"');
        content = content.replace(new RegExp('from "@/lib/supabase/admin"', 'g'), 'from "@repo/supabase/admin"');
        content = content.replace(new RegExp('from "@/lib/supabase"', 'g'), 'from "@repo/supabase"');

        if (content !== original) {
            console.log(`Updated ${file}`);
            fs.writeFileSync(file, content, 'utf8');
        }
    });
    console.log('Migration complete');
} catch (e) {
    console.error(e);
}
