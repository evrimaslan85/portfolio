// SPDX-License-Identifier: MIT
// A repository-fixture check, not a general JSON Schema engine or production importer.
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const root = fileURLToPath(new URL('../', import.meta.url));
const allowedKeywords = new Set(['$schema', '$id', '$ref', '$defs', 'title', 'description', 'type', 'additionalProperties', 'required', 'properties', 'enum', 'minLength', 'maxLength', 'pattern', 'items', 'minItems', 'maxItems', 'uniqueItems']);

function requireThat(condition, message) { if (!condition) throw new Error(message); }

export function checkSchemaKeywords(schema) {
  for (const key of Object.keys(schema)) requireThat(allowedKeywords.has(key), `Unsupported schema keyword: ${key}`);
  for (const child of Object.values(schema.properties || {})) checkSchemaKeywords(child);
  for (const child of Object.values(schema.$defs || {})) checkSchemaKeywords(child);
  if (schema.items) checkSchemaKeywords(schema.items);
}

export function validateSchema(schema, value, document = schema, location = '$') {
  if (schema.$ref) {
    requireThat(schema.$ref.startsWith('#/$defs/'), `${location}: unsupported reference`);
    const target = document.$defs[schema.$ref.slice('#/$defs/'.length)];
    requireThat(Boolean(target), `${location}: unresolved schema reference`);
    return validateSchema(target, value, document, location);
  }
  const kind = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
  requireThat(!schema.type || kind === schema.type, `${location}: expected ${schema.type}, received ${kind}`);
  if (schema.enum) requireThat(schema.enum.includes(value), `${location}: unsupported value`);
  if (kind === 'string') {
    const length = [...value].length;
    requireThat(schema.minLength === undefined || length >= schema.minLength, `${location}: too short`);
    requireThat(schema.maxLength === undefined || length <= schema.maxLength, `${location}: too long`);
    requireThat(!schema.pattern || new RegExp(schema.pattern, 'u').test(value), `${location}: invalid pattern`);
  }
  if (kind === 'array') {
    requireThat(schema.minItems === undefined || value.length >= schema.minItems, `${location}: too few items`);
    requireThat(schema.maxItems === undefined || value.length <= schema.maxItems, `${location}: too many items`);
    if (schema.uniqueItems) requireThat(new Set(value.map(item => JSON.stringify(item))).size === value.length, `${location}: duplicate values`);
    if (schema.items) value.forEach((item, index) => validateSchema(schema.items, item, document, `${location}[${index}]`));
  }
  if (kind === 'object') {
    for (const key of schema.required || []) requireThat(Object.hasOwn(value, key), `${location}: missing ${key}`);
    for (const [key, child] of Object.entries(value)) {
      const childSchema = schema.properties?.[key];
      requireThat(Boolean(childSchema) || schema.additionalProperties !== false, `${location}: unexpected field ${key}`);
      if (childSchema) validateSchema(childSchema, child, document, `${location}.${key}`);
    }
  }
}

export function safeEvidenceSource(source) {
  if (typeof source !== 'string' || !source || /[\s\\\u0000-\u001f\u007f]/u.test(source)) return false;
  let decoded;
  try { decoded = decodeURIComponent(source); } catch { return false; }
  if (/[\\\u0000-\u001f\u007f%]/u.test(decoded) || /(^|\/)\.{1,2}(\/|$)/u.test(decoded)) return false;
  if (source.startsWith('https://')) {
    try {
      const url = new URL(source);
      return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
    } catch { return false; }
  }
  return /^[A-Za-z0-9][A-Za-z0-9_./-]*$/u.test(decoded) && !decoded.split('/').some(part => !part || part === '.' || part === '..');
}

function unique(items, key, label) {
  const values = items.map(item => item[key]);
  requireThat(new Set(values).size === values.length, `${label}: duplicate ${key}`);
  return new Set(values);
}

