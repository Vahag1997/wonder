// Read-only smoke checks. No signup, email, upload, generation, or payment calls.
// node --env-file=.env.local scripts/test-supabase-connection.mjs
import assert from 'node:assert/strict';
const request = (url, options = {}) => fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
const origin = process.env.WONDER_TEST_URL || 'http://localhost:3000';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
assert.ok(url && key, 'Supabase public connection settings are required');
const headers = { apikey: key };
const response = await request(`${url}/rest/v1/products?select=slug,pages,checkout_enabled&slug=eq.amir-and-new-friends`, { headers });
assert.equal(response.status, 200);
assert.deepEqual(await response.json(), [{ slug: 'amir-and-new-friends', pages: 19, checkout_enabled: false }]);
console.log('PASS: Amir catalog entry is connected; checkout disabled');
for (const table of ['profiles', 'orders', 'my_books']) {
  const r = await request(`${url}/rest/v1/${table}?select=id`, { headers });
  assert.equal(r.status, 401, `anonymous ${table} access must be denied`);
  assert.equal((await r.json()).code, '42501');
}
console.log('PASS: anonymous callers cannot read customer tables');
const auth = await request(`${url}/auth/v1/settings`, { headers });
assert.equal(auth.status, 200);
const settings = await auth.json();
assert.equal(settings.external.email, true);
assert.equal(settings.mailer_autoconfirm, false);
console.log('PASS: email authentication enabled and email confirmation required');
for (const path of ['/api/account', '/api/library', '/api/library?kind=orders']) {
  const r = await request(origin + path);
  assert.equal(r.status, 401, path);
  assert.match(r.headers.get('cache-control'), /private.*no-store/);
  assert.deepEqual(await r.json(), { error: 'unauthorized' });
}
console.log('PASS: private website APIs require a verified session and are not cached');
const callback = await request(origin + '/auth/callback?next=https://untrusted.example', { redirect: 'manual' });
assert.equal(callback.status, 303);
assert.equal(callback.headers.get('location'), '/login?notice=link-error');
assert.equal(callback.headers.get('referrer-policy'), 'no-referrer');
const disabled = await request(origin + '/api/personalizations');
assert.equal(disabled.status, 503);
for (const path of ['/login', '/register', '/reset', '/my-books']) {
  const page = await request(origin + path);
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.ok(!html.includes('Аккаунты пока не подключены'));
  assert.ok(!html.includes('SUPABASE_SERVICE_ROLE_KEY'));
}
console.log('PASS: callback rejects invalid links; account screens connected; generation remains off');
