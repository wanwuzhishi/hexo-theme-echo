/**
 * Echo 主题 —— 站点地图补全
 *
 * hexo-generator-sitemap 只收录文章、独立页面、分类和标签，
 * 归档（含年月分页）、文章列表、资源库以及它们的分页页都不会进 sitemap。
 * 这里在所有页面写盘之后，按本次实际生成的路由把缺的列表页补进 sitemap.xml。
 *
 * 关闭方式：主题配置 `sitemap.extra: false`。
 */

'use strict';

const fs = require('fs');
const path = require('path');

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function today() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + mm + '-' + dd;
}

// 把 URL 统一成解码形式再比较：插件输出的是 %E6%A8%A1 这种编码形式，
// hexo.route.list() 给的是原始中文路径，不归一化会把同一页面重复补一遍。
function normalize(url) {
  try {
    return decodeURI(url);
  } catch (e) {
    return url;
  }
}

// 输出时按路径分段编码（保留 /），避免 loc 里出现原始中文和空格。
function encodeUrl(url) {
  return url
    .split('/')
    .map(function (seg, i) {
      return i < 3 ? seg : encodeURIComponent(seg);
    })
    .join('/');
}

// 放在 before_exit：after_generate 阶段路由还在往磁盘写，sitemap.xml 可能尚未落盘。
hexo.extend.filter.register('before_exit', function () {
  const cfg = (hexo.theme.config && hexo.theme.config.sitemap) || {};
  if (cfg.extra === false) return;

  const sitemapFile = path.join(hexo.public_dir, 'sitemap.xml');
  if (!fs.existsSync(sitemapFile)) {
    hexo.log.warn('sitemap: 没有找到 sitemap.xml，跳过列表页补全');
    return;
  }

  const siteUrl = String(hexo.config.url || '').replace(/\/+$/, '');
  if (!siteUrl) return;

  const xml = fs.readFileSync(sitemapFile, 'utf8');
  const existing = new Set();
  const locPattern = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = locPattern.exec(xml)) !== null) existing.add(normalize(match[1]));

  // 只补 index.html 对应的页面，排除 sitemap.xml / search.json / 404 等非页面路由。
  const missing = [];
  hexo.route.list().forEach(function (routePath) {
    if (!/index\.html$/.test(routePath)) return;
    const clean = routePath.replace(/index\.html$/, '');
    const url = clean ? siteUrl + '/' + clean : siteUrl + '/';
    if (!existing.has(normalize(url))) missing.push(url);
  });

  if (!missing.length) return;

  missing.sort();
  const lastmod = today();
  const extra = missing
    .map(function (url) {
      return (
        '  <url>\n' +
        '    <loc>' + escapeXml(encodeUrl(url)) + '</loc>\n' +
        '    <lastmod>' + lastmod + '</lastmod>\n' +
        '    <changefreq>monthly</changefreq>\n' +
        '    <priority>0.5</priority>\n' +
        '  </url>'
      );
    })
    .join('\n');

  fs.writeFileSync(sitemapFile, xml.replace('</urlset>', extra + '\n</urlset>'), 'utf8');
  hexo.log.info('sitemap: 补入 ' + missing.length + ' 个列表页（归档 / 文章列表 / 资源库及其分页）');
});
