const fileName = process.env.FILE;
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY est introuvable");
}

console.log(`Fichier à générer : ${fileName}`);
console.log("Clé API bien récupérée");