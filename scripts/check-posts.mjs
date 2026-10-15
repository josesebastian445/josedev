import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import assert from 'node:assert/strict';
const source = fs.readFileSync('src/content/additional-posts.ts','utf8');
const compiled = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const context = {exports:{}}; vm.runInNewContext(compiled,context);
const posts = context.exports.ADDITIONAL_POSTS;
assert.equal(posts.length,10);
assert.equal(new Set(posts.map(p=>p.slug)).size,10);
for(const post of posts) {
  const words = post.body.flatMap(b=>b.text ? [b.text] : b.items || []).join(' ').split(/\s+/).length;
  assert.ok(words>=250,`${post.slug}: article too short (${words})`);
}
const base = 'http://localhost:3222';
const listing = await fetch(base+'/blog').then(r=>r.text());
const sitemap = await fetch(base+'/sitemap.xml').then(r=>r.text());
for(const post of posts) {
  const route = '/blog/'+post.slug;
  assert.ok(listing.includes(route),`Missing index link: ${route}`);
  assert.ok(sitemap.includes(route),`Missing sitemap entry: ${route}`);
}
for(const post of posts) {
  const response = await fetch(base+'/blog/'+post.slug);
  assert.equal(response.status,200,post.slug);
  const html = await response.text();
  assert.ok(html.includes(post.title),`Missing article title: ${post.slug}`);
}
console.log('Verified 10 complete articles: unique slugs, 250+ words each, blog links, sitemap entries, and successful article routes.');
