// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateSchema, validateRelationships, safeEvidenceSource, checkSchemaKeywords } from './validate.mjs';

const schema = JSON.parse(await readFile(new URL('../schemas/portfolio.schema.json', import.meta.url), 'utf8'));
const example = JSON.parse(await readFile(new URL('../examples/portfolio.json', import.meta.url), 'utf8'));
const fresh = () => structuredClone(example);

test('public contract rejects unlisted private fields and unsupported versions', () => {
  const data = fresh(); data.projects[0].internalNotes = 'Private';
  assert.throws(() => validateSchema(schema, data), /unexpected field/);
  const version = fresh(); version.schemaVersion = '9.0.0';
  assert.throws(() => validateSchema(schema, version), /unsupported value/);
});

test('cross-project and internal references cannot silently drift', () => {
  const evidence = fresh(); evidence.projects[0].implementations[0].evidenceIds = ['missing'];
  assert.throws(() => validateRelationships(evidence), /unknown evidence/);
  const technology = fresh(); technology.projects[0].implementations[0].technologyIds = ['missing'];
  assert.throws(() => validateRelationships(technology), /unknown technology/);
  const graph = fresh(); graph.projects[0].architecture.edges[0].to = 'missing';
  assert.throws(() => validateRelationships(graph), /unknown architecture endpoint/);
});

test('duplicate public routes and IDs fail', () => {
  const routes = fresh(); routes.projects[1].slug = routes.projects[0].slug;
  assert.throws(() => validateRelationships(routes), /duplicate slug/);
  const ids = fresh(); ids.projects[0].evidence.push(structuredClone(ids.projects[0].evidence[0]));
  assert.throws(() => validateRelationships(ids), /duplicate id/);
});

test('unsafe schemes, credentials, path traversal, and encoded bypasses fail', () => {
  const rejected = ['javascript:alert(1)', 'data:text/html,hello', 'file:///private/file', '//example.invalid/a', '/etc/passwd', '../private.png', 'media/../private.png', 'media/%2e%2e/private.png', 'media/%252e%252e/private.png', 'media/%2Fprivate.png', 'media/%00x.png', 'media\\private.png', 'media/%ZZ.png', 'https://user:password@example.invalid/a', 'https://example.invalid/../private'];
  rejected.forEach(value => assert.equal(safeEvidenceSource(value), false, `Should reject ${value}`));
  ['media/workflow.svg', 'media/image-01.png', 'https://example.invalid/approved'].forEach(value => assert.equal(safeEvidenceSource(value), true));
});

test('image evidence needs useful alternative text', () => {
  const data = fresh(); data.projects[0].evidence[0].alt = ' ';
  assert.throws(() => validateRelationships(data), /alternative text/);
});

test('unsupported validation keywords fail instead of being ignored', () => {
  assert.throws(() => checkSchemaKeywords({ type: 'string', format: 'uri' }), /Unsupported schema keyword/);
});
