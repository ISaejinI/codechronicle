import fs from "fs";
import path from "path";

const blogDir = path.join(process.cwd(), "public", "blog");
const outputPath = path.join(process.cwd(), "public", "index.html");

function escapeHtml(text = "") {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDateFromFilename(filename) {
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-/);

  if (!match) {
    return "Date inconnue";
  }

  const [, year, month, day] = match;

  return new Date(`${year}-${month}-${day}`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function cleanTitleFromFilename(filename) {
  return filename
    .replace(".html", "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function extractTitle(htmlContent, filename) {
  const h1Match = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/is);
  const titleMatch = htmlContent.match(/<title[^>]*>(.*?)<\/title>/is);

  if (h1Match) {
    return h1Match[1].replace(/<[^>]+>/g, "").trim();
  }

  if (titleMatch) {
    return titleMatch[1].replace(/<[^>]+>/g, "").trim();
  }

  return cleanTitleFromFilename(filename);
}

function extractSummary(htmlContent) {
  const metaDescriptionMatch = htmlContent.match(
    /<meta\s+name=["']description["']\s+content=["'](.*?)["']/is
  );

  const paragraphMatch = htmlContent.match(/<p[^>]*>(.*?)<\/p>/is);

  if (metaDescriptionMatch) {
    return metaDescriptionMatch[1].trim();
  }

  if (paragraphMatch) {
    return paragraphMatch[1].replace(/<[^>]+>/g, "").trim();
  }

  return "Aucun résumé disponible pour cet article.";
}

function extractTags(htmlContent) {
  const metaKeywordsMatch = htmlContent.match(
    /<meta\s+name=["']keywords["']\s+content=["'](.*?)["']/is
  );

  if (!metaKeywordsMatch) {
    return ["Article", "Blog", "IA"];
  }

  return metaKeywordsMatch[1]
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function generateArticleCards(articles) {
  if (articles.length === 0) {
    return `
      <p class="empty-message">
        Aucun article n’est disponible pour le moment.
      </p>
    `;
  }

  return articles
    .map((article) => {
      const tagsHtml = article.tags
        .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
        .join("");

      return `
      <article class="article-card">
        <div>
          <div class="article-date">${escapeHtml(article.date)}</div>
          <h2>${escapeHtml(article.title)}</h2>
          <p>${escapeHtml(article.summary)}</p>

          <div class="tags">
            ${tagsHtml}
          </div>
        </div>

        <a class="article-link" href="./blog/${escapeHtml(article.filename)}">
          Lire l’article <span>→</span>
        </a>
      </article>`;
    })
    .join("\n");
}

function getArticles() {
  if (!fs.existsSync(blogDir)) {
    console.log("Le dossier public/blog n'existe pas encore.");
    return [];
  }

  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".html"))
    .map((file) => {
      const filePath = path.join(blogDir, file);
      const htmlContent = fs.readFileSync(filePath, "utf-8");

      return {
        filename: file,
        title: extractTitle(htmlContent, file),
        summary: extractSummary(htmlContent),
        tags: extractTags(htmlContent),
        date: formatDateFromFilename(file),
      };
    })
    .sort((a, b) => b.filename.localeCompare(a.filename));
}

const articles = getArticles();
const articleCards = generateArticleCards(articles);

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>CodeChronicle — Blog technique IA</title>

  <meta
    name="description"
    content="CodeChronicle est un blog technique alimenté par l'intelligence artificielle."
  />

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
      line-height: 1.6;
    }

    header {
      padding: 80px 20px 50px;
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

    h1 {
      font-size: clamp(36px, 6vw, 72px);
      line-height: 1.1;
      margin-bottom: 20px;
    }

    .highlight {
      color: var(--primary);
    }

    .intro {
      max-width: 700px;
      margin: 0 auto;
      color: var(--muted);
      font-size: 18px;
    }

    main {
      width: min(1100px, 92%);
      margin: 0 auto;
      padding-bottom: 80px;
    }

    .section-title {
      margin-bottom: 25px;
      font-size: 28px;
    }

    .articles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .article-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 260px;
      padding: 24px;
      border: 1px solid var(--border);
      border-radius: 22px;
      background: rgba(17, 24, 39, 0.85);
      backdrop-filter: blur(12px);
      transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
    }

    .article-card:hover {
      transform: translateY(-6px);
      background: var(--card-hover);
      border-color: rgba(56, 189, 248, 0.5);
    }

    .article-date {
      margin-bottom: 12px;
      color: var(--primary);
      font-size: 14px;
      font-weight: 700;
    }

    .article-card h2 {
      margin-bottom: 12px;
      font-size: 22px;
      line-height: 1.3;
    }

    .article-card p {
      margin-bottom: 20px;
      color: var(--muted);
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 22px;
    }

    .tag {
      padding: 5px 10px;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.12);
      color: var(--primary);
      font-size: 13px;
      font-weight: 600;
    }

    .article-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--text);
      text-decoration: none;
      font-weight: 700;
    }

    .article-link span {
      transition: transform 0.2s ease;
    }

    .article-link:hover {
      color: var(--primary);
    }

    .article-link:hover span {
      transform: translateX(4px);
    }

    .empty-message {
      color: var(--muted);
      font-size: 18px;
      padding: 30px;
      border: 1px solid var(--border);
      border-radius: 18px;
      background: rgba(17, 24, 39, 0.85);
    }

    footer {
      padding: 30px 20px;
      border-top: 1px solid var(--border);
      text-align: center;
      color: var(--muted);
      font-size: 14px;
    }

    @media (max-width: 600px) {
      header {
        padding-top: 55px;
      }

      .article-card {
        min-height: auto;
      }
    }
  </style>
</head>

<body>
  <header>
    <div class="badge">🤖 Blog technique généré par IA</div>

    <h1>
      Bienvenue sur <span class="highlight">CodeChronicle</span>
    </h1>

    <p class="intro">
      Découvrez nos articles techniques générés automatiquement grâce à l’intelligence artificielle.
      GitHub, développement web, DevOps, automatisation : explorez les sujets clés du numérique.
    </p>
  </header>

  <main>
    <h2 class="section-title">📰 Derniers articles</h2>

    <section class="articles-grid">
      ${articleCards}
    </section>
  </main>

  <footer>
    <p>© 2026 CodeChronicle — Blog automatisé avec GitHub Actions et IA.</p>
  </footer>
</body>
</html>`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html);

console.log(`Index généré avec succès : ${outputPath}`);
console.log(`${articles.length} article(s) trouvé(s) dans public/blog/`);