const http = require('http');
const fs = require('fs');
const url = require('url');
const queryString = require('querystring');

const slugify = require('slugify');
const replaceTemplate = require('./module/replaceTemplate');

//Load template - Synchronous. Becasue It needs to load once.
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

//Load json data - Synchronous. Becasue It needs to load once.
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((elem) => slugify(elem.productName, { lower: true }));

// console.log(slugs);
//Create server
const server = http.createServer((req, res) => {
  const baseURL = `http://${req.headers.host}`;
  const requestURL = new URL(req.url, baseURL);
  const pathname = requestURL.pathname;

  const query = requestURL.searchParams.get('id');
  //console.log(query);
  //Overview page | Home page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    const cardHtml = dataObj
      .map((elem) => replaceTemplate(templateCard, elem))
      .join('');
    const output = templateOverview.replace('{%PRODUCT_CARD%}', cardHtml);
    res.end(output);
  }
  //Product page
  else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    const product = dataObj[query];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);
  }
  //Api page
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    res.end(data);
  }
  //Error page
  else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('server is running on 127.0.0.1:8000');
});
