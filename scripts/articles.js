/**
 * Echo 主题 —— 文章板块生成器
 *
 * 「文章」= 不带 `resource.enable: true` 的普通文章（技术笔记、教程、随笔等）。
 * 资源类文章会出现在 /resources/ 里，不在这里重复出现。
 *
 * 生成：
 *   /articles/          全部文章（分页）
 */

'use strict';

const pagination = require('hexo-pagination');

function isResource(post) {
  return !!(post && post.resource && post.resource.enable);
}

// 把 front-matter 的排序字段（order / category_order）解析成数字；
// 缺失、空、非数字一律视为「不参与自定义排序」（返回 null）。
function parseOrder(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  return isNaN(n) ? null : n;
}

// 通用排序：带自定义排序值的文章优先（数值越小越靠前），其余按时间倒序。
// getKey(post) 返回该文章用于本次排序的字段值（全局用 order，分类内用 category_order）。
function sortByKey(posts, getKey) {
  return posts.slice().sort(function (a, b) {
    const ka = parseOrder(getKey(a));
    const kb = parseOrder(getKey(b));
    const da = a.date ? a.date.unix() : 0;
    const db = b.date ? b.date.unix() : 0;
    if (ka !== null && kb !== null) return ka - kb;
    if (ka !== null) return -1;
    if (kb !== null) return 1;
    return db - da;
  });
}

hexo.extend.generator.register('articles', function (locals) {
  const siteConfig = hexo.config;
  const cfg = Object.assign({ path: 'articles', per_page: 12 }, siteConfig.articles || {});

  const basePath = String(cfg.path || 'articles').replace(/^\/+|\/+$/g, '') || 'articles';
  const perPage = Number(cfg.per_page) || 12;

  const posts = sortByKey(
    locals.posts.filter(post => !isResource(post)).toArray(),
    post => post.order
  );

  const data = {
    articleIndex: true,
    articleTotal: posts.length,
    articleBase: basePath,
    title: '文章'
  };

  return pagination(`/${basePath}/`, posts, {
    perPage: perPage,
    layout: 'article-index',
    format: 'page/%d/',
    data: data
  });
});
