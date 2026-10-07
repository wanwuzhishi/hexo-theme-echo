/**
 * Echo 主题 —— 模板辅助函数
 */

'use strict';

const path = require('path');

const ICONS = {
  film: '<path d="M4 4h16v16H4z"/><path d="M4 9h16M4 15h16M9 4v16M15 4v16"/>',
  gamepad: '<path d="M6 12h4M8 10v4M15 11h.01M18 13h.01"/><path d="M17.3 5H6.7a4 4 0 0 0-3.9 3.2l-1 6A3.2 3.2 0 0 0 6.9 17c1 0 2-.5 2.6-1.3l.6-.7h3.8l.6.7c.6.8 1.6 1.3 2.6 1.3a3.2 3.2 0 0 0 3.1-2.8l-1-6A4 4 0 0 0 17.3 5z"/>',
  puzzle: '<path d="M10 3a2 2 0 0 1 2 2v1h3.5a1.5 1.5 0 0 1 1.5 1.5V11h1a2 2 0 1 1 0 4h-1v3.5a1.5 1.5 0 0 1-1.5 1.5H12v-1a2 2 0 1 0-4 0v1H4.5A1.5 1.5 0 0 1 3 18.5V15h1a2 2 0 1 0 0-4H3V7.5A1.5 1.5 0 0 1 4.5 6H8V5a2 2 0 0 1 2-2z"/>',
  language: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z"/>',
  app: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h5"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  archive: '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4"/>',
  tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 3 12V4a1 1 0 0 1 1-1h8a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6z"/><path d="M7.5 7.5h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  download: '<path d="M12 3v12M7 11l5 5 5-5M5 20h14"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>',
  external: '<path d="M14 4h6v6M20 4l-8 8"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  rss: '<path d="M5 19h.01"/><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/>',
  github: '<path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.8A5.3 5.3 0 0 0 19 5.6a4.9 4.9 0 0 0-.1-3.6s-1.2-.4-3.9 1.5a13.4 13.4 0 0 0-7 0C5.3 1.6 4.1 2 4.1 2A4.9 4.9 0 0 0 4 5.6a5.3 5.3 0 0 0-1.4 3.7c0 5.2 3.2 6.4 6.2 6.8A3.4 3.4 0 0 0 8 18.6V22"/>',
  fire: '<path d="M12 3c3 4 6 6 6 10a6 6 0 0 1-12 0c0-2 1-3.5 2.5-5C9.5 9.5 11 8 12 3z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',

  bilibili: '<path d="M6 4 4 6M18 4l2 2"/><rect x="3" y="6" width="18" height="14" rx="3"/><path d="M8 11v3M16 11v3"/>',
  telegram: '<path d="M21 4 3 11l5 2 2 6 3-4 5 3z"/><path d="m8 13 8-5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  music: '<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="16" r="2"/>',
  play: '<path d="M8 5.5v13l11-6.5z"/>',
  pause: '<path d="M9 5v14M15 5v14"/>',
  'skip-back': '<path d="M18 6v12L9 12zM6 5v14"/>',
  'skip-forward': '<path d="M6 6v12l9-6zM18 5v14"/>',
  shuffle: '<path d="M17 4h4v4M21 4l-6 6M3 20l6-6M17 20h4v-4M3 4l4 4"/>',
  repeat: '<path d="M17 2l4 4-4 4"/><path d="M3 12v-2a4 4 0 0 1 4-4h14M7 22l-4-4 4-4"/><path d="M21 12v2a4 4 0 0 1-4 4H3"/>',
  volume: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M16 9a4 4 0 0 1 0 6"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  'file-text': '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  'trending-up': '<path d="m3 17 6-6 4 4 8-8"/><path d="M21 7v6h-6"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
  'folder-tree': '<path d="M3 5a1 1 0 0 1 1-1h3l1.5 1.5H11a1 1 0 0 1 1 1V9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M6 10v9h12M6 14h4"/><path d="M13 14h7v5h-7z"/>',
  activity: '<path d="M3 12h4l2-6 3 12 2-6h7"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>'
};

