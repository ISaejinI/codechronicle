import fs from "fs";

const fileName = process.env.FILE_NAME;

const inputPath = `blog/${fileName}.md`;
const outputPath = `public/blog/${fileName}.html`;

let markdownContent = fs.readFileSync(inputPath, "utf8");

// Supprime les balises ```markdown éventuelles générées par l'IA
markdownContent = markdownContent
  .replace(/^```markdown\s*/i, "")
  .replace(/^```\s*/i, "")
  .replace(/```\s*$/i, "")
  .trim();

const titleMatch = markdownContent.match(/^title:\s*"?(.*?)"?$/m);
const summaryMatch = markdownContent.match(/^summary:\s*"?(.*?)"?$/m);
const tagsMatch = markdownContent.match(/tags:\s*\n((?:\s*-\s*.+\n?)+)/);

const title = titleMatch ? titleMatch[1] : fileName;
const summary = summaryMatch ? summaryMatch[1] : "Aucun résumé disponible.";

const tags = tagsMatch
  ? tagsMatch[1]
      .split("\n")
      .map((line) => line.replace(/^\s*-\s*/, "").trim())
      .filter(Boolean)
  : [];

// Supprime le frontmatter YAML pour ne pas l'afficher dans l'article
markdownContent = markdownContent
  .replace(/^---\s*\n[\s\S]*?\n---\s*/, "")
  .trim();

function convertInline(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>");
}

function markdownToHtml(markdown) {
  const lines = markdown.split("\n");
  let html = "";
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "") {
      if (inList) {
        html += "</ul>\n";
        inList = false;
      }
      continue;
    }

    if (trimmed.startsWith("- ")) {
      if (!inList) {
        html += "<ul>\n";
        inList = true;
      }

      html += `<li>${convertInline(trimmed.slice(2))}</li>\n`;
      continue;
    }

    if (inList) {
      html += "</ul>\n";
      inList = false;
    }

    if (trimmed.startsWith("### ")) {
      html += `<h3>${convertInline(trimmed.slice(4))}</h3>\n`;
    } else if (trimmed.startsWith("## ")) {
      html += `<h2>${convertInline(trimmed.slice(3))}</h2>\n`;
    } else if (trimmed.startsWith("# ")) {
      html += `<h1>${convertInline(trimmed.slice(2))}</h1>\n`;
    } else if (trimmed === "---") {
      html += `<hr>\n`;
    } else {
      html += `<p>${convertInline(trimmed)}</p>\n`;
    }
  }

  if (inList) {
    html += "</ul>\n";
  }

  return html;
}

const tagsHtml = tags.length
  ? `<div class="tags">
      ${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
    </div>`
  : "";

const articleHtml = markdownToHtml(markdownContent);

const fullHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${title}</title>
  <meta name="description" content="${summary}" />

  <style>
    :root {
      --bg: #0f172a;
      --card: #111827;
      --card-hover: #1f2937;
      --text: #f9fafb;
      --muted: #9ca3af;
      --primary: #38bdf8;
      --border: rgba(255, 255, 255, 0.1);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      min-height: 100vh;
      font-family: Arial, Helvetica, sans-serif;
      background:
        radial-gradient(circle at top left, rgba(56, 189, 248, 0.2), transparent 30%),
        radial-gradient(circle at bottom right, rgba(99, 102, 241, 0.2), transparent 30%),
        var(--bg);
      color: var(--text);
      line-height: 1.7;
    }

    header {
      padding: 60px 20px 30px;
      text-align: center;
    }

    .badge {
      display: inline-block;
      margin-bottom: 20px;
      padding: 8px 14px;
      border: 1px solid var(--border);
      border-radius: 999px;
      color: var(--primary);
      background: rgba(56, 189, 248, 0.08);
      font-size: 14px;
      font-weight: 600;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 30px;
      color: var(--primary);
      text-decoration: none;
      font-weight: 700;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    main {
      width: min(900px, 92%);
      margin: 0 auto 80px;
      padding: 40px;
      border: 1px solid var(--border);
      border-radius: 24px;
      background: rgba(17, 24, 39, 0.85);
      backdrop-filter: blur(12px);
    }

    h1 {
      margin-bottom: 24px;
      font-size: clamp(36px, 5vw, 56px);
      line-height: 1.1;
    }

    h2 {
      margin-top: 42px;
      margin-bottom: 16px;
      font-size: 30px;
      color: var(--primary);
    }

    h3 {
      margin-top: 30px;
      margin-bottom: 12px;
      font-size: 22px;
    }

    p {
      margin-bottom: 18px;
      color: var(--muted);
      font-size: 18px;
    }

    ul {
      margin: 18px 0 24px 24px;
    }

    li {
      margin-bottom: 12px;
      color: var(--muted);
      font-size: 18px;
    }

    strong {
      color: var(--text);
    }

    em {
      color: var(--muted);
    }

    code {
      padding: 3px 7px;
      border-radius: 6px;
      background: rgba(56, 189, 248, 0.12);
      color: var(--primary);
    }

    hr {
      margin: 40px 0;
      border: none;
      border-top: 1px solid var(--border);
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 34px;
    }

    .tag {
      padding: 6px 12px;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.12);
      color: var(--primary);
      font-size: 14px;
      font-weight: 600;
    }

    footer {
      padding: 30px 20px;
      border-top: 1px solid var(--border);
      text-align: center;
      color: var(--muted);
      font-size: 14px;
    }

    @media (max-width: 600px) {
      main {
        padding: 26px;
      }

      h1 {
        font-size: 34px;
      }
    }
  </style>
</head>

<body>
  <header>
    <div class="badge">🤖 Article généré par IA</div>
  </header>

  <main>
    <a class="back-link" href="../index.html">← Retour aux articles</a>

    ${tagsHtml}

    ${articleHtml}
  </main>

  <footer>
    <p>© 2026 CodeChronicle — Blog automatisé avec GitHub Actions et IA.</p>
  </footer>
</body>
</html>`;

fs.writeFileSync(outputPath, fullHtml, "utf8");

console.log(`Article converti en HTML : ${outputPath}`);