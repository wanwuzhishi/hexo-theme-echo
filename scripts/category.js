/**
 * Echo 主题 —— 文章分类页生成器（覆盖 hexo-generator-category）
 *
 * 与官方生成器行为一致，唯一区别：分类页内的文章先按 front-matter 的
 * `category_order` 排序（数值越小越靠前），未设置时回退到 `order`，再回退时间倒序。
 * 注册名为 'category'，会覆盖插件自带的同名生成器。
 */

'use strict';

const pagination = require('hexo-pagination');

function parseOrder(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  return isNaN(n) ? null : n;
}

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

hexo.extend.generator.register('category', function (locals) {
  const config = hexo.config;
  const perPage = (config.category_generator && config.category_generator.per_page) ||
    (typeof config.per_page === 'undefined' ? 10 : config.per_page);
  const paginationDir = config.pagination_dir || 'page';

  return locals.categories.reduce(function (result, category) {
    if (!category.length) return result;

    const posts = sortByKey(category.posts.toArray(), post => post.category_order);

    const data = pagination(category.path, posts, {
      perPage: perPage,
      layout: ['category', 'archive', 'index'],
      format: paginationDir + '/%d/',
      data: {
        category: category.name
      }
    });

    return result.concat(data);
  }, []);
});
