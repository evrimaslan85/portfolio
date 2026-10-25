/* SPDX-License-Identifier: MIT */
(function (root) {
  'use strict';
  const schema = typeof module === 'object' && module.exports ? require('./schema.js') : root.PortfolioSchema;
  const fail = (condition, message) => { if (!condition) throw new Error(message); };
  function check(rule, value, location) {
    if (rule.$ref) return check(schema.$defs[rule.$ref.slice('#/$defs/'.length)], value, location);
    const type = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
    fail(type === rule.type, location + ': expected ' + rule.type);
    if (rule.enum) fail(rule.enum.includes(value), location + ': unsupported value');
    if (type === 'string') {
      const size = [...value].length;
      fail(rule.minLength === undefined || size >= rule.minLength, location + ': value is too short');
      fail(rule.maxLength === undefined || size <= rule.maxLength, location + ': value is too long');
      fail(!rule.pattern || new RegExp(rule.pattern, 'u').test(value), location + ': invalid value');
    }
    if (type === 'array') {
      fail(rule.maxItems === undefined || value.length <= rule.maxItems, location + ': too many items');
      if (rule.uniqueItems) fail(new Set(value.map(item => JSON.stringify(item))).size === value.length, location + ': duplicate values');
      value.forEach((item, index) => check(rule.items, item, location + '[' + index + ']'));
    }
    if (type === 'object') {
      (rule.required || []).forEach(key => fail(Object.hasOwn(value, key), location + ': missing ' + key));
      Object.keys(value).forEach(key => { fail(Object.hasOwn(rule.properties, key), location + ': unsupported field ' + key); check(rule.properties[key], value[key], location + '.' + key); });
    }
  }
  function safeSource(source) {
    if (typeof source !== 'string' || !source || /[\s\\\u0000-\u001f\u007f]/u.test(source)) return false;
    let decoded; try { decoded = decodeURIComponent(source); } catch { return false; }
    if (/[\\\u0000-\u001f\u007f%]/u.test(decoded) || /(^|\/)\.{1,2}(\/|$)/u.test(decoded)) return false;
    if (source.startsWith('https://')) { try { const u = new URL(source); return Boolean(u.hostname) && !u.username && !u.password; } catch { return false; } }
    return /^[A-Za-z0-9][A-Za-z0-9_./-]*$/u.test(decoded) && !decoded.split('/').some(part => !part || part === '.' || part === '..');
  }
  function unique(items, key, label) { const ids = items.map(item => item[key]); fail(new Set(ids).size === ids.length, label + ': duplicate ' + key); return new Set(ids); }
  function validate(data) {
    check(schema, data, 'Portfolio'); unique(data.projects, 'id', 'Projects'); unique(data.projects, 'slug', 'Projects');
    for (const p of data.projects) {
      const evidence = unique(p.evidence, 'id', p.title + ' evidence');
      const tech = unique(p.technologies, 'id', p.title + ' technologies');
      unique(p.systems, 'id', p.title + ' systems'); unique(p.implementations, 'id', p.title + ' implementations'); unique(p.results, 'id', p.title + ' results');
      const nodes = unique(p.architecture.nodes, 'id', p.title + ' architecture');
      for (const item of [...Object.values(p.sections), ...p.implementations, ...p.results]) for (const id of item.evidenceIds) fail(evidence.has(id), p.title + ': unknown evidence reference');
      for (const item of p.implementations) for (const id of item.technologyIds) fail(tech.has(id), p.title + ': unknown technology reference');
      for (const edge of p.architecture.edges) fail(nodes.has(edge.from) && nodes.has(edge.to), p.title + ': unknown architecture endpoint');
      for (const item of p.evidence) { fail(safeSource(item.src), p.title + ': use HTTPS or a safe relative media path'); if (item.type === 'image') fail(Boolean(item.alt.trim()), p.title + ': add alternative text for the image'); }
    }
    return data;
  }
  function freshProject() {
    const id = 'project-' + (root.crypto?.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2));
    const section = title => ({ title, body: '', evidenceIds: [] });
    return { id, slug: id, title: 'New project', summary: 'Describe the work in one sentence.', status: 'prototype', featured: false, systems: [], technologies: [], sections: { overview: section('Overview'), challenge: section('The challenge'), solution: section('The solution'), outcomes: section('Results and impact') }, implementations: [], architecture: { nodes: [], edges: [] }, results: [], evidence: [] };
  }
  const api = { validate, safeSource, freshProject };
  root.PortfolioContract = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(globalThis);
