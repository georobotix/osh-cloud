"use strict";(self["webpackChunkvue3_webpack5"]=self["webpackChunkvue3_webpack5"]||[]).push([[6826],{33676:function(t,e,i){var a=i(60838),n=i(60216),r=i(63367),s=i(59947),o=i(82982),l=i(12572),u=i(71171),h=i(68201),v=i(72248),c=i(9407);function _(t,e,i,a){switch(e.type){case t.FLOAT:return new f(t,e,i,a);case t.FLOAT_VEC2:return new g(t,e,i,a);case t.FLOAT_VEC3:return new p(t,e,i,a);case t.FLOAT_VEC4:return new Z(t,e,i,a);case t.SAMPLER_2D:case t.SAMPLER_CUBE:return new w(t,e,i,a);case t.INT:case t.BOOL:return new y(t,e,i,a);case t.INT_VEC2:case t.BOOL_VEC2:return new d(t,e,i,a);case t.INT_VEC3:case t.BOOL_VEC3:return new m(t,e,i,a);case t.INT_VEC4:case t.BOOL_VEC4:return new A(t,e,i,a);case t.FLOAT_MAT2:return new T(t,e,i,a);case t.FLOAT_MAT3:return new E(t,e,i,a);case t.FLOAT_MAT4:return new C(t,e,i,a);default:throw new c.Z("Unrecognized uniform type: "+e.type+' for uniform "'+i+'".')}}function f(t,e,i,a){this.name=i,this.value=void 0,this._value=0,this._gl=t,this._location=a}function g(t,e,i,n){this.name=i,this.value=void 0,this._value=new a.Z,this._gl=t,this._location=n}function p(t,e,i,a){this.name=i,this.value=void 0,this._value=void 0,this._gl=t,this._location=a}function Z(t,e,i,a){this.name=i,this.value=void 0,this._value=void 0,this._gl=t,this._location=a}function w(t,e,i,a){this.name=i,this.value=void 0,this._gl=t,this._location=a,this.textureUnitIndex=void 0}function y(t,e,i,a){this.name=i,this.value=void 0,this._value=0,this._gl=t,this._location=a}function d(t,e,i,n){this.name=i,this.value=void 0,this._value=new a.Z,this._gl=t,this._location=n}function m(t,e,i,a){this.name=i,this.value=void 0,this._value=new n.Z,this._gl=t,this._location=a}function A(t,e,i,a){this.name=i,this.value=void 0,this._value=new r.Z,this._gl=t,this._location=a}f.prototype.set=function(){this.value!==this._value&&(this._value=this.value,this._gl.uniform1f(this._location,this.value))},g.prototype.set=function(){var t=this.value;a.Z.equals(t,this._value)||(a.Z.clone(t,this._value),this._gl.uniform2f(this._location,t.x,t.y))},p.prototype.set=function(){var t=this.value;if((0,o.Z)(t.red))s.Z.equals(t,this._value)||(this._value=s.Z.clone(t,this._value),this._gl.uniform3f(this._location,t.red,t.green,t.blue));else{if(!(0,o.Z)(t.x))throw new l.Z('Invalid vec3 value for uniform "'+this.name+'".');n.Z.equals(t,this._value)||(this._value=n.Z.clone(t,this._value),this._gl.uniform3f(this._location,t.x,t.y,t.z))}},Z.prototype.set=function(){var t=this.value;if((0,o.Z)(t.red))s.Z.equals(t,this._value)||(this._value=s.Z.clone(t,this._value),this._gl.uniform4f(this._location,t.red,t.green,t.blue,t.alpha));else{if(!(0,o.Z)(t.x))throw new l.Z('Invalid vec4 value for uniform "'+this.name+'".');r.Z.equals(t,this._value)||(this._value=r.Z.clone(t,this._value),this._gl.uniform4f(this._location,t.x,t.y,t.z,t.w))}},w.prototype.set=function(){var t=this._gl;t.activeTexture(t.TEXTURE0+this.textureUnitIndex);var e=this.value;t.bindTexture(e._target,e._texture)},w.prototype._setSampler=function(t){return this.textureUnitIndex=t,this._gl.uniform1i(this._location,t),t+1},y.prototype.set=function(){this.value!==this._value&&(this._value=this.value,this._gl.uniform1i(this._location,this.value))},d.prototype.set=function(){var t=this.value;a.Z.equals(t,this._value)||(a.Z.clone(t,this._value),this._gl.uniform2i(this._location,t.x,t.y))},m.prototype.set=function(){var t=this.value;n.Z.equals(t,this._value)||(n.Z.clone(t,this._value),this._gl.uniform3i(this._location,t.x,t.y,t.z))},A.prototype.set=function(){var t=this.value;r.Z.equals(t,this._value)||(r.Z.clone(t,this._value),this._gl.uniform4i(this._location,t.x,t.y,t.z,t.w))};var x=new Float32Array(4);function T(t,e,i,a){this.name=i,this.value=void 0,this._value=new u.Z,this._gl=t,this._location=a}T.prototype.set=function(){if(!u.Z.equalsArray(this.value,this._value,0)){u.Z.clone(this.value,this._value);var t=u.Z.toArray(this.value,x);this._gl.uniformMatrix2fv(this._location,!1,t)}};var O=new Float32Array(9);function E(t,e,i,a){this.name=i,this.value=void 0,this._value=new h.Z,this._gl=t,this._location=a}E.prototype.set=function(){if(!h.Z.equalsArray(this.value,this._value,0)){h.Z.clone(this.value,this._value);var t=h.Z.toArray(this.value,O);this._gl.uniformMatrix3fv(this._location,!1,t)}};var I=new Float32Array(16);function C(t,e,i,a){this.name=i,this.value=void 0,this._value=new v.Z,this._gl=t,this._location=a}C.prototype.set=function(){if(!v.Z.equalsArray(this.value,this._value,0)){v.Z.clone(this.value,this._value);var t=v.Z.toArray(this.value,I);this._gl.uniformMatrix4fv(this._location,!1,t)}},e["Z"]=_},15990:function(t,e,i){var a=i(60838),n=i(60216),r=i(63367),s=i(59947),o=i(82982),l=i(12572),u=i(71171),h=i(68201),v=i(72248),c=i(9407);function _(t,e,i,a){switch(e.type){case t.FLOAT:return new f(t,e,i,a);case t.FLOAT_VEC2:return new g(t,e,i,a);case t.FLOAT_VEC3:return new p(t,e,i,a);case t.FLOAT_VEC4:return new Z(t,e,i,a);case t.SAMPLER_2D:case t.SAMPLER_CUBE:return new w(t,e,i,a);case t.INT:case t.BOOL:return new y(t,e,i,a);case t.INT_VEC2:case t.BOOL_VEC2:return new d(t,e,i,a);case t.INT_VEC3:case t.BOOL_VEC3:return new m(t,e,i,a);case t.INT_VEC4:case t.BOOL_VEC4:return new A(t,e,i,a);case t.FLOAT_MAT2:return new x(t,e,i,a);case t.FLOAT_MAT3:return new T(t,e,i,a);case t.FLOAT_MAT4:return new O(t,e,i,a);default:throw new c.Z("Unrecognized uniform type: "+e.type+' for uniform "'+i+'".')}}function f(t,e,i,a){var n=a.length;this.name=i,this.value=new Array(n),this._value=new Float32Array(n),this._gl=t,this._location=a[0]}function g(t,e,i,a){var n=a.length;this.name=i,this.value=new Array(n),this._value=new Float32Array(2*n),this._gl=t,this._location=a[0]}function p(t,e,i,a){var n=a.length;this.name=i,this.value=new Array(n),this._value=new Float32Array(3*n),this._gl=t,this._location=a[0]}function Z(t,e,i,a){var n=a.length;this.name=i,this.value=new Array(n),this._value=new Float32Array(4*n),this._gl=t,this._location=a[0]}function w(t,e,i,a){var n=a.length;this.name=i,this.value=new Array(n),this._value=new Float32Array(n),this._gl=t,this._locations=a,this.textureUnitIndex=void 0}function y(t,e,i,a){var n=a.length;this.name=i,this.value=new Array(n),this._value=new Int32Array(n),this._gl=t,this._location=a[0]}function d(t,e,i,a){var n=a.length;this.name=i,this.value=new Array(n),this._value=new Int32Array(2*n),this._gl=t,this._location=a[0]}function m(t,e,i,a){var n=a.length;this.name=i,this.value=new Array(n),this._value=new Int32Array(3*n),this._gl=t,this._location=a[0]}function A(t,e,i,a){var n=a.length;this.name=i,this.value=new Array(n),this._value=new Int32Array(4*n),this._gl=t,this._location=a[0]}function x(t,e,i,a){var n=a.length;this.name=i,this.value=new Array(n),this._value=new Float32Array(4*n),this._gl=t,this._location=a[0]}function T(t,e,i,a){var n=a.length;this.name=i,this.value=new Array(n),this._value=new Float32Array(9*n),this._gl=t,this._location=a[0]}function O(t,e,i,a){var n=a.length;this.name=i,this.value=new Array(n),this._value=new Float32Array(16*n),this._gl=t,this._location=a[0]}f.prototype.set=function(){for(var t=this.value,e=t.length,i=this._value,a=!1,n=0;n<e;++n){var r=t[n];r!==i[n]&&(i[n]=r,a=!0)}a&&this._gl.uniform1fv(this._location,i)},g.prototype.set=function(){for(var t=this.value,e=t.length,i=this._value,n=!1,r=0,s=0;s<e;++s){var o=t[s];a.Z.equalsArray(o,i,r)||(a.Z.pack(o,i,r),n=!0),r+=2}n&&this._gl.uniform2fv(this._location,i)},p.prototype.set=function(){for(var t=this.value,e=t.length,i=this._value,a=!1,r=0,s=0;s<e;++s){var u=t[s];if((0,o.Z)(u.red))u.red===i[r]&&u.green===i[r+1]&&u.blue===i[r+2]||(i[r]=u.red,i[r+1]=u.green,i[r+2]=u.blue,a=!0);else{if(!(0,o.Z)(u.x))throw new l.Z("Invalid vec3 value.");n.Z.equalsArray(u,i,r)||(n.Z.pack(u,i,r),a=!0)}r+=3}a&&this._gl.uniform3fv(this._location,i)},Z.prototype.set=function(){for(var t=this.value,e=t.length,i=this._value,a=!1,n=0,u=0;u<e;++u){var h=t[u];if((0,o.Z)(h.red))s.Z.equalsArray(h,i,n)||(s.Z.pack(h,i,n),a=!0);else{if(!(0,o.Z)(h.x))throw new l.Z("Invalid vec4 value.");r.Z.equalsArray(h,i,n)||(r.Z.pack(h,i,n),a=!0)}n+=4}a&&this._gl.uniform4fv(this._location,i)},w.prototype.set=function(){for(var t=this._gl,e=t.TEXTURE0+this.textureUnitIndex,i=this.value,a=i.length,n=0;n<a;++n){var r=i[n];t.activeTexture(e+n),t.bindTexture(r._target,r._texture)}},w.prototype._setSampler=function(t){this.textureUnitIndex=t;for(var e=this._locations,i=e.length,a=0;a<i;++a){var n=t+a;this._gl.uniform1i(e[a],n)}return t+i},y.prototype.set=function(){for(var t=this.value,e=t.length,i=this._value,a=!1,n=0;n<e;++n){var r=t[n];r!==i[n]&&(i[n]=r,a=!0)}a&&this._gl.uniform1iv(this._location,i)},d.prototype.set=function(){for(var t=this.value,e=t.length,i=this._value,n=!1,r=0,s=0;s<e;++s){var o=t[s];a.Z.equalsArray(o,i,r)||(a.Z.pack(o,i,r),n=!0),r+=2}n&&this._gl.uniform2iv(this._location,i)},m.prototype.set=function(){for(var t=this.value,e=t.length,i=this._value,a=!1,r=0,s=0;s<e;++s){var o=t[s];n.Z.equalsArray(o,i,r)||(n.Z.pack(o,i,r),a=!0),r+=3}a&&this._gl.uniform3iv(this._location,i)},A.prototype.set=function(){for(var t=this.value,e=t.length,i=this._value,a=!1,n=0,s=0;s<e;++s){var o=t[s];r.Z.equalsArray(o,i,n)||(r.Z.pack(o,i,n),a=!0),n+=4}a&&this._gl.uniform4iv(this._location,i)},x.prototype.set=function(){for(var t=this.value,e=t.length,i=this._value,a=!1,n=0,r=0;r<e;++r){var s=t[r];u.Z.equalsArray(s,i,n)||(u.Z.pack(s,i,n),a=!0),n+=4}a&&this._gl.uniformMatrix2fv(this._location,!1,i)},T.prototype.set=function(){for(var t=this.value,e=t.length,i=this._value,a=!1,n=0,r=0;r<e;++r){var s=t[r];h.Z.equalsArray(s,i,n)||(h.Z.pack(s,i,n),a=!0),n+=9}a&&this._gl.uniformMatrix3fv(this._location,!1,i)},O.prototype.set=function(){for(var t=this.value,e=t.length,i=this._value,a=!1,n=0,r=0;r<e;++r){var s=t[r];v.Z.equalsArray(s,i,n)||(v.Z.pack(s,i,n),a=!0),n+=16}a&&this._gl.uniformMatrix4fv(this._location,!1,i)},e["Z"]=_},513:function(t,e){function i(t){if("object"!==typeof t||null===t)return t;for(var e,a=Object.keys(t),n=0;n<a.length;n++)e=a[n],t.hasOwnProperty(e)&&"_applyFunctions"!==e&&(t[e]=i(t[e]));return Object.freeze(t)}e["Z"]=i},93958:function(t,e,i){var a=i(66553),n=i(82982),r=i(12572),s=i(68985),o=i(13222),l=i(51107);function u(t,e,i){if(a.Z.defined("context",t),!(0,n.Z)(e)||!(0,n.Z)(e.positiveX)||!(0,n.Z)(e.negativeX)||!(0,n.Z)(e.positiveY)||!(0,n.Z)(e.negativeY)||!(0,n.Z)(e.positiveZ)||!(0,n.Z)(e.negativeZ))throw new r.Z("urls is required and must have positiveX, negativeX, positiveY, negativeY, positiveZ, and negativeZ properties.");var u={flipY:!0,skipColorSpaceConversion:i,preferImageBitmap:!0},h=[s.Z.createIfNeeded(e.positiveX).fetchImage(u),s.Z.createIfNeeded(e.negativeX).fetchImage(u),s.Z.createIfNeeded(e.positiveY).fetchImage(u),s.Z.createIfNeeded(e.negativeY).fetchImage(u),s.Z.createIfNeeded(e.positiveZ).fetchImage(u),s.Z.createIfNeeded(e.negativeZ).fetchImage(u)];return o.Z.all(h,(function(e){return new l.Z({context:t,source:{positiveX:e[0],negativeX:e[1],positiveY:e[2],negativeY:e[3],positiveZ:e[4],negativeZ:e[5]}})}))}e["Z"]=u},33445:function(t,e,i){var a=i(82982),n=i(12572);function r(t,e){var i=/#define OUTPUT_DECLARATION/,a=t.split("\n");if(/#version 300 es/g.test(t))return t;var r,o,_=-1;for(r=0;r<a.length;++r)if(o=a[r],i.test(o)){_=r;break}if(-1===_)throw new n.Z("Could not find a #define OUTPUT_DECLARATION!");var f=[];for(r=0;r<10;r++){var g="gl_FragData\\["+r+"\\]",p="czm_out"+r,Z=new RegExp(g,"g");Z.test(t)&&(h(p,f),s(g,p,a),a.splice(_,0,"layout(location = "+r+") out vec4 "+p+";"),_+=1)}var w="czm_fragColor";l("gl_FragColor",a)&&(h(w,f),s("gl_FragColor",w,a),a.splice(_,0,"layout(location = 0) out vec4 czm_fragColor;"),_+=1);var y=v(f,a),d={};for(r=0;r<a.length;r++)for(var m in o=a[r],y)if(y.hasOwnProperty(m)){var A=new RegExp("(layout)[^]+(out)[^]+("+m+")[^]+","g");A.test(o)&&(d[o]=m)}for(var x in d)if(d.hasOwnProperty(x)){var T,O=d[x],E=a.indexOf(x),I=y[O],C=I.length;for(T=0;T<C;T++)a.splice(E,0,I[T]);for(E+=C+1,T=C-1;T>=0;T--)a.splice(E,0,"#endif //"+I[T])}var F="WEBGL_2",L="#define "+F,q="#version 300 es",k=!1;for(r=0;r<a.length;r++)if(/#version/.test(a[r])){a[r]=q,k=!0;break}return k||a.splice(0,0,q),a.splice(1,0,L),c("EXT_draw_buffers",F,a),c("EXT_frag_depth",F,a),c("OES_standard_derivatives",F,a),s("texture2D","texture",a),s("texture3D","texture",a),s("textureCube","texture",a),s("gl_FragDepthEXT","gl_FragDepth",a),e?s("varying","in",a):(s("attribute","in",a),s("varying","out",a)),u(a)}function s(t,e,i){for(var a="(^|[^\\w])("+t+")($|[^\\w])",n=new RegExp(a,"g"),r=i.length,s=0;s<r;++s){var o=i[s];i[s]=o.replace(n,"$1"+e+"$3")}}function o(t,e,i){for(var a=i.length,n=0;n<a;++n){var r=i[n];i[n]=r.replace(t,e)}}function l(t,e){for(var i="(^|[^\\w])("+t+")($|[^\\w])",a=new RegExp(i,"g"),n=e.length,r=0;r<n;++r){var s=e[r];if(a.test(s))return!0}return!1}function u(t){for(var e="",i=t.length,a=0;a<i;++a)e+=t[a]+"\n";return e}function h(t,e){-1===e.indexOf(t)&&e.push(t)}function v(t,e){for(var i={},n=t.length,r=[],s=0;s<e.length;++s){var o=e[s],l=/(#ifdef|#if)/g.test(o),u=/#else/g.test(o),h=/#endif/g.test(o);if(l)r.push(o);else if(u){var v=r[r.length-1],c=v.replace("ifdef","ifndef");/if/g.test(c)&&(c=c.replace(/(#if\s+)(\S*)([^]*)/,"$1!($2)$3")),r.pop(),r.push(c)}else if(h)r.pop();else if(!/layout/g.test(o))for(var _=0;_<n;++_){var f=t[_];-1!==o.indexOf(f)&&((0,a.Z)(i[f])?i[f]=i[f].filter((function(t){return r.indexOf(t)>=0})):i[f]=r.slice())}}return i}function c(t,e,i){var a="#extension\\s+GL_"+t+"\\s+:\\s+[a-zA-Z0-9]+\\s*$";o(new RegExp(a,"g"),"",i),s("GL_"+t,e,i)}e["Z"]=r}}]);
//# sourceMappingURL=chunk-vendors-d2dd9e8d-legacy.d1498bc0.js.map