"use strict";(self["webpackChunkvue3_webpack5"]=self["webpackChunkvue3_webpack5"]||[]).push([[3347],{8403:function(e,i,t){var n=t(60216),r=t(82982),s=t(99417),a=t(89917);function o(){this.enabled=!0,this.density=2e-4,this.screenSpaceErrorFactor=2,this.minimumBrightness=.03}for(var m=[359.393,800.749,1275.6501,2151.1192,3141.7763,4777.5198,6281.2493,12364.307,15900.765,49889.0549,78026.8259,99260.7344,120036.3873,151011.0158,156091.1953,203849.3112,274866.9803,319916.3149,493552.0528,628733.5874],d=[2e-5,2e-4,1e-4,7e-5,5e-5,4e-5,3e-5,19e-6,1e-5,85e-7,62e-7,58e-7,53e-7,52e-7,51e-7,42e-7,4e-6,34e-7,26e-7,22e-7],u=0;u<d.length;++u)d[u]*=1e6;for(var h=d[1],c=d[d.length-1],f=0;f<d.length;++f)d[f]=(d[f]-c)/(h-c);var p=0;function l(e){var i,t=m,n=t.length;if(e<t[0])return p=0,p;if(e>t[n-1])return p=n-2,p;if(e>=t[p]){if(p+1<n&&e<t[p+1])return p;if(p+2<n&&e<t[p+2])return++p,p}else if(p-1>=0&&e>=t[p-1])return--p,p;for(i=0;i<n-2;++i)if(e>=t[i]&&e<t[i+1])break;return p=i,p}var v=new n.Z;o.prototype.update=function(e){var i=e.fog.enabled=this.enabled;if(i){var t=e.camera,o=t.positionCartographic;if(!(0,r.Z)(o)||o.height>8e5||e.mode!==a.Z.SCENE3D)e.fog.enabled=!1;else{var u=o.height,f=l(u),p=s.Z.clamp((u-m[f])/(m[f+1]-m[f]),0,1),_=s.Z.lerp(d[f],d[f+1],p),g=1e6*this.density,w=g/h*c;_=_*(g-w)*1e-6;var P=n.Z.normalize(t.positionWC,v),R=Math.abs(n.Z.dot(t.directionWC,P));_*=1-R,e.fog.density=_,e.fog.sse=this.screenSpaceErrorFactor,e.fog.minimumBrightness=this.minimumBrightness}}},i["Z"]=o},84725:function(e,i,t){var n=t(62200),r=t(82982),s=t(86511),a=t(12572),o=t(14459),m=t(59081),d=t(4877);function u(e){if(!(0,r.Z)(e)||!(0,r.Z)(e.scene))throw new a.Z("options.scene is required.");this._scene=e.scene,this.samplingWindow=(0,n.Z)(e.samplingWindow,u.defaultSettings.samplingWindow),this.quietPeriod=(0,n.Z)(e.quietPeriod,u.defaultSettings.quietPeriod),this.warmupPeriod=(0,n.Z)(e.warmupPeriod,u.defaultSettings.warmupPeriod),this.minimumFrameRateDuringWarmup=(0,n.Z)(e.minimumFrameRateDuringWarmup,u.defaultSettings.minimumFrameRateDuringWarmup),this.minimumFrameRateAfterWarmup=(0,n.Z)(e.minimumFrameRateAfterWarmup,u.defaultSettings.minimumFrameRateAfterWarmup),this._lowFrameRate=new o.Z,this._nominalFrameRate=new o.Z,this._frameTimes=[],this._needsQuietPeriod=!0,this._quietPeriodEndTime=0,this._warmupPeriodEndTime=0,this._frameRateIsLow=!1,this._lastFramesPerSecond=void 0,this._pauseCount=0;var i=this;this._preUpdateRemoveListener=this._scene.preUpdate.addEventListener((function(e,t){h(i,t)})),this._hiddenPropertyName=void 0!==document.hidden?"hidden":void 0!==document.mozHidden?"mozHidden":void 0!==document.msHidden?"msHidden":void 0!==document.webkitHidden?"webkitHidden":void 0;var t=void 0!==document.hidden?"visibilitychange":void 0!==document.mozHidden?"mozvisibilitychange":void 0!==document.msHidden?"msvisibilitychange":void 0!==document.webkitHidden?"webkitvisibilitychange":void 0;function s(){c(i)}this._visibilityChangeRemoveListener=void 0,(0,r.Z)(t)&&(document.addEventListener(t,s,!1),this._visibilityChangeRemoveListener=function(){document.removeEventListener(t,s,!1)})}function h(e,i){if(!(e._pauseCount>0)){var t=(0,m.Z)();if(e._needsQuietPeriod)e._needsQuietPeriod=!1,e._frameTimes.length=0,e._quietPeriodEndTime=t+e.quietPeriod/d.Z.SECONDS_PER_MILLISECOND,e._warmupPeriodEndTime=e._quietPeriodEndTime+(e.warmupPeriod+e.samplingWindow)/d.Z.SECONDS_PER_MILLISECOND;else if(t>=e._quietPeriodEndTime){e._frameTimes.push(t);var n=t-e.samplingWindow/d.Z.SECONDS_PER_MILLISECOND;if(e._frameTimes.length>=2&&e._frameTimes[0]<=n){while(e._frameTimes.length>=2&&e._frameTimes[1]<n)e._frameTimes.shift();var r=(t-e._frameTimes[0])/(e._frameTimes.length-1);e._lastFramesPerSecond=1e3/r;var s=1e3/(t>e._warmupPeriodEndTime?e.minimumFrameRateAfterWarmup:e.minimumFrameRateDuringWarmup);r>s?e._frameRateIsLow||(e._frameRateIsLow=!0,e._needsQuietPeriod=!0,e.lowFrameRate.raiseEvent(e.scene,e._lastFramesPerSecond)):e._frameRateIsLow&&(e._frameRateIsLow=!1,e._needsQuietPeriod=!0,e.nominalFrameRate.raiseEvent(e.scene,e._lastFramesPerSecond))}}}}function c(e){document[e._hiddenPropertyName]?e.pause():e.unpause()}u.defaultSettings={samplingWindow:5,quietPeriod:2,warmupPeriod:5,minimumFrameRateDuringWarmup:4,minimumFrameRateAfterWarmup:8},u.fromScene=function(e){if(!(0,r.Z)(e))throw new a.Z("scene is required.");return(0,r.Z)(e._frameRateMonitor)&&!e._frameRateMonitor.isDestroyed()||(e._frameRateMonitor=new u({scene:e})),e._frameRateMonitor},Object.defineProperties(u.prototype,{scene:{get:function(){return this._scene}},lowFrameRate:{get:function(){return this._lowFrameRate}},nominalFrameRate:{get:function(){return this._nominalFrameRate}},lastFramesPerSecond:{get:function(){return this._lastFramesPerSecond}}}),u.prototype.pause=function(){++this._pauseCount,1===this._pauseCount&&(this._frameTimes.length=0,this._lastFramesPerSecond=void 0)},u.prototype.unpause=function(){--this._pauseCount,this._pauseCount<=0&&(this._pauseCount=0,this._needsQuietPeriod=!0)},u.prototype.isDestroyed=function(){return!1},u.prototype.destroy=function(){return this._preUpdateRemoveListener(),(0,r.Z)(this._visibilityChangeRemoveListener)&&this._visibilityChangeRemoveListener(),(0,s.Z)(this)},i["Z"]=u},85079:function(e,i,t){var n=t(89917);function r(e,i,t){this.context=e,this.commandList=[],this.shadowMaps=[],this.brdfLutGenerator=void 0,this.environmentMap=void 0,this.sphericalHarmonicCoefficients=void 0,this.specularEnvironmentMaps=void 0,this.specularEnvironmentMapsMaximumLOD=void 0,this.mode=n.Z.SCENE3D,this.morphTime=n.Z.getMorphTime(n.Z.SCENE3D),this.frameNumber=0,this.newFrame=!1,this.time=void 0,this.jobScheduler=t,this.mapProjection=void 0,this.camera=void 0,this.cameraUnderground=!1,this.globeTranslucencyState=void 0,this.cullingVolume=void 0,this.occluder=void 0,this.maximumScreenSpaceError=void 0,this.pixelRatio=1,this.passes={render:!1,pick:!1,depth:!1,postProcess:!1,offscreen:!1},this.creditDisplay=i,this.afterRender=[],this.scene3DOnly=!1,this.fog={enabled:!1,density:void 0,sse:void 0,minimumBrightness:void 0},this.terrainExaggeration=1,this.terrainExaggerationRelativeHeight=0,this.shadowState={shadowsEnabled:!0,shadowMaps:[],lightShadowMaps:[],nearPlane:1,farPlane:5e3,closestObjectSize:1e3,lastDirtyTime:0,outOfView:!0},this.imagerySplitPosition=0,this.frustumSplits=[],this.backgroundColor=void 0,this.light=void 0,this.minimumDisableDepthTestDistance=void 0,this.invertClassification=!1,this.invertClassificationColor=void 0,this.useLogDepth=!1,this.tilesetPassState=void 0,this.minimumTerrainHeight=0}i["Z"]=r}}]);
//# sourceMappingURL=chunk-vendors-4f62dd89-legacy.936eb41b.js.map