function svgIcon(name, size) {
  const body = ICONS[name] || ICONS.box;
  const s = Number(size) || 20;
  return `<svg class="icon" viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" ` +
    `stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

function firstValue(value) {
  if (Array.isArray(value)) return value.length ? value[0] : '';
  if (value && typeof value === 'object' && value.name) return value.name;
  return value;
}

function truncate(text, length) {
  if (!text) return '';
  const plain = String(text)
    // 先整块剔除代码 / 预格式化区域，避免行号与代码被当成正文摘要
    .replace(/<pre[\s\S]*?<\/pre>/gi, ' ')
    .replace(/<figure[^>]*highlight[\s\S]*?<\/figure>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x?2F;/gi, '/')
    .replace(/\s+/g, ' ')
    .trim();
  const max = Number(length) || 100;
  if (plain.length <= max) return plain;
  return plain.slice(0, max).trim() + '…';
}

function wordCount(content) {
  if (!content) return 0;
  const plain = String(content)
    .replace(/<pre[\s\S]*?<\/pre>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, '');
  const cjk = (plain.match(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g) || []).length;
  const words = (plain.match(/[A-Za-z0-9_'-]+/g) || []).length;
  return cjk + words;
}

function readingTime(content) {
  const perMinute = Number(hexo.theme.config.post && hexo.theme.config.post.words_per_minute) || 300;
  const count = wordCount(content);
  return Math.max(1, Math.round(count / perMinute));
}

function pad(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatDate(date, format) {
  if (!date) return '';
  const d = date instanceof Date ? date : (date.toDate ? date.toDate() : new Date(date));
  if (Number.isNaN(d.getTime())) return '';
  const fmt = format || 'YYYY-MM-DD';
  return fmt
    .replace(/YYYY/g, d.getFullYear())
    .replace(/MM/g, pad(d.getMonth() + 1))
    .replace(/DD/g, pad(d.getDate()))
    .replace(/HH/g, pad(d.getHours()))
    .replace(/mm/g, pad(d.getMinutes()));
}

function resourceTypes() {
  const types = hexo.config.resources && hexo.config.resources.types;
  return Array.isArray(types) ? types : [];
}

function resourceTypeOf(post) {
  const types = resourceTypes();
  const key = post && post.resource ? String(post.resource.type || '').trim() : '';
  const found = types.find(t => t.key === key);
  return found || { key: key || 'other', name: '其他资源', icon: 'box' };
}

function panColor(name) {
  const colors = hexo.theme.config.resource && hexo.theme.config.resource.pan_colors;
  if (colors && colors[name]) return colors[name];
  return '';
}

function resolveAsset(url) {
  if (!url) return '';
  const value = String(url);
  if (/^(https?:)?\/\//.test(value) || value.startsWith('data:')) return value;
  const root = hexo.config.root || '/';
  const normalized = value.startsWith('/') ? value.slice(1) : value;
  return (root.endsWith('/') ? root : root + '/') + normalized;
}

function navActive(current, target) {
  if (!target) return false;
  const root = hexo.config.root || '/';
  const strip = value => {
    let v = String(value).replace(/\/index\.html$/, '/');
    if (root !== '/' && v.startsWith(root)) v = '/' + v.slice(root.length);
    if (!v.startsWith('/')) v = '/' + v;
    return v.replace(/\/+$/, '') || '/';
  };
  const a = strip(current);
  const b = strip(target);
  if (b === '/') return a === '/';
  return a === b || a.startsWith(b + '/');
}

/* ---------- 站点统计辅助 ---------- */

// 取站点数据源（helper 作用域内没有 site 变量）
function getSite() {
  return (hexo.locals && hexo.locals.get && hexo.locals.get('site')) || {};
}

// 全站总字数（优先使用模板传入的 posts 集合）
function siteWordCount(posts) {
  var list = posts || getSite().posts;
  var total = 0;
  if (list && list.forEach) {
    list.forEach(function (post) { total += wordCount(post.content); });
  }
  return total;
}

// 文章总数
function sitePostCount(posts) {
  var list = posts || getSite().posts;
  return (list && list.length) || 0;
}

// 运行时长：返回 { days, text }
function siteRuntime(since) {
  var start = since ? new Date(since) : new Date();
  if (Number.isNaN(start.getTime())) start = new Date();
  var diff = Date.now() - start.getTime();
  if (diff < 0) diff = 0;
  var days = Math.floor(diff / 86400000);
  return { days: days, text: days + ' 天' };
}

// 最后活动：最近一篇文章的更新/发布时间
function lastActivity(posts) {
  var src = posts || getSite().posts;
  if (!src) return '';
  var list = src.sort('-updated').toArray();
  if (!list.length) list = src.sort('-date').toArray();
  if (!list.length) return '';
  var post = list[0];
  var d = post.updated || post.date;
  if (!d) return '';
  var date = d.toDate ? d.toDate() : new Date(d);
  if (Number.isNaN(date.getTime())) return '';
  return formatDate(date, 'YYYY-MM-DD');
}

// 分类计数
function siteCategoryCount() {
  var src = getSite();
  return (src.categories && src.categories.length) || 0;
}

// 标签计数
function siteTagCount() {
  var src = getSite();
  return (src.tags && src.tags.length) || 0;
}

// 代码语言显示名
var LANG_LABELS = {
  js: 'JavaScript', javascript: 'JavaScript', ts: 'TypeScript', typescript: 'TypeScript',
  py: 'Python', python: 'Python', rb: 'Ruby', go: 'Go', rs: 'Rust', java: 'Java',
  c: 'C', cpp: 'C++', cs: 'C#', php: 'PHP', swift: 'Swift', kt: 'Kotlin',
  sh: 'Shell', bash: 'Bash', zsh: 'Zsh', powershell: 'PowerShell', ps1: 'PowerShell',
  yml: 'YAML', yaml: 'YAML', json: 'JSON', toml: 'TOML', ini: 'INI', xml: 'XML',
  html: 'HTML', css: 'CSS', scss: 'SCSS', less: 'Less', vue: 'Vue', jsx: 'JSX', tsx: 'TSX',
  md: 'Markdown', markdown: 'Markdown', sql: 'SQL', diff: 'Diff', dockerfile: 'Dockerfile',
  nginx: 'Nginx', plaintext: 'Plaintext', text: 'Plaintext', ejs: 'EJS'
};

function langLabel(name) {
  if (!name) return 'Plaintext';
  var key = String(name).toLowerCase();
  return LANG_LABELS[key] || key.toUpperCase();
}

hexo.extend.helper.register('echo_site_words', siteWordCount);
hexo.extend.helper.register('echo_site_posts', sitePostCount);
hexo.extend.helper.register('echo_site_runtime', siteRuntime);
hexo.extend.helper.register('echo_last_activity', lastActivity);
hexo.extend.helper.register('echo_category_count', siteCategoryCount);
hexo.extend.helper.register('echo_tag_count', siteTagCount);
hexo.extend.helper.register('echo_lang_label', langLabel);
hexo.extend.helper.register('echo_icon', svgIcon);
hexo.extend.helper.register('echo_truncate', truncate);
hexo.extend.helper.register('echo_word_count', wordCount);
hexo.extend.helper.register('echo_reading_time', readingTime);
hexo.extend.helper.register('echo_date', formatDate);
hexo.extend.helper.register('echo_resource_types', resourceTypes);
hexo.extend.helper.register('echo_resource_type', resourceTypeOf);
hexo.extend.helper.register('echo_pan_color', panColor);
hexo.extend.helper.register('echo_asset', resolveAsset);
hexo.extend.helper.register('echo_is_active', navActive);

hexo.extend.helper.register('echo_cover', function (post) {
  if (!post) return '';
  if (post.cover) return resolveAsset(post.cover);
  if (post.photos && post.photos.length) return resolveAsset(firstValue(post.photos));
  return '';
});

hexo.extend.helper.register('echo_categories', function (post, limit) {
  if (!post || !post.categories) return [];
  const list = post.categories.toArray().map(c => ({ name: c.name, path: c.path }));
  return limit ? list.slice(0, Number(limit)) : list;
});

hexo.extend.helper.register('echo_tags', function (post, limit) {
  if (!post || !post.tags) return [];
  const list = post.tags.toArray().map(t => ({ name: t.name, path: t.path }));
  return limit ? list.slice(0, Number(limit)) : list;
});




