import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';


async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  app.post('/api/save-story', async (req, res) => {
    const { originalTitle, newStoryData } = req.body;
    const storyCardsDir = path.join(process.cwd(), 'data', 'storyCards');
    
    try {
      const files = fs.readdirSync(storyCardsDir);
      let foundFile = '';
      let fileContent = '';

      for (const file of files) {
        if (file.endsWith('.ts') && file !== 'index.ts' && file !== 'utils.ts') {
          const filePath = path.join(storyCardsDir, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          if (content.includes(`title: "${originalTitle}"`) || content.includes(`title: '${originalTitle}'`)) {
            foundFile = filePath;
            fileContent = content;
            break;
          }
        }
      }

      if (!foundFile) {
        // Also check community subfolder
        const communityDir = path.join(storyCardsDir, 'community');
        if (fs.existsSync(communityDir)) {
            const communityFiles = fs.readdirSync(communityDir);
            for (const file of communityFiles) {
                if (file.endsWith('.ts') && file !== 'index.ts') {
                    const filePath = path.join(communityDir, file);
                    const content = fs.readFileSync(filePath, 'utf-8');
                    if (content.includes(`title: "${originalTitle}"`) || content.includes(`title: '${originalTitle}'`)) {
                        foundFile = filePath;
                        fileContent = content;
                        break;
                    }
                }
            }
        }
      }

      if (!foundFile) {
        return res.status(404).json({ error: `Story with title "${originalTitle}" not found in any data file.` });
      }

      // Find the object block
      let titleIndex = fileContent.indexOf(`title: "${originalTitle}"`);
      if (titleIndex === -1) {
          titleIndex = fileContent.indexOf(`title: '${originalTitle}'`);
      }

      if (titleIndex === -1) {
          return res.status(500).json({ error: "Could not locate title in file content even though it was found earlier." });
      }

      // Find the start of the object { before the title
      let startIndex = titleIndex;
      while (startIndex >= 0 && fileContent[startIndex] !== '{') {
          startIndex--;
      }

      // Find the end of the object } after the title, counting braces
      let braceCount = 0;
      let endIndex = startIndex;
      while (endIndex < fileContent.length) {
          if (fileContent[endIndex] === '{') braceCount++;
          if (fileContent[endIndex] === '}') braceCount--;
          if (braceCount === 0 && fileContent[endIndex] === '}') {
              endIndex++; // include the closing brace
              break;
          }
          endIndex++;
      }

      // Stringify the new story data to match the format
      const jsonString = JSON.stringify(newStoryData, null, 2);
      const objectLiteralString = jsonString.replace(/"([^"]+)":/g, '$1:');
      
      // Indent the object literal string
      const indentedString = objectLiteralString.split('\n').map((line, i) => i === 0 ? line : '  ' + line).join('\n');

      const newContent = fileContent.substring(0, startIndex) + indentedString + fileContent.substring(endIndex);
      
      fs.writeFileSync(foundFile, newContent, 'utf-8');
      res.json({ success: true, file: path.basename(foundFile) });
    } catch (error) {
      console.error('Error saving story:', error);
      res.status(500).json({ error: 'Failed to save story to file.' });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
