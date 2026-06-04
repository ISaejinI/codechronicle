import markdown, { getCodeString } from '@wcj/markdown-to-html';
import fs from 'fs';

const content = process.env.CONTENT;
const fileName = process.env.FILE_NAME;

const htmlContent = markdown(content);

fs.writeFileSync(`public/blog/${fileName}.html`, htmlContent);

console.log(htmlContent);