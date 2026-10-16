import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(file, dependencies = {}) {
 const output=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const context={exports:{},FormData,console,require:(name)=>{if(name in dependencies)return dependencies[name];throw Error('Unexpected dependency '+name);}};
 vm.runInNewContext(output,context);return context.exports;
}
const discovery=load('src/lib/blog-discovery.ts');
const enquiries=load('src/content/enquiries.ts');
const posts=[
 {slug:'current',tag:'SEO',tags:['Speed'],title:'Current',excerpt:'',date:'2026-10-10'},
 {slug:'seo',tag:'SEO',tags:[],title:'Search visibility',excerpt:'Technical checks',date:'2026-10-08'},
 {slug:'speed',tag:'Performance',tags:['Speed'],title:'Images and loading',excerpt:'Optimize delivery',date:'2026-10-12'},
 {slug:'other',tag:'Email',title:'Mail delivery',excerpt:'Contact forms',date:'2026-10-15'},
];
test('search combines query terms with selected topic, ignoring case',()=>{
 assert.equal(discovery.filterPosts(posts,'SEARCH checks','SEO')[0].slug,'seo');
 assert.equal(discovery.filterPosts(posts,'mail','SEO').length,0);
 assert.equal(discovery.filterPosts(posts,'   ','All topics').length,4);
});
test('related posts prioritize topic overlap and exclude current article',()=>{
 const result=discovery.relatedPosts(posts[0],posts);
 assert.deepEqual(Array.from(result,p=>p.slug),['seo','speed','other']);
 assert.equal(discovery.relatedPosts(posts[0],[posts[0]]).length,0);
});
function action(env) {return load('src/app/actions.ts',{'@/content/enquiries':enquiries,'@opennextjs/cloudflare':{getCloudflareContext:()=>({env})}}).submitContact;}
function form(service='seo-search-performance') {const f=new FormData();for(const [k,v]of Object.entries({name:'Test Person',email:'test@example.com',message:'Please review our website search visibility.',service,details:'https://example.com',budget:'Not sure yet'}))f.set(k,v);return f;}
test('rejects unknown service and preserves submitted fields',async()=>{
 const result=await action({})({},form('unknown'));
 assert.equal(result.status,'error');assert.ok(result.errors.service);assert.equal(result.values.details,'https://example.com');
});
test('selected service and context reach the delivery worker',async()=>{
 let payload;
 const result=await action({CONTACT_INTERNAL_KEY:'test-key',WORKER_SELF_REFERENCE:{fetch:async(_url,options)=>{payload=JSON.parse(options.body);return {ok:true};}}})({},form());
 assert.equal(result.status,'success');assert.equal(payload.service,'SEO');assert.equal(payload.details,'https://example.com');
});
test('unconfigured delivery reports an error instead of false success',async()=>{
 const result=await action({})({},form());assert.equal(result.status,'error');assert.equal(result.values.service,'seo-search-performance');
});
test('all four services resolve and oversized context is rejected',async()=>{
 assert.equal(enquiries.ENQUIRY_SERVICES.length,4);
 for(const service of enquiries.ENQUIRY_SERVICES)assert.equal(enquiries.getEnquiryService(service.slug).label,service.label);
 const f=form();f.set('details','x'.repeat(501));const result=await action({})({},f);assert.ok(result.errors.details);
});
