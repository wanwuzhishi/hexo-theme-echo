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

hexo.extend.generator.register('articles', function (locals) {
  const siteConfig = hexo.config;
  const cfg = Object.assign({ path: 'articles', per_page: 12 }, siteConfig.articles || {});

  const basePath = String(cfg.path || 'articles').replace(/^\/+|\/+$/g, '') || 'articles';
  const perPage = Number(cfg.per_page) || 12;

  const posts = locals.posts
    .filter(post => !isResource(post))
    .sort('-date')
    .toArray();

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