export function validateRelationships(data) {
  unique(data.projects, 'id', 'Projects'); unique(data.projects, 'slug', 'Projects');
  const labels = { systems: new Map(), technologies: new Map() };
  for (const project of data.projects) {
    const prefix = `Project ${project.id}`;
    const evidenceIds = unique(project.evidence, 'id', prefix + ' evidence');
    const technologyIds = unique(project.technologies, 'id', prefix + ' technologies');
    unique(project.systems, 'id', prefix + ' systems');
    unique(project.implementations, 'id', prefix + ' implementations');
    unique(project.results, 'id', prefix + ' results');
    const nodeIds = unique(project.architecture.nodes, 'id', prefix + ' architecture');
    for (const field of ['systems', 'technologies']) {
      for (const item of project[field]) {
        requireThat(!labels[field].has(item.id) || labels[field].get(item.id) === item.label, `${prefix}: conflicting ${field} label`);
        labels[field].set(item.id, item.label);
      }
    }
    const references = [...Object.values(project.sections), ...project.implementations, ...project.results];
    for (const item of references) for (const id of item.evidenceIds) requireThat(evidenceIds.has(id), `${prefix}: unknown evidence ${id}`);
    for (const item of project.implementations) for (const id of item.technologyIds) requireThat(technologyIds.has(id), `${prefix}: unknown technology ${id}`);
    for (const edge of project.architecture.edges) requireThat(nodeIds.has(edge.from) && nodeIds.has(edge.to), `${prefix}: unknown architecture endpoint`);
    for (const item of project.evidence) {
      requireThat(safeEvidenceSource(item.src), `${prefix}: unsafe evidence source`);
      if (item.type === 'image') requireThat(Boolean(item.alt.trim()), `${prefix}: image requires alternative text`);
    }
  }
}

async function filesIn(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'dist'].includes(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await filesIn(target));
    else if (entry.isFile()) output.push(target);
  }
  return output;
}

async function checkLocalTarget(file, target) {
  if (!target || target.startsWith('#') || /^(https?:|mailto:)/u.test(target)) return;
  const clean = decodeURIComponent(target.split('#')[0].split('?')[0]);
  const resolved = path.resolve(path.dirname(file), clean);
  requireThat(resolved.startsWith(root), `Link escapes repository: ${target}`);
  try { await stat(resolved); } catch { throw new Error(`Broken link in ${path.relative(root, file)}: ${target}`); }
}

export async function validateRepository() {
  const files = await filesIn(root);
  const schema = JSON.parse(await readFile(path.join(root, 'schemas/portfolio.schema.json'), 'utf8'));
  const example = JSON.parse(await readFile(path.join(root, 'examples/portfolio.json'), 'utf8'));
  checkSchemaKeywords(schema); validateSchema(schema, example); validateRelationships(example);
  for (const project of example.projects) {
    for (const item of project.evidence) if (!item.src.startsWith('https://')) {
      await stat(path.join(root, 'examples', decodeURIComponent(item.src)));
    }
  }
  const sandbox = {};
  vm.runInNewContext(await readFile(path.join(root, 'prototype/data.js'), 'utf8'), sandbox, { timeout: 1000 });
  assert.deepEqual(JSON.parse(JSON.stringify(sandbox.PORTFOLIO_EXAMPLE)), example, 'Preview data must match the canonical fixture');
  let checkedLinks = 0;
  for (const file of files) {
    const relative = path.relative(root, file);
    if (/\.(zip|sql|log)$/iu.test(file) || path.basename(file) === 'wp-config.php') throw new Error(`Unexpected artifact: ${relative}`);
    if (/\.(png|jpe?g|webp)$/iu.test(file)) continue;
    const content = await readFile(file, 'utf8');
    const secretPatterns = [/https:\/\/hook\.eu\d*\.make\.com\/[A-Za-z0-9_-]{20,}/u, /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/u, /(?:ghp_|github_pat_)[A-Za-z0-9_]{25,}/u];
    for (const pattern of secretPatterns) requireThat(!pattern.test(content), `Potential secret in ${relative}`);
    if (file.endsWith('.md')) {
      for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/gu)) { await checkLocalTarget(file, match[1]); checkedLinks++; }
    }
    if (file.endsWith('.html')) {
      for (const match of content.matchAll(/(?:href|src)="([^"]+)"/gu)) { await checkLocalTarget(file, match[1]); checkedLinks++; }
    }
  }
  return { files: files.length, projects: example.projects.length, checkedLinks };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await validateRepository();
  console.log(`Concept checks passed: ${result.files} files, ${result.projects} fictional projects, ${result.checkedLinks} local/external link targets inspected (local existence checked).`);
}
