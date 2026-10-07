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

// 把 front-matter 的排序字段（order / category_order）解析成数字；
// 缺失、空、非数字一律视为「不参与自定义排序」（返回 null）。
function parseOrder(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  return isNaN(n) ? null : n;
}

// 通用排序：带自定义排序值的资源优先（数值越小越靠前），其余按时间倒序。
// 全局用 order；各类型页用 category_order，缺失时回退到 order，再回退时间。
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

function resourceKey(post) {
  // 各类型页：优先 category_order，其次 order
  if (post.category_order !== undefined && post.category_order !== null) return post.category_order;
  if (post.order !== undefined && post.order !== null) return post.order;
  return null;
}

function resourceList(locals) {
  return sortByKey(
    locals.posts.filter(post => isResource(post)).toArray(),
    post => post.order
  );
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
    const typed = sortByKey(
      posts.filter(post => (normalize(post.resource.type) || 'other') === type.key),
      post => resourceKey(post)
    );
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

