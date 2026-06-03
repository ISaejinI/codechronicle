import OpenAI from "openai";
import fs from "fs";

const fileName = process.env.FILE;
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY est introuvable");
}

const response = await client.responses.create({
  model: "gpt-4.1-mini",
  input: `Génère un article Markdown complet à partir du fichier ${file}...`
});

fs.writeFileSync(`blog/${file}`, response.output_text);

console.log(`Fichier à générer : ${fileName}`);
console.log("Clé API bien récupérée");