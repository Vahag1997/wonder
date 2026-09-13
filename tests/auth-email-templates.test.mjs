import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Russian auth emails retain the provider-generated confirmation URL', () => {
  for (const name of ['confirm-sign-up', 'reset-password']) {
    const html = readFileSync(new URL(`../supabase/templates/${name}.html`, import.meta.url), 'utf8');
    assert.deepEqual([...html.matchAll(/href="([^"]*)"/g)].map(m => m[1]), ['{{ .ConfirmationURL }}']);
    assert.match(html, /в том же браузере/);
    assert.ok(!/script|iframe|TokenHash|\.Token\s|\.Data\s/i.test(html));
  }
});
