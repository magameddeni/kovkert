const fs = require('fs')

async function fetchProducts() {
  const res = await fetch('https://server.kovkert.ru/api/products/ids')
  const products = await res.json()
  return products?.data?.productIds?.map((e) => `https://www.kovkert.ru/product/${e}`) || []
}

async function fetchCategories() {
  const res = await fetch('https://server.kovkert.ru/api/categories/ids')
  const categories = await res.json()
  return categories?.data?.categoryIds?.map((e) => `https://www.kovkert.ru/category/${e}`) || []
}

async function fetchShops() {
  const res = await fetch('https://server.kovkert.ru/api/shop/slugs')
  const shops = await res.json()
  return shops?.data?.shopSlugs?.map((e) => `https://www.kovkert.ru/shop/${e}`) || []
}

function splitArrayIntoChunks(arr) {
  const chunkSize = 7000
  const chunks = []

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize)
    chunks.push(chunk)
  }

  return chunks
}

function makeSiteMapFile(data, i) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${data
        .map(
          (url) => `
        <url>
          <loc>${url}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <priority>0.8</priority>
        </url>
      `
        )
        .join('')}
    </urlset>`

  fs.writeFileSync(`public/sitemap-${i + 1}.xml`, sitemap)
}

function generateMainSiteMapFile(numberOfFiles) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${[...new Array(numberOfFiles)].map((_, i) => `<sitemap><loc>https://www.kovkert.ru/sitemap-${i}.xml</loc></sitemap>`).join('')}
      </sitemapindex>`

  fs.writeFileSync(`public/sitemap.xml`, sitemap)
}

async function generateSitemap() {
  const products = await fetchProducts()
  const categories = await fetchCategories()
  const shops = await fetchShops()
  const data = [...products, ...categories, ...shops]
  const chunks = splitArrayIntoChunks(data)
  chunks.map(makeSiteMapFile)
  generateMainSiteMapFile(chunks?.length + 1)
}

generateSitemap()
