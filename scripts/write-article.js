import OpenAI from "openai";
import fs from "fs";

const fileName = process.env.FILE;
const apiKey = process.env.OPENAI_API_KEY;
const openAiClient = new OpenAI({
    apiKey: apiKey,
})

if (!apiKey) {
  throw new Error("OPENAI_API_KEY est introuvable");
}

const response = await openAiClient.responses.create({
  model: "gpt-4.1-mini",
  input: `Tu es rédacteur technique. Génère un article de blog en Markdown à partir du nom de fichier suivant : ${fileName}. Le fichier suit le format YYYY-MM-DD-slug.md. Déduis le sujet depuis le slug. Réponds uniquement avec le contenu Markdown final, sans explication. Le fichier doit commencer par un frontmatter YAML contenant exactement : title, summary, tags. tags doit être une liste YAML. Ensuite, écris un article clair en français avec une introduction, plusieurs sections avec titres Markdown, des exemples concrets, et une conclusion. Sujet : ${fileName}`
});

fs.writeFileSync(`blog/${file}`, response.output_text);

console.log(`Fichier à générer : ${fileName}`);
console.log("Clé API bien récupérée");