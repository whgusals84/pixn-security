var e,t;e=this,t=function(){"use strict";function e(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function t(t){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?e(Object(r),!0).forEach((function(e){o(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):e(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function n(e){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,s(r.key),r)}}function i(e,t,n){return t&&u(e.prototype,t),n&&u(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function o(e,t,n){return(t=s(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){return function(e){if(Array.isArray(e))return c(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(e){if("string"==typeof e)return c(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?c(e,t):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function c(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function s(e){var t=function(e,t){if("object"!=typeof e||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:String(t)}function h(e){return Array.isArray?Array.isArray(e):"[object Array]"===p(e)}var l=1/0;function f(e){return null==e?"":function(e){if("string"==typeof e)return e;var t=e+"";return"0"==t&&1/e==-l?"-0":t}(e)}function d(e){return"string"==typeof e}function v(e){return"number"==typeof e}function g(e){return!0===e||!1===e||function(e){return function(e){return"object"===n(e)}(e)&&null!==e}(e)&&"[object Boolean]"==p(e)}function A(e){return null!=e}function y(e){return!e.trim().length}function p(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":Object.prototype.toString.call(e)}var m=function(e){return"Missing ".concat(e," property in key")},C=function(e){return"Property 'weight' in key '".concat(e,"' must be a positive integer")},F=Object.prototype.hasOwnProperty,E=function(){function e(t){var n=this;r(this,e),this._keys=[],this._keyMap={};var u=0;t.forEach((function(e){var t=B(e);n._keys.push(t),n._keyMap[t.id]=t,u+=t.weight})),this._keys.forEach((function(e){e.weight/=u}))}return i(e,[{key:"get",value:function(e){return this._keyMap[e]}},{key:"keys",value:function(){return this._keys}},{key:"toJSON",value:function(){return JSON.stringify(this._keys)}}]),e}();function B(e){var t=null,n=null,r=null,u=1,i=null;if(d(e)||h(e))r=e,t=D(e),n=b(e);else{if(!F.call(e,"name"))throw new Error(m("name"));var o=e.name;if(r=o,F.call(e,"weight")&&(u=e.weight)<=0)throw new Error(C(o));t=D(o),n=b(o),i=e.getFn}return{path:t,id:n,weight:u,src:r,getFn:i}}function D(e){return h(e)?e:e.split(".")}function b(e){return h(e)?e.join("."):e}var k={useExtendedSearch:!1,getFn:function(e,t){var n=[],r=!1;return function e(t,u,i){if(A(t))if(u[i]){var o=t[u[i]];if(!A(o))return;if(i===u.length-1&&(d(o)||v(o)||g(o)))n.push(f(o));else if(h(o)){r=!0;for(var a=0,c=o.length;a<c;a+=1)e(o[a],u,i+1)}else u.length&&e(o,u,i+1)}else n.push(t)}(e,d(t)?t.split("."):t,0),r?n:n[0]},ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1},M=t(t(t(t({},{isCaseSensitive:!1,ignoreDiacritics:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:function(e,t){return e.score===t.score?e.idx<t.idx?-1:1:e.score<t.score?-1:1}}),{includeMatches:!1,findAllMatches:!1,minMatchCharLength:1}),{location:0,threshold:.6,distance:100}),k),w=/[^ ]+/g,x=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=t.getFn,u=void 0===n?M.getFn:n,i=t.fieldNormWeight,o=void 0===i?M.fieldNormWeight:i;r(this,e),this.norm=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3,n=new Map,r=Math.pow(10,t);return{get:function(t){var u=t.match(w).length;if(n.has(u))return n.get(u);var i=1/Math.pow(u,.5*e),o=parseFloat(Math.round(i*r)/r);return n.set(u,o),o},clear:function(){n.clear()}}}(o,3),this.getFn=u,this.isCreated=!1,this.setIndexRecords()}return i(e,[{key:"setSources",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];this.docs=e}},{key:"setIndexRecords",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];this.records=e}},{key:"setKeys",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];this.keys=t,this._keysMap={},t.forEach((function(t,n){e._keysMap[t.id]=n}))}},{key:"create",value:function(){var e=this;!this.isCreated&&this.docs.length&&(this.isCreated=!0,d(this.docs[0])?this.docs.forEach((function(t,n){e._addString(t,n)})):this.docs.forEach((function(t,n){e._addObject(t,n)})),this.norm.clear())}},{key:"add",value:function(e){var t=this.size();d(e)?this._addString(e,t):this._addObject(e,t)}},{key:"removeAt",value:function(e){this.records.splice(e,1);for(var t=e,n=this.size();t<n;t+=1)this.records[t].i-=1}},{key:"getValueForItemAtKeyId",value:function(e,t){return e[this._keysMap[t]]}},{key:"size",value:function(){return this.records.length}},{key:"_addString",value:function(e,t){if(A(e)&&!y(e)){var n={v:e,i:t,n:this.norm.get(e)};this.records.push(n)}}},{key:"_addObject",value:function(e,t){var n=this,r={i:t,$:{}};this.keys.forEach((function(t,u){var i=t.getFn?t.getFn(e):n.getFn(e,t.path);if(A(i))if(h(i)){for(var o=[],a=[{nestedArrIndex:-1,value:i}];a.length;){var c=a.pop(),s=c.nestedArrIndex,l=c.value;if(A(l))if(d(l)&&!y(l)){var f={v:l,i:s,n:n.norm.get(l)};o.push(f)}else h(l)&&l.forEach((function(e,t){a.push({nestedArrIndex:t,value:e})}))}r.$[u]=o}else if(d(i)&&!y(i)){var v={v:i,n:n.norm.get(i)};r.$[u]=v}})),this.records.push(r)}},{key:"toJSON",value:function(){return{keys:this.keys,records:this.records}}}]),e}();function L(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=n.getFn,u=void 0===r?M.getFn:r,i=n.fieldNormWeight,o=void 0===i?M.fieldNormWeight:i,a=new x({getFn:u,fieldNormWeight:o});return a.setKeys(e.map(B)),a.setSources(t),a.create(),a}function S(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.errors,r=void 0===n?0:n,u=t.currentLocation,i=void 0===u?0:u,o=t.expectedLocation,a=void 0===o?0:o,c=t.distance,s=void 0===c?M.distance:c,h=t.ignoreLocation,l=void 0===h?M.ignoreLocation:h,f=r/e.length;if(l)return f;var d=Math.abs(a-i);return s?f+d/s:d?1:f}var _=32;function O(e,t,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},u=r.location,i=void 0===u?M.location:u,o=r.distance,a=void 0===o?M.distance:o,c=r.threshold,s=void 0===c?M.threshold:c,h=r.findAllMatches,l=void 0===h?M.findAllMatches:h,f=r.minMatchCharLength,d=void 0===f?M.minMatchCharLength:f,v=r.includeMatches,g=void 0===v?M.includeMatches:v,A=r.ignoreLocation,y=void 0===A?M.ignoreLocation:A;if(t.length>_)throw new Error("Pattern length exceeds max of ".concat(_,"."));for(var p,m=t.length,C=e.length,F=Math.max(0,Math.min(i,C)),E=s,B=F,D=d>1||g,b=D?Array(C):[];(p=e.indexOf(t,B))>-1;){var k=S(t,{currentLocation:p,expectedLocation:F,distance:a,ignoreLocation:y});if(E=Math.min(k,E),B=p+m,D)for(var w=0;w<m;)b[p+w]=1,w+=1}B=-1;for(var x=[],L=1,O=m+C,j=1<<m-1,I=0;I<m;I+=1){for(var N=0,P=O;N<P;)S(t,{errors:I,currentLocation:F+P,expectedLocation:F,distance:a,ignoreLocation:y})<=E?N=P:O=P,P=Math.floor((O-N)/2+N);O=P;var W=Math.max(1,F-P+1),z=l?C:Math.min(F+P,C)+m,T=Array(z+2);T[z+1]=(1<<I)-1;for(var $=z;$>=W;$-=1){var K=$-1,J=n[e.charAt(K)];if(D&&(b[K]=+!!J),T[$]=(T[$+1]<<1|1)&J,I&&(T[$]|=(x[$+1]|x[$])<<1|1|x[$+1]),T[$]&j&&(L=S(t,{errors:I,currentLocation:K,expectedLocation:F,distance:a,ignoreLocation:y}))<=E){if(E=L,(B=K)<=F)break;W=Math.max(1,2*F-B)}}if(S(t,{errors:I+1,currentLocation:F,expectedLocation:F,distance:a,ignoreLocation:y})>E)break;x=T}var R={isMatch:B>=0,score:Math.max(.001,L)};if(D){var U=function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:M.minMatchCharLength,n=[],r=-1,u=-1,i=0,o=e.length;i<o;i+=1){var a=e[i];a&&-1===r?r=i:a||-1===r||((u=i-1)-r+1>=t&&n.push([r,u]),r=-1)}return e[i-1]&&i-r>=t&&n.push([r,i-1]),n}(b,d);U.length?g&&(R.indices=U):R.isMatch=!1}return R}function j(e){for(var t={},n=0,r=e.length;n<r;n+=1){var u=e.charAt(n);t[u]=(t[u]||0)|1<<r-n-1}return t}var I=String.prototype.normalize?function(e){return e.normalize("NFD").replace(/[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]/g,"")}:function(e){return e},N=function(){function e(t){var n=this,u=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=u.location,o=void 0===i?M.location:i,a=u.threshold,c=void 0===a?M.threshold:a,s=u.distance,h=void 0===s?M.distance:s,l=u.includeMatches,f=void 0===l?M.includeMatches:l,d=u.findAllMatches,v=void 0===d?M.findAllMatches:d,g=u.minMatchCharLength,A=void 0===g?M.minMatchCharLength:g,y=u.isCaseSensitive,p=void 0===y?M.isCaseSensitive:y,m=u.ignoreDiacritics,C=void 0===m?M.ignoreDiacritics:m,F=u.ignoreLocation,E=void 0===F?M.ignoreLocation:F;if(r(this,e),this.options={location:o,threshold:c,distance:h,includeMatches:f,findAllMatches:v,minMatchCharLength:A,isCaseSensitive:p,ignoreDiacritics:C,ignoreLocation:E},t=p?t:t.toLowerCase(),t=C?I(t):t,this.pattern=t,this.chunks=[],this.pattern.length){var B=function(e,t){n.chunks.push({pattern:e,alphabet:j(e),startIndex:t})},D=this.pattern.length;if(D>_){for(var b=0,k=D%_,w=D-k;b<w;)B(this.pattern.substr(b,_),b),b+=_;if(k){var x=D-_;B(this.pattern.substr(x),x)}}else B(this.pattern,0)}}return i(e,[{key:"searchIn",value:function(e){var t=this.options,n=t.isCaseSensitive,r=t.ignoreDiacritics,u=t.includeMatches;if(e=n?e:e.toLowerCase(),e=r?I(e):e,this.pattern===e){var i={isMatch:!0,score:0};return u&&(i.indices=[[0,e.length-1]]),i}var o=this.options,c=o.location,s=o.distance,h=o.threshold,l=o.findAllMatches,f=o.minMatchCharLength,d=o.ignoreLocation,v=[],g=0,A=!1;this.chunks.forEach((function(t){var n=t.pattern,r=t.alphabet,i=t.startIndex,o=O(e,n,r,{location:c+i,distance:s,threshold:h,findAllMatches:l,minMatchCharLength:f,includeMatches:u,ignoreLocation:d}),y=o.isMatch,p=o.score,m=o.indices;y&&(A=!0),g+=p,y&&m&&(v=[].concat(a(v),a(m)))}));var y={isMatch:A,score:A?g/this.chunks.length:1};return A&&u&&(y.indices=v),y}}]),e}(),P=[];function W(e,t){for(var n=0,r=P.length;n<r;n+=1){var u=P[n];if(u.condition(e,t))return new u(e,t)}return new N(e,t)}function z(e,t){var n=e.matches;t.matches=[],A(n)&&n.forEach((function(e){if(A(e.indices)&&e.indices.length){var n={indices:e.indices,value:e.value};e.key&&(n.key=e.key.src),e.idx>-1&&(n.refIndex=e.idx),t.matches.push(n)}}))}function T(e,t){t.score=e.score}var $=function(){function e(n){var u=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=arguments.length>2?arguments[2]:void 0;if(r(this,e),this.options=t(t({},M),u),this.options.useExtendedSearch)throw new Error("Extended search is not available");this._keyStore=new E(this.options.keys),this.setCollection(n,i)}return i(e,[{key:"setCollection",value:function(e,t){if(this._docs=e,t&&!(t instanceof x))throw new Error("Incorrect 'index' type");this._myIndex=t||L(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}},{key:"add",value:function(e){A(e)&&(this._docs.push(e),this._myIndex.add(e))}},{key:"remove",value:function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){return!1},t=[],n=0,r=this._docs.length;n<r;n+=1){var u=this._docs[n];e(u,n)&&(this.removeAt(n),n-=1,r-=1,t.push(u))}return t}},{key:"removeAt",value:function(e){this._docs.splice(e,1),this._myIndex.removeAt(e)}},{key:"getIndex",value:function(){return this._myIndex}},{key:"search",value:function(e){var t=(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).limit,n=void 0===t?-1:t,r=this.options,u=r.includeMatches,i=r.includeScore,o=r.shouldSort,a=r.sortFn,c=r.ignoreFieldNorm,s=d(e)?d(this._docs[0])?this._searchStringList(e):this._searchObjectList(e):this._searchLogical(e);return function(e,t){var n=t.ignoreFieldNorm,r=void 0===n?M.ignoreFieldNorm:n;e.forEach((function(e){var t=1;e.matches.forEach((function(e){var n=e.key,u=e.norm,i=e.score,o=n?n.weight:null;t*=Math.pow(0===i&&o?Number.EPSILON:i,(o||1)*(r?1:u))})),e.score=t}))}(s,{ignoreFieldNorm:c}),o&&s.sort(a),v(n)&&n>-1&&(s=s.slice(0,n)),function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=n.includeMatches,u=void 0===r?M.includeMatches:r,i=n.includeScore,o=void 0===i?M.includeScore:i,a=[];return u&&a.push(z),o&&a.push(T),e.map((function(e){var n=e.idx,r={item:t[n],refIndex:n};return a.length&&a.forEach((function(t){t(e,r)})),r}))}(s,this._docs,{includeMatches:u,includeScore:i})}},{key:"_searchStringList",value:function(e){var t=W(e,this.options),n=this._myIndex.records,r=[];return n.forEach((function(e){var n=e.v,u=e.i,i=e.n;if(A(n)){var o=t.searchIn(n),a=o.isMatch,c=o.score,s=o.indices;a&&r.push({item:n,idx:u,matches:[{score:c,value:n,norm:i,indices:s}]})}})),r}},{key:"_searchLogical",value:function(e){throw new Error("Logical search is not available")}},{key:"_searchObjectList",value:function(e){var t=this,n=W(e,this.options),r=this._myIndex,u=r.keys,i=r.records,o=[];return i.forEach((function(e){var r=e.$,i=e.i;if(A(r)){var c=[];u.forEach((function(e,u){c.push.apply(c,a(t._findMatches({key:e,value:r[u],searcher:n})))})),c.length&&o.push({idx:i,item:r,matches:c})}})),o}},{key:"_findMatches",value:function(e){var t=e.key,n=e.value,r=e.searcher;if(!A(n))return[];var u=[];if(h(n))n.forEach((function(e){var n=e.v,i=e.i,o=e.n;if(A(n)){var a=r.searchIn(n),c=a.isMatch,s=a.score,h=a.indices;c&&u.push({score:s,key:t,value:n,idx:i,norm:o,indices:h})}}));else{var i=n.v,o=n.n,a=r.searchIn(i),c=a.isMatch,s=a.score,l=a.indices;c&&u.push({score:s,key:t,value:i,norm:o,indices:l})}return u}}]),e}();return $.version="7.1.0",$.createIndex=L,$.parseIndex=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.getFn,r=void 0===n?M.getFn:n,u=t.fieldNormWeight,i=void 0===u?M.fieldNormWeight:u,o=e.keys,a=e.records,c=new x({getFn:r,fieldNormWeight:i});return c.setKeys(o),c.setIndexRecords(a),c},$.config=M,$},"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).Fuse=t();
(() => {
  const overlay = document.querySelector("[data-search-overlay]");
  if (!overlay) return;
  const input = overlay.querySelector("[data-search-input]");
  const resultsEl = overlay.querySelector("[data-search-results]");
  const statusEl = overlay.querySelector("[data-search-status]");
  const closeBtn = overlay.querySelector("[data-search-close]");
  const typeChips = overlay.querySelectorAll("[data-filter-type]");
  const langChips = overlay.querySelectorAll("[data-filter-lang]");
  const emptyMessage = overlay.dataset.searchEmpty || "Type to search.";
  const noResultsMessage = overlay.dataset.searchNoResults || "No results found.";
  const loadingMessage = overlay.dataset.searchLoading || "Loading index";
  const errorMessage = overlay.dataset.searchError || "Unable to load search.";
  const indexUrl = overlay.dataset.searchIndex || "/search_index.json";
  const CONTENT_CAP = 360;
  const MAX_RESULTS = 20;
  const MAX_BROWSE = 40;
  const TYPE_LABELS = {
    post: "Post",
    note: "Note",
    project: "Project",
    archive: "Archive",
    page: "Page",
  };
  let fuse = null;
  let docs = null;
  let tagVocab = null;
  let baseTypeCounts = null;
  let loadPromise = null;
  let searchTimeout;
  let selectedIndex = -1;
  const filters = { type: "all", lang: "all" };
  const preferredLang = window.location.pathname.startsWith("/ko/") ? "ko" : "en";
  const isOpen = () => overlay.classList.contains("is-open");
  const escapeHtml = (value = "") =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const escapeRegExp = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const setStatus = (message) => {
    if (!statusEl) return;
    statusEl.textContent = message || "";
  };
  const renderEmpty = (message) => {
    resultsEl.innerHTML = `<p class="search-empty">${escapeHtml(message || emptyMessage)}</p>`;
    selectedIndex = -1;
  };
  const typeOf = (section = "") => {
    if (section.startsWith("posts")) return "post";
    if (section.startsWith("notes")) return "note";
    if (section.startsWith("projects")) return "project";
    if (section.startsWith("archive")) return "archive";
    return "page";
  };
  const normalizeDoc = (raw) => {
    const lang = raw.lang || "en";
    let canonical = raw.url || "";
    if (lang !== "en" && canonical.startsWith(`/${lang}/`)) {
      canonical = canonical.slice(lang.length + 1);
    }
    return {
      title: raw.title || raw.url || "Untitled",
      description: raw.description || "",
      content: (raw.content || "").slice(0, CONTENT_CAP),
      tags: Array.isArray(raw.tags) ? raw.tags : [],
      tagsLower: (Array.isArray(raw.tags) ? raw.tags : []).map((t) => t.toLowerCase()),
      url: raw.url || "#",
      lang,
      type: typeOf(raw.section || ""),
      canonical,
    };
  };
  const ensureIndex = async () => {
    if (fuse) return fuse;
    if (loadPromise) return loadPromise;
    setStatus(loadingMessage);
    loadPromise = fetch(indexUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch search index");
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Invalid search index format");
        docs = data.map(normalizeDoc);
        tagVocab = new Set();
        docs.forEach((doc) => doc.tagsLower.forEach((tag) => tagVocab.add(tag)));
        fuse = new Fuse(docs, {
          keys: [
            { name: "title", weight: 0.45 },
            { name: "tags", weight: 0.2 },
            { name: "content", weight: 0.2 },
            { name: "description", weight: 0.15 },
          ],
          includeScore: true,
          ignoreLocation: true,
          threshold: 0.3,
        });
        setStatus(`${docs.length.toLocaleString()} documents indexed`);
        return fuse;
      })
      .catch((err) => {
        console.error("Search index load failed", err);
        loadPromise = null;
        setStatus(errorMessage);
        throw err;
      });
    return loadPromise;
  };
  const parseQuery = (query) => {
    const tags = [];
    let pendingTag = null;
    const words = [];
    query.trim().split(/\s+/).forEach((token) => {
      if (!token) return;
      if (token.startsWith("#")) {
        const tag = token.slice(1).toLowerCase();
        if (tag) {
          tags.push(tag);
          pendingTag = tag;
        } else {
          pendingTag = "";
        }
        return;
      }
      words.push(token);
    });
    const endsWithTag = /(^|\s)#[^\s]*$/.test(query);
    return {
      text: words.join(" "),
      tags,
      tagPrefix: endsWithTag ? (pendingTag === null ? "" : pendingTag) : null,
    };
  };
  const matchesFilters = (doc, tags, ignoreType = false) => {
    if (!ignoreType && filters.type !== "all" && doc.type !== filters.type) return false;
    if (filters.lang !== "all" && doc.lang !== filters.lang) return false;
    if (tags.length) {
      if (!tags.every((tag) => doc.tagsLower.some((t) => t.includes(tag)))) return false;
    }
    return true;
  };
  const groupByCanonical = (entries) => {
    if (filters.lang !== "all") return entries;
    const groups = new Map();
    entries.forEach((entry) => {
      const key = entry.doc.canonical;
      const existing = groups.get(key);
      if (!existing) {
        groups.set(key, { ...entry, langs: [entry.doc.lang] });
        return;
      }
      if (!existing.langs.includes(entry.doc.lang)) existing.langs.push(entry.doc.lang);
      const better = entry.score < existing.score;
      const preferred = entry.doc.lang === preferredLang && existing.doc.lang !== preferredLang;
      if (preferred || (better && existing.doc.lang !== preferredLang)) {
        existing.doc = entry.doc;
        existing.score = Math.min(existing.score, entry.score);
      }
    });
    return Array.from(groups.values());
  };
  const countByType = (entries) => {
    const counts = { all: 0, post: 0, note: 0, project: 0, archive: 0, page: 0 };
    entries.forEach(({ doc }) => {
      counts.all += 1;
      if (counts[doc.type] !== undefined) counts[doc.type] += 1;
    });
    return counts;
  };
  const updateChipCounts = (counts) => {
    typeChips.forEach((chip) => {
      const badge = chip.querySelector("[data-chip-count]");
      if (!badge) return;
      const value = counts ? counts[chip.dataset.filterType] : null;
      badge.textContent = value == null ? "" : value.toLocaleString();
    });
  };
  const countDocsForTag = (tag) =>
    groupByCanonical(
      docs.filter((doc) => matchesFilters(doc, [tag], true)).map((doc) => ({ doc, score: 1 }))
    ).length;
  const buildSnippet = (doc, terms) => {
    const source = (doc.content || doc.description || "").replace(/\s+/g, " ").trim();
    if (!source) return "";
    let start = 0;
    if (terms.length) {
      const lower = source.toLowerCase();
      for (const term of terms) {
        const idx = lower.indexOf(term.toLowerCase());
        if (idx !== -1) {
          start = Math.max(0, idx - 40);
          break;
        }
      }
    }
    const raw = source.slice(start, start + 170);
    let snippet = escapeHtml(`${start > 0 ? "…" : ""}${raw}${start + 170 < source.length ? "…" : ""}`);
    terms.forEach((term) => {
      if (term.length < 2) return;
      snippet = snippet.replace(
        new RegExp(escapeRegExp(escapeHtml(term)), "gi"),
        (m) => `<mark class="search-mark">${m}</mark>`
      );
    });
    return snippet;
  };
  const renderRows = (entries, terms) => {
    const html = entries
      .map(({ doc, langs }) => {
        const availableLangs = langs && langs.length > 1 ? langs.slice().sort() : null;
        const langBadges = availableLangs
          ? availableLangs
              .map(
                (l) =>
                  `<em class="${l === doc.lang ? "is-active" : ""}">${escapeHtml(l.toUpperCase())}</em>`
              )
              .join("")
          : `<em class="is-active">${escapeHtml(doc.lang.toUpperCase())}</em>`;
        const tags = doc.tags
          .slice(0, 3)
          .map((t) => `<span class="search-result-tag">#${escapeHtml(t)}</span>`)
          .join("");
        return `
          <a class="search-result" href="${escapeHtml(doc.url)}">
            <span class="search-result-meta">
              <span class="search-result-type">${TYPE_LABELS[doc.type]}</span>
              <span class="search-result-path">${escapeHtml(doc.canonical)}</span>
              <span class="search-result-langs">${langBadges}</span>
            </span>
            <h3 class="search-result-title">${escapeHtml(doc.title)}</h3>
            <p class="search-result-snippet">${buildSnippet(doc, terms)}</p>
            ${tags ? `<span class="search-result-tags">${tags}</span>` : ""}
          </a>
        `;
      })
      .join("");
    resultsEl.innerHTML = html;
    selectedIndex = -1;
  };
  const renderTagSuggestions = (prefix) => {
    const matches = Array.from(tagVocab)
      .filter((tag) => tag.startsWith(prefix))
      .map((tag) => [tag, countDocsForTag(tag)])
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 12);
    if (!matches.length) {
      renderEmpty(`No tags matching “#${prefix}”.`);
      return;
    }
    const html = matches
      .map(
        ([tag, count]) => `
          <button type="button" class="search-result search-result--tag" data-suggest-tag="${escapeHtml(tag)}">
            <span class="search-result-meta">
              <span class="search-result-type">Tag</span>
              <span class="search-result-path">${count} document${count === 1 ? "" : "s"}</span>
            </span>
            <h3 class="search-result-title">#${escapeHtml(tag)}</h3>
          </button>
        `
      )
      .join("");
    resultsEl.innerHTML = html;
    selectedIndex = -1;
    setStatus(`${matches.length} matching tags`);
  };
  const applyTagSuggestion = (tag) => {
    if (!input) return;
    input.value = input.value.replace(/(^|\s)#[^\s]*$/, `$1#${tag} `);
    input.focus();
    runSearch(input.value);
  };
  const runSearch = async (query) => {
    const { text, tags, tagPrefix } = parseQuery(query);
    if (!text && !tags.length && tagPrefix === null && filters.type === "all" && filters.lang === "all") {
      renderEmpty(emptyMessage);
      setStatus(docs ? `${docs.length.toLocaleString()} documents indexed` : "");
      if (docs) {
        baseTypeCounts =
          baseTypeCounts || countByType(groupByCanonical(docs.map((doc) => ({ doc, score: 1 }))));
        updateChipCounts(baseTypeCounts);
      }
      return;
    }
    try {
      await ensureIndex();
    } catch (err) {
      renderEmpty(errorMessage);
      updateChipCounts(null);
      return;
    }
    if (tagPrefix !== null && !text) {
      renderTagSuggestions(tagPrefix);
      return;
    }
    let scoped;
    if (text) {
      scoped = fuse
        .search(text)
        .map((hit) => ({ doc: hit.item, score: hit.score ?? 1 }))
        .filter((entry) => matchesFilters(entry.doc, tags, true));
    } else {
      scoped = docs
        .filter((doc) => matchesFilters(doc, tags, true))
        .map((doc) => ({ doc, score: 1 }))
        .sort((a, b) => a.doc.title.localeCompare(b.doc.title));
    }
    const scopedGrouped = groupByCanonical(scoped);
    updateChipCounts(countByType(scopedGrouped));
    const grouped =
      filters.type === "all"
        ? scopedGrouped
        : scopedGrouped.filter((entry) => entry.doc.type === filters.type);
    const capped = grouped.slice(0, text ? MAX_RESULTS : MAX_BROWSE);
    const scopeBits = [];
    if (filters.type !== "all") scopeBits.push(TYPE_LABELS[filters.type].toLowerCase());
    if (filters.lang !== "all") scopeBits.push(filters.lang.toUpperCase());
    tags.forEach((tag) => scopeBits.push(`#${tag}`));
    const scope = scopeBits.length ? ` · ${scopeBits.join(" · ")}` : "";
    if (!grouped.length) {
      renderEmpty(noResultsMessage);
      setStatus(`0 results${scope}`);
      return;
    }
    setStatus(
      `${grouped.length.toLocaleString()} result${grouped.length === 1 ? "" : "s"}${
        grouped.length > capped.length ? `, showing ${capped.length}` : ""
      }${scope}`
    );
    renderRows(capped, text ? text.split(/\s+/).filter(Boolean) : tags);
  };
  const refresh = () => runSearch(input ? input.value : "");
  const updateSelectedResult = () => {
    const results = resultsEl.querySelectorAll(".search-result");
    results.forEach((result, index) => {
      result.classList.toggle("is-selected", index === selectedIndex);
    });
    if (selectedIndex >= 0 && results[selectedIndex]) {
      results[selectedIndex].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };
  const navigateToSelected = () => {
    const results = resultsEl.querySelectorAll(".search-result");
    if (selectedIndex >= 0 && results[selectedIndex]) {
      results[selectedIndex].click();
    }
  };
  const setFilter = (group, value, chips) => {
    filters[group] = value;
    chips.forEach((chip) => {
      const active = chip.dataset[group === "type" ? "filterType" : "filterLang"] === value;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", active ? "true" : "false");
    });
    refresh();
  };
  typeChips.forEach((chip) => {
    chip.addEventListener("click", () => setFilter("type", chip.dataset.filterType, typeChips));
  });
  langChips.forEach((chip) => {
    chip.addEventListener("click", () => setFilter("lang", chip.dataset.filterLang, langChips));
  });
  resultsEl.addEventListener("click", (event) => {
    const suggestion = event.target.closest("[data-suggest-tag]");
    if (suggestion) {
      event.preventDefault();
      applyTagSuggestion(suggestion.dataset.suggestTag);
    }
  });
  const openOverlay = () => {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("search-open");
    requestAnimationFrame(() => input?.focus());
    ensureIndex()
      .then(() => refresh())
      .catch(() => {});
  };
  const closeOverlay = () => {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("search-open");
    if (input) {
      input.value = "";
      renderEmpty(emptyMessage);
    }
    setStatus(docs ? `${docs.length.toLocaleString()} documents indexed` : "");
  };
  const handleInput = (event) => {
    const value = event.target.value || "";
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => runSearch(value), 120);
  };
  input?.addEventListener("input", handleInput);
  closeBtn?.addEventListener("click", closeOverlay);
  document.querySelectorAll("[data-search-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", openOverlay);
  });
  const platform =
    (navigator.userAgentData && navigator.userAgentData.platform) ||
    navigator.platform ||
    "";
  if (!/mac|iphone|ipad|ipod/i.test(platform)) {
    document.querySelectorAll("[data-search-key]").forEach((el) => {
      el.textContent = "Ctrl K";
    });
  }
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeOverlay();
    }
  });
  window.addEventListener("keydown", (event) => {
    const key = event.key && event.key.toLowerCase();
    if ((event.metaKey || event.ctrlKey) && key === "k") {
      event.preventDefault();
      if (isOpen()) {
        closeOverlay();
      } else {
        openOverlay();
      }
    }
    if (key === "escape" && isOpen()) {
      closeOverlay();
    }
    if (isOpen()) {
      const results = resultsEl.querySelectorAll(".search-result");
      if (key === "arrowdown") {
        event.preventDefault();
        if (results.length > 0) {
          selectedIndex = selectedIndex < results.length - 1 ? selectedIndex + 1 : 0;
          updateSelectedResult();
        }
      }
      if (key === "arrowup") {
        event.preventDefault();
        if (results.length > 0) {
          selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : results.length - 1;
          updateSelectedResult();
        }
      }
      if (key === "enter" && selectedIndex >= 0) {
        event.preventDefault();
        navigateToSelected();
      }
    }
  });
})();
(() => {
  document.querySelectorAll(".highlight").forEach((el) => {
    if (!el.classList.contains("code-block")) {
      el.classList.add("code-block");
    }
  });
  document.querySelectorAll("pre").forEach((pre) => {
    if (!pre.parentElement || pre.parentElement.classList.contains("code-block")) return;
    const wrapper = document.createElement("div");
    wrapper.className = "code-block";
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
  });
  const blocks = document.querySelectorAll(".code-block");
  if (!blocks.length) return;
  const createButton = () => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "code-copy";
    btn.setAttribute("aria-label", "Copy code");
    btn.innerHTML = `
      <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14">
        <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
      </svg>
      <span class="code-copy-label">Copy</span>
    `;
    return btn;
  };
  const copyToClipboard = async (text, labelEl) => {
    try {
      await navigator.clipboard.writeText(text);
      if (labelEl) {
        const prev = labelEl.textContent;
        labelEl.textContent = "Copied!";
        setTimeout(() => {
          labelEl.textContent = prev;
        }, 1200);
      }
    } catch (err) {
      console.error("Copy failed", err);
      if (labelEl) labelEl.textContent = "Error";
    }
  };
  blocks.forEach((block) => {
    const pre = block.querySelector("pre");
    const code = block.querySelector("code");
    if (!pre || !code) return;
    const button = createButton();
    const labelEl = button.querySelector(".code-copy-label");
    button.addEventListener("click", () => copyToClipboard(code.innerText.trim(), labelEl));
    block.appendChild(button);
  });
})();
(() => {
  const contentSelector = ".post-body, .page-content, .content";
  const headingSelector = "h2, h3, h4, h5, h6";
  const contentArea = document.querySelector(contentSelector);
  if (!contentArea) return;
  const headings = contentArea.querySelectorAll(headingSelector);
  if (!headings.length) return;
  const createCopyButton = () => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "heading-copy";
    btn.setAttribute("aria-label", "Copy link to heading");
    btn.innerHTML = `
      <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
        <path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
      </svg>
    `;
    return btn;
  };
  const copyLinkToClipboard = async (heading, button) => {
    const id = heading.getAttribute("id");
    if (!id) return;
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      button.classList.add("copied");
      setTimeout(() => {
        button.classList.remove("copied");
      }, 1200);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };
  headings.forEach((heading) => {
    if (!heading.getAttribute("id")) return;
    if (!heading.classList.contains("heading-with-copy")) {
      heading.classList.add("heading-with-copy");
      const button = createCopyButton();
      button.addEventListener("click", () => copyLinkToClipboard(heading, button));
      heading.appendChild(button);
    }
  });
})();
document.addEventListener("DOMContentLoaded", function () {
    var docEl = document.documentElement;
    function hideNativeScrollbar() {
        docEl.classList.add("has-reading-rail");
        var prev = docEl.style.overflow;
        docEl.style.overflow = "hidden";
        void docEl.offsetHeight;
        docEl.style.overflow = prev;
    }
    function makeRail(host) {
        var rail = document.createElement("div");
        rail.className = "toc-rail";
        var labelsEl = document.createElement("div");
        labelsEl.className = "toc-rail-labels";
        var trackEl = document.createElement("div");
        trackEl.className = "toc-rail-track";
        rail.appendChild(labelsEl);
        rail.appendChild(trackEl);
        host.appendChild(rail);
        return { labelsEl: labelsEl, trackEl: trackEl };
    }
    function makeSeg(trackEl) {
        var seg = document.createElement("span");
        seg.className = "toc-rail-seg";
        var fill = document.createElement("span");
        fill.className = "toc-rail-seg-fill";
        seg.appendChild(fill);
        trackEl.appendChild(seg);
        return { seg: seg, fill: fill };
    }
    function enableScrub(host, trackEl, toScrollTop) {
        var scrubbing = false;
        function scrubTo(clientY) {
            var rect = trackEl.getBoundingClientRect();
            var frac = (clientY - rect.top) / Math.max(1, rect.height);
            frac = Math.max(0, Math.min(1, frac));
            window.scrollTo({
                top: Math.max(0, toScrollTop(frac)),
                behavior: "auto",
            });
        }
        trackEl.addEventListener("pointerdown", function (e) {
            if (e.button !== 0 && e.pointerType === "mouse") return;
            scrubbing = true;
            host.classList.add("is-scrubbing");
            trackEl.setPointerCapture(e.pointerId);
            scrubTo(e.clientY);
            e.preventDefault();
        });
        trackEl.addEventListener("pointermove", function (e) {
            if (scrubbing) scrubTo(e.clientY);
        });
        function endScrub() {
            scrubbing = false;
            host.classList.remove("is-scrubbing");
        }
        trackEl.addEventListener("pointerup", endScrub);
        trackEl.addEventListener("pointercancel", endScrub);
    }
    function onScroll(fn) {
        var ticking = false;
        window.addEventListener(
            "scroll",
            function () {
                if (ticking) return;
                ticking = true;
                requestAnimationFrame(function () {
                    ticking = false;
                    fn();
                });
            },
            { passive: true }
        );
    }
    function absTop(el) {
        return el.getBoundingClientRect().top + window.scrollY;
    }
    function initTocRail() {
        var sidebar = document.querySelector(".toc-sidebar");
        var article = document.querySelector(".post-content");
        var body = document.querySelector(".post-content .post-body");
        var nav = sidebar && sidebar.querySelector(".toc-nav");
        if (!sidebar || !article || !body || !nav) return false;
        var links = Array.prototype.slice.call(
            nav.querySelectorAll(":scope > ul > li > a[href^='#']")
        );
        if (!links.length) {
            links = Array.prototype.slice.call(
                nav.querySelectorAll("a[href^='#']")
            );
        }
        var heads = [];
        var texts = [];
        links.forEach(function (link) {
            var id = decodeURIComponent(link.hash.slice(1));
            var el = document.getElementById(id);
            if (el) {
                heads.push(el);
                texts.push(link.textContent.trim());
            }
        });
        if (heads.length < 2) return false;
        var titleEl = article.querySelector(".page-title");
        var introLabel = titleEl ? titleEl.textContent.trim() : "Top";
        var parts = makeRail(sidebar);
        var sections = [];
        function addSection(text, target) {
            var a = document.createElement("a");
            a.className = "toc-rail-label";
            a.textContent = text;
            a.href = target ? "#" + target.id : "#";
            if (!target) {
                a.addEventListener("click", function (e) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                });
            }
            var seg = makeSeg(parts.trackEl);
            parts.labelsEl.appendChild(a);
            sections.push({ label: a, seg: seg.seg, fill: seg.fill });
        }
        addSection(introLabel, null);
        heads.forEach(function (h, i) {
            addSection(texts[i], h);
        });
        sidebar.classList.add("is-ready");
        hideNativeScrollbar();
        if (/(^|[?&])tocdebug/.test(location.search)) {
            sidebar.classList.add("is-open");
        }
        var GAP = 3;
        var pts = [];
        function layout() {
            var start = absTop(article);
            var end = absTop(body) + body.offsetHeight;
            if (end <= start) return;
            var total = end - start;
            pts = [start];
            heads.forEach(function (h) {
                pts.push(Math.max(absTop(h), pts[pts.length - 1]));
            });
            pts.push(end);
            var trackH = parts.trackEl.clientHeight;
            var tops = [];
            for (var i = 0; i < sections.length; i++) {
                var topPct = ((pts[i] - start) / total) * 100;
                var hPct = ((pts[i + 1] - pts[i]) / total) * 100;
                sections[i].seg.style.top = topPct + "%";
                sections[i].seg.style.height =
                    "calc(" + hPct + "% - " + GAP + "px)";
                tops.push((topPct / 100) * trackH);
            }
            var MIN = 20;
            for (var j = 0; j < tops.length; j++) {
                tops[j] = Math.max(tops[j], 10, j > 0 ? tops[j - 1] + MIN : 0);
            }
            var over = tops[tops.length - 1] - (trackH - 10);
            if (over > 0) {
                for (var k = tops.length - 1; k >= 0; k--) {
                    tops[k] = Math.min(
                        tops[k],
                        trackH - 10 - (tops.length - 1 - k) * MIN
                    );
                }
            }
            sections.forEach(function (s, idx) {
                s.label.style.top = tops[idx] + "px";
            });
            progress();
        }
        function progress() {
            if (!pts.length) return;
            var point = window.scrollY + window.innerHeight * 0.32;
            var bottomed =
                window.scrollY + window.innerHeight >=
                docEl.scrollHeight - 4;
            var activeIdx = 0;
            for (var i = 0; i < sections.length; i++) {
                var s0 = pts[i];
                var s1 = pts[i + 1];
                var f = bottomed ? 1 : (point - s0) / Math.max(1, s1 - s0);
                f = Math.max(0, Math.min(1, f));
                sections[i].fill.style.height = f * 100 + "%";
                if (point >= s0) activeIdx = i;
            }
            if (bottomed) activeIdx = sections.length - 1;
            sections.forEach(function (s, idx) {
                s.label.classList.toggle("active", idx === activeIdx);
            });
        }
        enableScrub(sidebar, parts.trackEl, function (frac) {
            var start = pts[0];
            var end = pts[pts.length - 1];
            return start + frac * (end - start) - window.innerHeight * 0.32;
        });
        onScroll(progress);
        var resizeTimer;
        window.addEventListener("resize", function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(layout, 120);
        });
        window.addEventListener("load", layout);
        if (typeof ResizeObserver !== "undefined") {
            new ResizeObserver(function () {
                layout();
            }).observe(body);
        }
        layout();
        return true;
    }
    function initPageRail() {
        function maxScroll() {
            return docEl.scrollHeight - window.innerHeight;
        }
        if (maxScroll() < 240) return;
        var host = document.createElement("div");
        host.className = "toc-sidebar is-ready";
        host.setAttribute("aria-hidden", "true");
        document.body.appendChild(host);
        var parts = makeRail(host);
        var seg = makeSeg(parts.trackEl);
        seg.seg.style.top = "0%";
        seg.seg.style.height = "100%";
        hideNativeScrollbar();
        function progress() {
            var f = window.scrollY / Math.max(1, maxScroll());
            seg.fill.style.height = Math.max(0, Math.min(1, f)) * 100 + "%";
        }
        enableScrub(host, parts.trackEl, function (frac) {
            return frac * maxScroll();
        });
        onScroll(progress);
        window.addEventListener("resize", progress);
        window.addEventListener("load", progress);
        progress();
    }
    if (!initTocRail()) initPageRail();
});
(() => {
  const targets = document.querySelectorAll("[data-sapi-star]");
  if (!targets.length) return;
  fetch("https://sapi.hahwul.com/projects/summary.json", { mode: "cors", cache: "no-cache" })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((data) => {
      const stars = new Map((data.repositories || []).map((r) => [r.name, r.star]));
      targets.forEach((el) => {
        const value = stars.get(el.getAttribute("data-sapi-star"));
        if (value) el.textContent = value;
      });
    })
    .catch(() => {
    });
})();
(function () {
    "use strict";
    var exhibits = Array.prototype.slice.call(
        document.querySelectorAll(".exhibit")
    );
    if (!exhibits.length) return;
    if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    entry.target.classList.toggle("is-lit", entry.isIntersecting);
                });
            },
            { threshold: 0.3 }
        );
        exhibits.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        exhibits.forEach(function (el) {
            el.classList.add("is-lit");
        });
    }
})();
(() => {
  if (!document.querySelector(".mermaid, pre.mermaid")) return;
  const script = document.createElement("script");
  script.src = "/assets/js/vendor/mermaid.min.js";
  script.onload = () => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        darkMode: true,
        background: "#1a1a1a",
        primaryColor: "#3b82f6",
        primaryTextColor: "#e5e5e5",
        primaryBorderColor: "#60a5fa",
        lineColor: "#94a3b8",
        secondaryColor: "#8b5cf6",
        tertiaryColor: "#10b981",
        mainBkg: "#1e1e1e",
        secondBkg: "#262626",
        border1: "#404040",
        border2: "#525252",
        note: "#fbbf24",
        noteBkgColor: "#451a03",
        noteBorderColor: "#f59e0b",
        noteTextColor: "#fef3c7",
        textColor: "#e5e5e5",
        labelTextColor: "#e5e5e5",
        loopTextColor: "#e5e5e5",
        activationBorderColor: "#60a5fa",
        activationBkgColor: "#1e3a8a",
        sequenceNumberColor: "#e5e5e5",
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: "basis",
      },
      sequence: {
        useMaxWidth: true,
        wrap: true,
        wrapPadding: 10,
      },
      gantt: {
        useMaxWidth: true,
      },
    });
    mermaid.run();
  };
  document.head.appendChild(script);
})();