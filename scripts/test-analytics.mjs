import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function evaluate(file,context){vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,context);return context.exports;}
const enquiries=evaluate('src/content/enquiries.ts',{exports:{}});
function setup(production=true){const sent=[],diagnostics=[];const window={location:{pathname:'/contact',search:'?email=private@example.com'},dispatchEvent:e=>diagnostics.push(e.detail),gtag:(...args)=>sent.push(args)};const context={exports:{},window,CustomEvent:class{constructor(type,init){this.type=type;this.detail=init.detail;}},process:{env:{NODE_ENV:production?'production':'development'}},require:()=>enquiries};return{...evaluate('src/lib/analytics.ts',context),window,sent,diagnostics};}
test('production funnel payload excludes form text and query strings',()=>{const a=setup();a.trackEvent('enquiry_submit',{service:'seo-search-performance',email:'private@example.com',message:'secret',details:'private',outcome:'delivery'});const [command,event,payload]=a.sent[0];assert.equal(command,'event');assert.equal(event,'enquiry_submit');assert.equal(payload.service,'seo-search-performance');assert.equal(payload.page_path,'/contact');assert.ok(!JSON.stringify(payload).includes('private'));assert.equal(payload.send_to,'G-GBS2K2FYSS');});
test('unknown service and arbitrary metadata are dropped',()=>{const a=setup();a.trackEvent('contact_view',{service:'not-a-service',outcome:'arbitrary',method:'other'});assert.equal(a.sent[0][2].service,undefined);assert.equal(a.sent[0][2].outcome,undefined);assert.equal(a.sent[0][2].method,undefined);});
test('development has local diagnostics but no Google event',()=>{const a=setup(false);a.trackEvent('enquiry_start');assert.equal(a.sent.length,0);assert.equal(a.diagnostics.length,1);});
test('events queue when the Google loader is not yet ready',()=>{const a=setup();delete a.window.gtag;a.trackEvent('generate_lead',{service:'web-design-development'});assert.equal(a.window.dataLayer[0][1],'generate_lead');});
