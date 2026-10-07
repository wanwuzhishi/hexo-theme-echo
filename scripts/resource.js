/**
 * Echo 主题 —— 资源板块生成器
 *
 * 资源 = 带有 `resource.enable: true` 的文章。
 * 本脚本负责生成：
 *   /resources/            全部资源（分页）
 *   /resources/<type>/     按类型分页
 *   /search.json           站内搜索索引
 */

'use strict';

const pagination = require('hexo-pagination');

function isResource(post) {
  return !!(post && post.resource && post.resource.enable);
}

function normalize(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

function resourceList(locals) {
  return locals.posts
    .filter(post => isResource(post))
    .sort('-date')
    .toArray();
}

hexo.extend.generator.register('resources', function (locals) {
  const siteConfig = hexo.config;
  const resConfig = Object.assign(
    { path: 'resources', per_page: 12, types: [] },
    siteConfig.resources || {}
  );

  const basePath = normalize(resConfig.path).replace(/^\/+|\/+$/g, '') || 'resources';
  const perPage = Number(resConfig.per_page) || 12;
  const types = Array.isArray(resConfig.types) ? resConfig.types : [];
  const posts = resourceList(locals);

  const typeCounts = {};
  types.forEach(type => {
    typeCounts[type.key] = 0;
  });
  posts.forEach(post => {
    const key = normalize(post.resource.type) || 'other';
    typeCounts[key] = (typeCounts[key] || 0) + 1;
  });

  const routes = [];
  const typeMetas = types.map(type => Object.assign({}, type, {
    count: typeCounts[type.key] || 0
  }));

  // ---- 全部资源 ----
  const allData = {
    resourceIndex: true,
    resourceType: null,
    resourceTypes: typeMetas,
    resourceTotal: posts.length,
    resourceBase: basePath,
    title: '资源库'
  };

  routes.push.apply(routes, pagination(`/${basePath}/`, posts, {
    perPage: perPage,
    layout: 'resource-index',
    format: 'page/%d/',
    data: allData
  }));

  // ---- 分类资源 ----
  types.forEach(type => {
    const typed = posts.filter(post => (normalize(post.resource.type) || 'other') === type.key);
    const data = {
      resourceIndex: true,
      resourceType: type,
      resourceTypes: typeMetas,
      resourceTotal: typed.length,
      resourceBase: basePath,
      title: type.name
    };

    routes.push.apply(routes, pagination(`/${basePath}/${type.key}/`, typed, {
      perPage: perPage,
      layout: 'resource-index',
      format: 'page/%d/',
      data: data
    }));
  });

  // ---- 搜索索引 ----
  const searchIndex = locals.posts.sort('-date').toArray().map(post => ({
    title: post.title,
    url: post.path ? `/${post.path}` : post.permalink,
    date: post.date ? post.date.format('YYYY-MM-DD') : '',
    categories: (post.categories ? post.categories.toArray() : []).map(c => c.name),
    tags: (post.tags ? post.tags.toArray() : []).map(t => t.name),
    resource: isResource(post),
    resourceType: isResource(post) ? (normalize(post.resource.type) || 'other') : '',
    cover: post.cover || '',
    excerpt: String(post.excerpt || post.content || '')
      // 整块剔除代码区域，避免行号混入摘要
      .replace(/<pre[\s\S]*?<\/pre>/gi, ' ')
      .replace(/<figure[^>]*highlight[\s\S]*?<\/figure>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      // 先解实体，再清理 Markdown 记号，避免把 &#x2F; 拆坏
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#0?39;/g, "'")
      .replace(/&#x?2F;/gi, '/')
      .replace(/[#*`>|]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160)
  }));

  routes.push({
    path: 'search.json',
    data: JSON.stringify(searchIndex)
  });

  return routes;
});

