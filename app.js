// app.js
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

async function fetchAndParse(url) {
  const dom = await JSDOM.fromURL(url);
  const document = dom.window.document;

  let articole = [];
  let titluSectiune = '';
  let titluCapitol = '';

  const relevantElements = `
    #anf_read_speaker01 > .stilTitluri,
    #anf_read_speaker01 > .stilCapitol,
    #anf_read_speaker01 > .stilArticol,
    #anf_read_speaker01 > .stilParagraf
    `;

  for (let paragraph of document.querySelectorAll(relevantElements)) {
    let text = paragraph.textContent.replace(/\t/gi, '');

    if (paragraph.classList.contains('stilTitluri')) {
      titluSectiune = text;
    } else if (paragraph.classList.contains('stilCapitol')) {
      titluCapitol = text;
    } else if (paragraph.classList.contains('stilArticol')) {
      articole.push({
        titluArticol: paragraph.textContent,
        textArticol: getArticleBody(paragraph),
        titluCapitol,
        titluSectiune,
      });
    }
  }

  console.log(articole.slice(15, 20));
}

function getArticleBody(element) {
  let articleText = '';
  while ((element = element.nextSibling)) {
    if (element.nodeType !== 1) continue; // Skip non-element nodes
    if (!element.classList.contains('stilParagraf') && !element.classList.contains('stilNota')) {
      break; // Exit loop if non-alineat element is found
    }
    const alineatIdentifier = element.querySelector('a')?.getAttribute('name');

    articleText += `${alineatIdentifier ? `# ${alineatIdentifier}: ` : ''} ${element.textContent}\n`;
  }
  return articleText;
}

const url = 'https://static.anaf.ro/static/10/Anaf/legislatie/Cod_fiscal_norme_2023.htm';

fetchAndParse(url);
