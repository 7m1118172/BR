import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Path to the products data file
const productsFilePath = path.join(__dirname, 'src', 'data', 'products.js');

// API to get products (optional if we still import them in frontend, but useful for persistence)
app.get('/api/products', (req, res) => {
  try {
    if (fs.existsSync(productsFilePath)) {
      const content = fs.readFileSync(productsFilePath, 'utf8');
      // Extract the array from "export default [...]"
      const jsonMatch = content.match(/export default (\[[\s\S]*\]);/);
      if (jsonMatch) {
        // This is a bit hacky but works for simple JS data files
        // A safer way would be to use products.json
        res.send(jsonMatch[1]);
      } else {
        res.status(500).send('Could not parse products file');
      }
    } else {
      res.status(404).send('Products file not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// API to save products back to the JS file
app.post('/api/products', (req, res) => {
  try {
    const products = req.body;
    const fileContent = `export default ${JSON.stringify(products, null, 2)};`;
    
    fs.writeFileSync(productsFilePath, fileContent, 'utf8');
    console.log('Products saved to products.js successfully');
    res.status(200).send({ message: 'Saved successfully' });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).send({ error: error.message });
  }
});

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
