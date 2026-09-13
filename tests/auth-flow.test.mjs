import test from 'node:test';
import assert from 'node:assert/strict';
import { safeAuthNext, authMessage } from '../src/lib/auth-flow.js';

test('auth callbacks allow only known internal destinations', () => {
  for (const path of ['/my-books','/orders','/account','/reset?mode=update','/books/amir-and-new-friends/personalize']) assert.equal(safeAuthNext(path), path);
  for (const path of [undefined, null, '//evil.example', 'https://evil.example', '/\\evil.example', '/my-books\r\nLocation: x', '/auth/callback', '/api/account', '/my-books?next=https://evil.example', '/books/../personalize']) assert.equal(safeAuthNext(path), '/my-books');
});
test('auth errors are localized and never echo provider text', () => {
  assert.match(authMessage('invalid_credentials'), /пароль/);
  assert.match(authMessage('email_not_confirmed', 'en'), /Confirm your email/);
  assert.equal(authMessage('<script>secret</script>'), authMessage('default'));
});
