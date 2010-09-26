/**
 * Eco Compiler v1.1.0-pre
 * http://github.com/sstephenson/eco
 *
 * Copyright (c) 2010 Sam Stephenson
 * Released under the MIT License
 */
this.eco=function(j){return function g(h){var b,c={id:h,exports:{}};if(b=j[h]){b(c,g,c.exports);return c.exports}else throw"Cannot find module '"+h+"'";}}({eco:function(j,g){g("coffee-script");j.exports=g("eco/compiler")},"eco/compiler":function(j,g){(function(){var h,b,c,d,f;h=g("coffee-script");d=g("eco/util").indent;j.exports=c=function(a){(new Function("module",b(a)))(a={});return a.exports};c.preprocess=f=g("eco/preprocessor").preprocess;c.compile=b=function(a,e){var i,k;k=typeof(i=typeof e===
"undefined"||e===null?undefined:e.identifier)!=="undefined"&&i!==null?i:"module.exports";k.match(/\./)||(k="var "+k);i=h.compile(f(a),{noWrap:true});return""+k+" = function(__obj) {\n  if (!__obj) __obj = {};\n  var __out = [], __capture = function(callback) {\n    var out = __out, result;\n    __out = [];\n    callback.call(this);\n    result = __out.join('');\n    __out = out;\n    return __safe(result);\n  }, __sanitize = function(value) {\n    if (value && value.ecoSafe) {\n      return value;\n    } else if (typeof value !== 'undefined' && value != null) {\n      return __escape(value);\n    } else {\n      return '';\n    }\n  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;\n  __safe = __obj.safe = function(value) {\n    if (value && value.ecoSafe) {\n      return value;\n    } else {\n      if (!(typeof value !== 'undefined' && value != null)) value = '';\n      var result = new String(value);\n      result.ecoSafe = true;\n      return result;\n    }\n  };\n  if (!__escape) {\n    __escape = __obj.escape = function(value) {\n      return ('' + value)\n        .replace(/&/g, '&amp;')\n        .replace(/</g, '&lt;')\n        .replace(/>/g, '&gt;')\n        .replace(/\"/g, '&quot;');\n    };\n  }\n  (function() {\n"+
d(i,4)+"\n  }).call(__obj);\n  __obj.safe = __objSafe, __obj.escape = __escape;\n  return __out.join('');\n};"};c.render=function(a,e){return c(a)(e)};if(g.extensions)g.extensions[".eco"]=function(a,e){var i;i=g("fs").readFileSync(e,"utf-8");return a._compile(b(i),e)};else g.registerExtension&&g.registerExtension(".eco",b)}).call(this)},"eco/preprocessor":function(j,g,h){(function(){var b,c,d,f=function(a,e){return function(){return a.apply(e,arguments)}};c=g("eco/scanner").Scanner;d=g("eco/util");
h.preprocess=function(a){return(new b(a)).preprocess()};h.Preprocessor=function(){b=function(a){this.scanner=new c(a);this.output="";this.level=0;this.options={};this.captures=[];return this};b.prototype.preprocess=function(){for(;!this.scanner.done;)this.scanner.scan(f(function(a){return this[a[0]].apply(this,a.slice(1))},this));return this.output};b.prototype.record=function(a){this.output+=d.repeat("  ",this.level);return this.output+=a+"\n"};b.prototype.printString=function(a){return a.length?
this.record("__out.push "+d.inspectString(a)):null};b.prototype.beginCode=function(a){return this.options=a};b.prototype.recordCode=function(a){return a!=="end"?this.options.print?this.options.safe?this.record("__out.push "+a):this.record("__out.push __sanitize "+a):this.record(a):null};b.prototype.indent=function(a){this.level++;if(a){this.record("__capture "+a);this.captures.unshift(this.level);return this.indent()}};b.prototype.dedent=function(){this.level--;this.level<0&&this.fail("unexpected dedent");
if(this.captures[0]===this.level){this.captures.shift();return this.dedent()}};b.prototype.fail=function(a){throw"Parse error on line "+this.scanner.lineNo+": "+a;};return b}()}).call(this)},"eco/scanner":function(j,g,h){(function(){var b,c,d,f;d=g("strscan");c=d.StringScanner;d=g("eco/util");f=d.trim;h.scan=function(a){var e;e=[];for(a=new b(a);!a.done;)a.scan(function(i){return e.push(i)});return e};h.Scanner=function(){b=function(a){this.source=a.replace(/\r\n?/g,"\n");this.scanner=new c(this.source);
this.mode="data";this.buffer="";this.lineNo=1;this.done=false;return this};b.modePatterns={data:/(.*?)(<%(([=-])?)|\n|$)/,code:/(.*?)(((:|(->|=>))\s*)?%>|\n|$)/};b.dedentablePattern=/^(end|when|else|catch|finally)(?:\W|$)/;b.prototype.scan=function(a){if(this.done)return a();else if(this.scanner.hasTerminated()){this.done=true;switch(this.mode){case "data":return a(["printString",this.flush()]);case "code":return a(["fail","unexpected end of template"])}}else{this.advance();switch(this.mode){case "data":return this.scanData(a);
case "code":return this.scanCode(a)}}};b.prototype.advance=function(){this.scanner.scanUntil(b.modePatterns[this.mode]);this.buffer+=this.scanner.getCapture(0);this.tail=this.scanner.getCapture(1);this.directive=this.scanner.getCapture(3);return this.arrow=this.scanner.getCapture(4)};b.prototype.scanData=function(a){var e;if(this.tail==="\n"){this.buffer+=this.tail;this.lineNo++;return this.scan(a)}else if(this.tail){this.mode="code";a(["printString",this.flush()]);return a(["beginCode",{print:typeof(e=
this.directive)!=="undefined"&&e!==null,safe:this.directive==="-"}])}};b.prototype.scanCode=function(a){var e;if(this.tail==="\n")return a(["fail","unexpected newline in code block"]);else if(this.tail){this.mode="data";e=f(this.flush());if(this.arrow)e+=" "+this.arrow;this.isDedentable(e)&&a(["dedent"]);a(["recordCode",e]);if(this.directive)return a(["indent",this.arrow])}};b.prototype.flush=function(){var a;a=this.buffer;this.buffer="";return a};b.prototype.isDedentable=function(a){return a.match(b.dedentablePattern)};
return b}.call(this)}).call(this)},"eco/util":function(j,g,h){(function(){var b,c;h.repeat=b=function(d,f){return Array(f+1).join(d)};h.indent=function(d,f){var a,e,i,k,l,m;m=b(" ",f);k=[];i=d.split("\n");a=0;for(e=i.length;a<e;a++){l=i[a];k.push(m+l)}return k.join("\n")};h.trim=function(d){return d.replace(/^\s+/,"").replace(/\s+$/,"")};c={"\\":"\\\\","\u0008":"\\b","\u000c":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};h.inspectString=function(d){return"'"+d.replace(/[\x00-\x1f\\]/g,function(f){if(f in
c)return c[f];else{f=f.charCodeAt(0).toString(16);if(f.length===1)f="0"+f;return"\\u00"+f}}).replace(/'/g,"\\'")+"'"}}).call(this)},strscan:function(j,g,h){(function(){var b;(typeof h!=="undefined"&&h!==null?h:this).StringScanner=function(){b=function(c){this.source=c.toString();this.reset();return this};b.prototype.scan=function(c){var d;return(d=c.exec(this.getRemainder()))&&d.index===0?this.setState(d,{head:this.head+d[0].length,last:this.head}):this.setState([])};b.prototype.scanUntil=function(c){if(c=
c.exec(this.getRemainder())){this.setState(c,{head:this.head+c.index+c[0].length,last:this.head});return this.source.slice(this.last,this.head)}else return this.setState([])};b.prototype.scanChar=function(){return this.scan(/./)};b.prototype.skip=function(c){if(this.scan(c))return this.match.length};b.prototype.skipUntil=function(c){if(this.scanUntil(c))return this.head-this.last};b.prototype.check=function(c){var d;return(d=c.exec(this.getRemainder()))&&d.index===0?this.setState(d):this.setState([])};
b.prototype.checkUntil=function(c){if(c=c.exec(this.getRemainder())){this.setState(c);return this.source.slice(this.head,this.head+c.index+c[0].length)}else return this.setState([])};b.prototype.peek=function(c){return this.source.substr(this.head,typeof c!=="undefined"&&c!==null?c:1)};b.prototype.getSource=function(){return this.source};b.prototype.getRemainder=function(){return this.source.slice(this.head)};b.prototype.getPosition=function(){return this.head};b.prototype.hasTerminated=function(){return this.head===
this.source.length};b.prototype.getPreMatch=function(){if(this.match)return this.source.slice(0,this.head-this.match.length)};b.prototype.getMatch=function(){return this.match};b.prototype.getPostMatch=function(){if(this.match)return this.source.slice(this.head)};b.prototype.getCapture=function(c){return this.captures[c]};b.prototype.reset=function(){return this.setState([],{head:0,last:0})};b.prototype.terminate=function(){return this.setState([],{head:this.source.length,last:this.head})};b.prototype.concat=
function(c){return this.source+=c};b.prototype.unscan=function(){if(this.match)return this.setState([],{head:this.last,last:0});else throw"nothing to unscan";};b.prototype.setState=function(c,d){var f,a;this.head=typeof(f=typeof d==="undefined"||d===null?undefined:d.head)!=="undefined"&&f!==null?f:this.head;this.last=typeof(a=typeof d==="undefined"||d===null?undefined:d.last)!=="undefined"&&a!==null?a:this.last;this.captures=c.slice(1);return this.match=c[0]};return b}()})()},"coffee-script":function(j){if(typeof CoffeeScript!==
"undefined"&&CoffeeScript!=null)j.exports=CoffeeScript;else throw"Cannot require '"+j.id+"': CoffeeScript not found";}})("eco");