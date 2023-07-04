"use strict";(self["webpackChunkvue3_webpack5"]=self["webpackChunkvue3_webpack5"]||[]).push([[2402],{84020:function(t,e,r){var n=r(60838),i=r(66553),o=r(83856),a=r(59947),s=r(8182),c=r(62200),u=r(82982),l=r(11954),f=r(86511),h=r(12572),p=r(99417),_=r(9407),y=r(20521),b=r(60072),g=r(8379),d=r(10667),Z=r(53642),T=r(31937),m=r(40384),v=r(13633),C=r(95401),S=r(71593),E=r(17041),I=r(87233),L=r(77053),x=r(81255),P=T.Z.DEFAULT_COLOR_VALUE,w=T.Z.DEFAULT_SHOW_VALUE;function A(t,e,r,n,i){var o;this.featuresLength=e,(0,u.Z)(r)&&(o=r.extensions),this._extensions=(0,c.Z)(o,{});var a=D(r);this._properties=a,this._batchTableHierarchy=O(this,r,n),this._batchTableBinaryProperties=N(e,a,n),this._content=t,this._batchTexture=new T.Z({featuresLength:e,colorChangedCallback:i,content:t})}function D(t){var e={};if(!(0,u.Z)(t))return e;for(var r in t)t.hasOwnProperty(r)&&"HIERARCHY"!==r&&"extensions"!==r&&"extras"!==r&&(e[r]=(0,o.Z)(t[r],!0));return e}function O(t,e,r){if((0,u.Z)(e)){var n=t._extensions["3DTILES_batch_table_hierarchy"],i=e.HIERARCHY;if((0,u.Z)(i)&&(A._deprecationWarning("batchTableHierarchyExtension","The batch table HIERARCHY property has been moved to an extension. Use extensions.3DTILES_batch_table_hierarchy instead."),t._extensions["3DTILES_batch_table_hierarchy"]=i,n=i),(0,u.Z)(n))return new m.Z({extension:n,binaryBody:r})}}function N(t,e,r){var n;for(var i in e)if(e.hasOwnProperty(i)){var o=e[i],a=o.byteOffset;if((0,u.Z)(a)){var s=o.componentType,c=o.type;if(!(0,u.Z)(s))throw new _.Z("componentType is required.");if(!(0,u.Z)(c))throw new _.Z("type is required.");if(!(0,u.Z)(r))throw new _.Z("Property "+i+" requires a batch table binary.");var l=(0,E.Z)(o),f=l.componentsPerAttribute,h=l.classType,p=l.createArrayBufferView(r.buffer,r.byteOffset+a,t);(0,u.Z)(n)||(n={}),n[i]={typedArray:p,componentCount:f,type:h}}}return n}A._deprecationWarning=l.Z,Object.defineProperties(A.prototype,{memorySizeInBytes:{get:function(){return this._batchTexture.memorySizeInBytes}}}),A.getBinaryProperties=function(t,e,r){return N(t,e,r)},A.prototype.setShow=function(t,e){this._batchTexture.setShow(t,e)},A.prototype.setAllShow=function(t){this._batchTexture.setAllShow(t)},A.prototype.getShow=function(t){return this._batchTexture.getShow(t)},A.prototype.setColor=function(t,e){this._batchTexture.setColor(t,e)},A.prototype.setAllColor=function(t){this._batchTexture.setAllColor(t)},A.prototype.getColor=function(t,e){return this._batchTexture.getColor(t,e)},A.prototype.getPickColor=function(t){return this._batchTexture.getPickColor(t)};var M=new a.Z;function R(t,e){var r=t.typedArray,n=t.componentCount;return 1===n?r[e]:t.type.unpack(r,e*n)}function k(t,e,r){var n=t.typedArray,i=t.componentCount;1===i?n[e]=r:t.type.pack(r,n,e*i)}function U(t,e){if(!(0,u.Z)(t)||t<0||t>=e)throw new h.Z("batchId is required and between zero and featuresLength - 1 ("+e-NaN)}function B(t){return 1===t._batchTexture.textureDimensions.y?"uniform vec4 tile_textureStep; \nvec2 computeSt(float batchId) \n{ \n    float stepX = tile_textureStep.x; \n    float centerX = tile_textureStep.y; \n    return vec2(centerX + (batchId * stepX), 0.5); \n} \n":"uniform vec4 tile_textureStep; \nuniform vec2 tile_textureDimensions; \nvec2 computeSt(float batchId) \n{ \n    float stepX = tile_textureStep.x; \n    float centerX = tile_textureStep.y; \n    float stepY = tile_textureStep.z; \n    float centerY = tile_textureStep.w; \n    float xId = mod(batchId, tile_textureDimensions.x); \n    float yId = floor(batchId / tile_textureDimensions.x); \n    return vec2(centerX + (xId * stepX), centerY + (yId * stepY)); \n} \n"}function F(t,e){return t=Z.Z.replaceMain(t,"tile_main"),e?t+"uniform float tile_colorBlend; \nvoid tile_color(vec4 tile_featureColor) \n{ \n    tile_main(); \n    tile_featureColor = czm_gammaCorrect(tile_featureColor); \n    gl_FragColor.a *= tile_featureColor.a; \n    float highlight = ceil(tile_colorBlend); \n    gl_FragColor.rgb *= mix(tile_featureColor.rgb, vec3(1.0), highlight); \n} \n":t+"void tile_color(vec4 tile_featureColor) \n{ \n    tile_main(); \n} \n"}function H(t,e){var r,n="texture2D("+e,i=0,o=t.indexOf(n,i);while(o>-1){for(var a=0,s=o;s<t.length;++s){var c=t.charAt(s);if("("===c)++a;else if(")"===c&&(--a,0===a)){r=s+1;break}}var u=t.slice(o,r),l="tile_diffuse_final("+u+", tile_diffuse)";t=t.slice(0,o)+l+t.slice(r),i=o+l.length,o=t.indexOf(n,i)}return t}function z(t,e,r){if(!(0,u.Z)(e))return F(t,r);var n=new RegExp("(uniform|attribute|in)\\s+(vec[34]|sampler2D)\\s+"+e+";"),i=t.match(n);if(!(0,u.Z)(i))return F(t,r);var o=i[0],a=i[2];t=Z.Z.replaceMain(t,"tile_main"),t=t.replace(o,"");var s,c="bool isWhite(vec3 color) \n{ \n    return all(greaterThan(color, vec3(1.0 - czm_epsilon3))); \n} \nvec4 tile_diffuse_final(vec4 sourceDiffuse, vec4 tileDiffuse) \n{ \n    vec4 blendDiffuse = mix(sourceDiffuse, tileDiffuse, tile_colorBlend); \n    vec4 diffuse = isWhite(tileDiffuse.rgb) ? sourceDiffuse : blendDiffuse; \n    return vec4(diffuse.rgb, sourceDiffuse.a); \n} \n",l="    tile_featureColor = czm_gammaCorrect(tile_featureColor); \n    gl_FragColor.a *= tile_featureColor.a; \n    float highlight = ceil(tile_colorBlend); \n    gl_FragColor.rgb *= mix(tile_featureColor.rgb, vec3(1.0), highlight); \n";if("vec3"===a||"vec4"===a){var f="vec3"===a?"vec4("+e+", 1.0)":e,h="vec3"===a?"tile_diffuse.xyz":"tile_diffuse";n=new RegExp(e,"g"),t=t.replace(n,h),s="    vec4 source = "+f+"; \n    tile_diffuse = tile_diffuse_final(source, tile_featureColor); \n    tile_main(); \n"}else"sampler2D"===a&&(t=H(t,e),s="    tile_diffuse = tile_featureColor; \n    tile_main(); \n");return t="uniform float tile_colorBlend; \nvec4 tile_diffuse = vec4(1.0); \n"+c+o+"\n"+t+"\nvoid tile_color(vec4 tile_featureColor) \n{ \n"+s,r&&(t+=l),t+="} \n",t}function G(t){var e=t._content.tileset,r=e.colorBlendMode,n=e.colorBlendAmount;if(r===C.Z.HIGHLIGHT)return 0;if(r===C.Z.REPLACE)return 1;if(r===C.Z.MIX)return p.Z.clamp(n,p.Z.EPSILON4,1);throw new h.Z('Invalid color blend mode "'+r+'".')}A.prototype.applyStyle=function(t){if(!(0,u.Z)(t))return this.setAllColor(P),void this.setAllShow(w);for(var e=this._content,r=this.featuresLength,n=0;n<r;++n){var i=e.getFeature(n),o=(0,u.Z)(t.color)?(0,c.Z)(t.color.evaluateColor(i,M),P):P,a=(0,u.Z)(t.show)?(0,c.Z)(t.show.evaluate(i),w):w;this.setColor(n,o),this.setShow(n,a)}},A.prototype.isClass=function(t,e){U(t,this.featuresLength),i.Z.typeOf.string("className",e);var r=this._batchTableHierarchy;return!!(0,u.Z)(r)&&r.isClass(t,e)},A.prototype.isExactClass=function(t,e){return i.Z.typeOf.string("className",e),this.getExactClassName(t)===e},A.prototype.getExactClassName=function(t){U(t,this.featuresLength);var e=this._batchTableHierarchy;if((0,u.Z)(e))return e.getClassName(t)},A.prototype.hasProperty=function(t,e){return U(t,this.featuresLength),i.Z.typeOf.string("name",e),(0,u.Z)(this._properties[e])||(0,u.Z)(this._batchTableHierarchy)&&this._batchTableHierarchy.hasProperty(t,e)},A.prototype.getPropertyNames=function(t,e){U(t,this.featuresLength),e=(0,u.Z)(e)?e:[],e.length=0;var r=Object.keys(this._properties);return e.push.apply(e,r),(0,u.Z)(this._batchTableHierarchy)&&e.push.apply(e,this._batchTableHierarchy.getPropertyIds(t,r)),e},A.prototype.getProperty=function(t,e){if(U(t,this.featuresLength),i.Z.typeOf.string("name",e),(0,u.Z)(this._batchTableBinaryProperties)){var r=this._batchTableBinaryProperties[e];if((0,u.Z)(r))return R(r,t)}var n=this._properties[e];if((0,u.Z)(n))return(0,o.Z)(n[t],!0);if((0,u.Z)(this._batchTableHierarchy)){var a=this._batchTableHierarchy.getProperty(t,e);if((0,u.Z)(a))return a}},A.prototype.setProperty=function(t,e,r){var n=this.featuresLength;if(U(t,n),i.Z.typeOf.string("name",e),(0,u.Z)(this._batchTableBinaryProperties)){var a=this._batchTableBinaryProperties[e];if((0,u.Z)(a))return void k(a,t,r)}if(!(0,u.Z)(this._batchTableHierarchy)||!this._batchTableHierarchy.setProperty(t,e,r)){var s=this._properties[e];(0,u.Z)(s)||(this._properties[e]=new Array(n),s=this._properties[e]),s[t]=(0,o.Z)(r,!0)}},A.prototype.getVertexShaderCallback=function(t,e,r){if(0!==this.featuresLength){var n=this;return function(i){var o,a=z(i,r,!1);return y.Z.maximumVertexTextureImageUnits>0?(o="",t&&(o+="uniform bool tile_translucentCommand; \n"),o+="uniform sampler2D tile_batchTexture; \nvarying vec4 tile_featureColor; \nvarying vec2 tile_featureSt; \nvoid main() \n{ \n    vec2 st = computeSt("+e+"); \n    vec4 featureProperties = texture2D(tile_batchTexture, st); \n    tile_color(featureProperties); \n    float show = ceil(featureProperties.a); \n    gl_Position *= show; \n",t&&(o+="    bool isStyleTranslucent = (featureProperties.a != 1.0); \n    if (czm_pass == czm_passTranslucent) \n    { \n        if (!isStyleTranslucent && !tile_translucentCommand) \n        { \n            gl_Position *= 0.0; \n        } \n    } \n    else \n    { \n        if (isStyleTranslucent) \n        { \n            gl_Position *= 0.0; \n        } \n    } \n"),o+="    tile_featureColor = featureProperties; \n    tile_featureSt = st; \n}"):o="varying vec2 tile_featureSt; \nvoid main() \n{ \n    tile_color(vec4(1.0)); \n    tile_featureSt = computeSt("+e+"); \n}",a+"\n"+B(n)+o}}},A.prototype.getFragmentShaderCallback=function(t,e,r){if(0!==this.featuresLength)return function(n){return n=z(n,e,!0),y.Z.maximumVertexTextureImageUnits>0?(n+="uniform sampler2D tile_pickTexture; \nvarying vec2 tile_featureSt; \nvarying vec4 tile_featureColor; \nvoid main() \n{ \n    tile_color(tile_featureColor); \n",r&&(n+="    gl_FragColor.rgb *= gl_FragColor.a; \n"),n+="}"):(t&&(n+="uniform bool tile_translucentCommand; \n"),n+="uniform sampler2D tile_pickTexture; \nuniform sampler2D tile_batchTexture; \nvarying vec2 tile_featureSt; \nvoid main() \n{ \n    vec4 featureProperties = texture2D(tile_batchTexture, tile_featureSt); \n    if (featureProperties.a == 0.0) { \n        discard; \n    } \n",t&&(n+="    bool isStyleTranslucent = (featureProperties.a != 1.0); \n    if (czm_pass == czm_passTranslucent) \n    { \n        if (!isStyleTranslucent && !tile_translucentCommand) \n        { \n            discard; \n        } \n    } \n    else \n    { \n        if (isStyleTranslucent) \n        { \n            discard; \n        } \n    } \n"),n+="    tile_color(featureProperties); \n",r&&(n+="    gl_FragColor.rgb *= gl_FragColor.a; \n"),n+="} \n"),n}},A.prototype.getClassificationFragmentShaderCallback=function(){if(0!==this.featuresLength)return function(t){return t=Z.Z.replaceMain(t,"tile_main"),y.Z.maximumVertexTextureImageUnits>0?t+="uniform sampler2D tile_pickTexture;\nvarying vec2 tile_featureSt; \nvarying vec4 tile_featureColor; \nvoid main() \n{ \n    tile_main(); \n    gl_FragColor = tile_featureColor; \n    gl_FragColor.rgb *= gl_FragColor.a; \n}":t+="uniform sampler2D tile_batchTexture; \nuniform sampler2D tile_pickTexture;\nvarying vec2 tile_featureSt; \nvoid main() \n{ \n    tile_main(); \n    vec4 featureProperties = texture2D(tile_batchTexture, tile_featureSt); \n    if (featureProperties.a == 0.0) { \n        discard; \n    } \n    gl_FragColor = featureProperties; \n    gl_FragColor.rgb *= gl_FragColor.a; \n} \n",t}},A.prototype.getUniformMapCallback=function(){if(0!==this.featuresLength){var t=this;return function(e){var r={tile_batchTexture:function(){return(0,c.Z)(t._batchTexture.batchTexture,t._batchTexture.defaultTexture)},tile_textureDimensions:function(){return t._batchTexture.textureDimensions},tile_textureStep:function(){return t._batchTexture.textureStep},tile_colorBlend:function(){return G(t)},tile_pickTexture:function(){return t._batchTexture.pickTexture}};return(0,s.Z)(e,r)}}},A.prototype.getPickId=function(){return"texture2D(tile_pickTexture, tile_featureSt)"};var K={ALL_OPAQUE:0,ALL_TRANSLUCENT:1,OPAQUE_AND_TRANSLUCENT:2};function Y(t){var e=t._batchTexture.translucentFeaturesLength;return 0===e?K.ALL_OPAQUE:e===t.featuresLength?K.ALL_TRANSLUCENT:K.OPAQUE_AND_TRANSLUCENT}function X(t){var e=b.Z.shallowClone(t),r=e.pass===g.Z.TRANSLUCENT;return e.uniformMap=(0,u.Z)(e.uniformMap)?e.uniformMap:{},e.uniformMap.tile_translucentCommand=function(){return r},e}function j(t){var e=b.Z.shallowClone(t);return e.pass=g.Z.TRANSLUCENT,e.renderState=$(t.renderState),e}function V(t){var e=b.Z.shallowClone(t);return e.renderState=tt(t.renderState),e}function Q(t,e){var r=t.shaderCache.getDerivedShaderProgram(e,"zBackfaceLogDepth");if(!(0,u.Z)(r)){var n=e.fragmentShaderSource.clone();n.defines=(0,u.Z)(n.defines)?n.defines.slice(0):[],n.defines.push("POLYGON_OFFSET"),n.sources.unshift("#ifdef GL_OES_standard_derivatives\n#extension GL_OES_standard_derivatives : enable\n#endif\n"),r=t.shaderCache.createDerivedShaderProgram(e,"zBackfaceLogDepth",{vertexShaderSource:e.vertexShaderSource,fragmentShaderSource:n,attributeLocations:e._attributeLocations})}return r}function q(t,e){var r=b.Z.shallowClone(e),i=(0,o.Z)(r.renderState,!0);i.cull.enabled=!0,i.cull.face=S.Z.FRONT,i.colorMask={red:!1,green:!1,blue:!1,alpha:!1},i.polygonOffset={enabled:!0,factor:5,units:5},i.stencilTest=I.Z.setCesium3DTileBit(),i.stencilMask=I.Z.CESIUM_3D_TILE_MASK,r.renderState=d.Z.fromCache(i),r.castShadows=!1,r.receiveShadows=!1,r.uniformMap=(0,o.Z)(e.uniformMap);var a=new n.Z(5,5);return r.uniformMap.u_polygonOffset=function(){return a},r.shaderProgram=Q(t,e.shaderProgram),r}function W(t,e){var r=b.Z.shallowClone(t),n=(0,o.Z)(r.renderState,!0);return n.stencilTest.enabled=!0,n.stencilTest.mask=I.Z.SKIP_LOD_MASK,n.stencilTest.reference=I.Z.CESIUM_3D_TILE_MASK|e<<I.Z.SKIP_LOD_BIT_SHIFT,n.stencilTest.frontFunction=L.Z.GREATER_OR_EQUAL,n.stencilTest.frontOperation.zPass=x.Z.REPLACE,n.stencilTest.backFunction=L.Z.GREATER_OR_EQUAL,n.stencilTest.backOperation.zPass=x.Z.REPLACE,n.stencilMask=I.Z.CESIUM_3D_TILE_MASK|I.Z.SKIP_LOD_MASK,r.renderState=d.Z.fromCache(n),r}function J(t){var e=t.renderState.stencilTest.reference;return(e&I.Z.SKIP_LOD_MASK)>>>I.Z.SKIP_LOD_BIT_SHIFT}function $(t){var e=(0,o.Z)(t,!0);return e.cull.enabled=!1,e.depthTest.enabled=!0,e.depthMask=!1,e.blending=v.Z.ALPHA_BLEND,e.stencilTest=I.Z.setCesium3DTileBit(),e.stencilMask=I.Z.CESIUM_3D_TILE_MASK,d.Z.fromCache(e)}function tt(t){var e=(0,o.Z)(t,!0);return e.stencilTest=I.Z.setCesium3DTileBit(),e.stencilMask=I.Z.CESIUM_3D_TILE_MASK,d.Z.fromCache(e)}A.prototype.addDerivedCommands=function(t,e){for(var r=t.commandList,n=r.length,i=this._content._tile,o=i._finalResolution,a=i.tileset,s=a._skipLevelOfDetail&&a._hasMixedContent&&t.context.stencilBuffer,c=Y(this),l=e;l<n;++l){var f=r[l],h=f.derivedCommands.tileset;(0,u.Z)(h)&&!f.dirty||(h={},f.derivedCommands.tileset=h,h.originalCommand=X(f),f.dirty=!1);var p=h.originalCommand;c!==K.ALL_OPAQUE&&f.pass!==g.Z.TRANSLUCENT&&((0,u.Z)(h.translucent)||(h.translucent=j(p))),c!==K.ALL_TRANSLUCENT&&f.pass!==g.Z.TRANSLUCENT&&((0,u.Z)(h.opaque)||(h.opaque=V(p)),s&&(o||((0,u.Z)(h.zback)||(h.zback=q(t.context,p)),a._backfaceCommands.push(h.zback)),(0,u.Z)(h.stencil)&&i._selectionDepth===J(h.stencil)||(f.renderState.depthMask?h.stencil=W(p,i._selectionDepth):h.stencil=h.opaque)));var _=s?h.stencil:h.opaque,y=h.translucent;f.pass!==g.Z.TRANSLUCENT?(c===K.ALL_OPAQUE&&(r[l]=_),c===K.ALL_TRANSLUCENT&&(r[l]=y),c===K.OPAQUE_AND_TRANSLUCENT&&(r[l]=_,r.push(y))):r[l]=p}},A.prototype.update=function(t,e){this._batchTexture.update(t,e)},A.prototype.isDestroyed=function(){return!1},A.prototype.destroy=function(){return this._batchTexture=this._batchTexture&&this._batchTexture.destroy(),(0,f.Z)(this)},e["Z"]=A},95401:function(t,e){var r={HIGHLIGHT:0,REPLACE:1,MIX:2};e["Z"]=Object.freeze(r)},21574:function(t,e,r){var n=r(12572);function i(){this.featurePropertiesDirty=!1}Object.defineProperties(i.prototype,{featuresLength:{get:function(){n.Z.throwInstantiationError()}},pointsLength:{get:function(){n.Z.throwInstantiationError()}},trianglesLength:{get:function(){n.Z.throwInstantiationError()}},geometryByteLength:{get:function(){n.Z.throwInstantiationError()}},texturesByteLength:{get:function(){n.Z.throwInstantiationError()}},batchTableByteLength:{get:function(){n.Z.throwInstantiationError()}},innerContents:{get:function(){n.Z.throwInstantiationError()}},readyPromise:{get:function(){n.Z.throwInstantiationError()}},tileset:{get:function(){n.Z.throwInstantiationError()}},tile:{get:function(){n.Z.throwInstantiationError()}},url:{get:function(){n.Z.throwInstantiationError()}},batchTable:{get:function(){n.Z.throwInstantiationError()}},groupMetadata:{get:function(){n.Z.throwInstantiationError()},set:function(t){n.Z.throwInstantiationError()}}}),i.prototype.hasProperty=function(t,e){n.Z.throwInstantiationError()},i.prototype.getFeature=function(t){n.Z.throwInstantiationError()},i.prototype.applyDebugSettings=function(t,e){n.Z.throwInstantiationError()},i.prototype.applyStyle=function(t){n.Z.throwInstantiationError()},i.prototype.update=function(t,e){n.Z.throwInstantiationError()},i.prototype.isDestroyed=function(){n.Z.throwInstantiationError()},i.prototype.destroy=function(){n.Z.throwInstantiationError()}},95563:function(t,e,r){var n=r(68524),i=r(67984),o=r(16962),a=r(30413),s=r(6652),c=r(83472),u=r(8707),l=r(85794),f=r(41023),h=r(9407),p={b3dm:function(t,e,r,i,o){return new n.Z(t,e,r,i,o)},pnts:function(t,e,r,n,i){return new u.Z(t,e,r,n,i)},i3dm:function(t,e,r,n,i){return new c.Z(t,e,r,n,i)},cmpt:function(t,e,r,n,o){return new i.Z(t,e,r,n,o,p)},externalTileset:function(t,e,r,n){return new l.Z(t,e,r,n)},geom:function(t,e,r,n,i){return new o.Z(t,e,r,n,i)},vctr:function(t,e,r,n,i){return new f.Z(t,e,r,n,i)},subt:function(t,e,r,n,i){return new s.Z(t,e,r,n,i)},glb:function(t,e,r,n,i){var o=n.byteLength;if(o<12)throw new h.Z("Invalid glb content");var s=new DataView(n,i),c=s.getUint32(8,!0),u=new Uint8Array(n,i,c);return new a.Z(t,e,r,u)},gltf:function(t,e,r,n){return new a.Z(t,e,r,n)}};e["Z"]=p},96706:function(t,e){var r={UNLOADED:0,LOADING:1,PROCESSING:2,READY:3,EXPIRED:4,FAILED:5};e["Z"]=Object.freeze(r)},41059:function(t,e){var r={BATCHED_3D_MODEL:"b3dm",INSTANCED_3D_MODEL:"i3dm",COMPOSITE:"cmpt",POINT_CLOUD:"pnts",VECTOR:"vctr",GEOMETRY:"geom",GLTF:"gltf",GLTF_BINARY:"glb",IMPLICIT_SUBTREE:"subt",EXTERNAL_TILESET:"externalTileset",MULTIPLE_CONTENT:"multipleContent",isBinaryFormat:function(t){switch(t){case r.BATCHED_3D_MODEL:case r.INSTANCED_3D_MODEL:case r.COMPOSITE:case r.POINT_CLOUD:case r.VECTOR:case r.GEOMETRY:case r.IMPLICIT_SUBTREE:case r.GLTF_BINARY:return!0;default:return!1}}};e["Z"]=Object.freeze(r)},52381:function(t,e,r){var n=r(59947),i=r(82982);function o(t,e){this._content=t,this._batchId=e,this._color=void 0}Object.defineProperties(o.prototype,{show:{get:function(){return this._content.batchTable.getShow(this._batchId)},set:function(t){this._content.batchTable.setShow(this._batchId,t)}},color:{get:function(){return(0,i.Z)(this._color)||(this._color=new n.Z),this._content.batchTable.getColor(this._batchId,this._color)},set:function(t){this._content.batchTable.setColor(this._batchId,t)}},polylinePositions:{get:function(){if((0,i.Z)(this._content.getPolylinePositions))return this._content.getPolylinePositions(this._batchId)}},content:{get:function(){return this._content}},tileset:{get:function(){return this._content.tileset}},primitive:{get:function(){return this._content.tileset}},pickId:{get:function(){return this._content.batchTable.getPickColor(this._batchId)}}}),o.prototype.hasProperty=function(t){return this._content.batchTable.hasProperty(this._batchId,t)},o.prototype.getPropertyNames=function(t){return this._content.batchTable.getPropertyNames(this._batchId,t)},o.prototype.getProperty=function(t){return this._content.batchTable.getProperty(this._batchId,t)},o.getPropertyInherited=function(t,e,r){var n,o=t.batchTable;if((0,i.Z)(o)&&(n=o.getProperty(e,r),(0,i.Z)(n)))return n;var a=t.tile.metadata;if((0,i.Z)(a)){if(n=a.getPropertyBySemantic(r),(0,i.Z)(n))return n;if(n=a.getProperty(r),(0,i.Z)(n))return n}var s=t.groupMetadata;if((0,i.Z)(s)){if(n=s.getPropertyBySemantic(r),(0,i.Z)(n))return n;if(n=s.getProperty(r),(0,i.Z)(n))return n}var c=t.tileset.metadata;if((0,i.Z)(c)&&(0,i.Z)(c.tileset)){if(c=c.tileset,n=c.getPropertyBySemantic(r),(0,i.Z)(n))return n;if(n=c.getProperty(r),(0,i.Z)(n))return n}},o.prototype.getPropertyInherited=function(t){return o.getPropertyInherited(this._content,this._batchId,t)},o.prototype.setProperty=function(t,e){this._content.batchTable.setProperty(this._batchId,t,e),this._content.featurePropertiesDirty=!0},o.prototype.isExactClass=function(t){return this._content.batchTable.isExactClass(this._batchId,t)},o.prototype.isClass=function(t){return this._content.batchTable.isClass(this._batchId,t)},o.prototype.getExactClassName=function(){return this._content.batchTable.getExactClassName(this._batchId)},e["Z"]=o},79553:function(t,e,r){var n=r(84828),i=r(62200),o=r(82982);function a(t,e){this.json=t,this.buffer=e,this._cachedTypedArrays={},this.featuresLength=0}function s(t,e,r,i,a,s){var c=t._cachedTypedArrays,u=c[e];return(0,o.Z)(u)||(u=n.Z.createArrayBufferView(r,t.buffer.buffer,t.buffer.byteOffset+s,a*i),c[e]=u),u}function c(t,e,r,i){var a=t._cachedTypedArrays,s=a[e];return(0,o.Z)(s)||(s=n.Z.createTypedArray(r,i),a[e]=s),s}a.prototype.getGlobalProperty=function(t,e,r){var a=this.json[t];if((0,o.Z)(a))return(0,o.Z)(a.byteOffset)?(e=(0,i.Z)(e,n.Z.UNSIGNED_INT),r=(0,i.Z)(r,1),s(this,t,e,r,1,a.byteOffset)):a},a.prototype.getPropertyArray=function(t,e,r){var i=this.json[t];if((0,o.Z)(i))return(0,o.Z)(i.byteOffset)?((0,o.Z)(i.componentType)&&(e=n.Z.fromName(i.componentType)),s(this,t,e,r,this.featuresLength,i.byteOffset)):c(this,t,e,i)},a.prototype.getProperty=function(t,e,r,n,i){var a=this.json[t];if((0,o.Z)(a)){var s=this.getPropertyArray(t,e,r);if(1===r)return s[n];for(var c=0;c<r;++c)i[c]=s[r*n+c];return i}},e["Z"]=a}}]);
//# sourceMappingURL=chunk-vendors-ff9d5eae.5da36a46.js.map