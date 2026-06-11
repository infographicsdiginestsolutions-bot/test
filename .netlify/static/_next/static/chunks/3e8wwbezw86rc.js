(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,51710,e=>{"use strict";var t=e.i(43476),r=e.i(71645),i=e.i(75056),a=e.i(25234),o=e.i(28600),n=e.i(53190),s=e.i(90072);let l=parseInt(s.REVISION.replace(/\D+/g,""));class u extends s.ShaderMaterial{constructor(){super({uniforms:{time:{value:0},fade:{value:1}},vertexShader:`
      uniform float time;
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
        gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(time + 100.0));
        gl_Position = projectionMatrix * mvPosition;
      }`,fragmentShader:`
      uniform sampler2D pointTexture;
      uniform float fade;
      varying vec3 vColor;
      void main() {
        float opacity = 1.0;
        if (fade == 1.0) {
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
        }
        gl_FragColor = vec4(vColor, opacity);

        #include <tonemapping_fragment>
	      #include <${l>=154?"colorspace_fragment":"encodings_fragment"}>
      }`})}}let h=e=>new s.Vector3().setFromSpherical(new s.Spherical(e,Math.acos(1-2*Math.random()),2*Math.random()*Math.PI)),m=r.forwardRef(({radius:e=100,depth:t=50,count:i=5e3,saturation:o=0,factor:n=4,fade:l=!1,speed:m=1},f)=>{let d=r.useRef(null),[c,v,p]=r.useMemo(()=>{let r=[],a=[],l=Array.from({length:i},()=>(.5+.5*Math.random())*n),u=new s.Color,m=e+t,f=t/i;for(let e=0;e<i;e++)m-=f*Math.random(),r.push(...h(m).toArray()),u.setHSL(e/i,o,.9),a.push(u.r,u.g,u.b);return[new Float32Array(r),new Float32Array(a),new Float32Array(l)]},[i,t,n,e,o]);(0,a.useFrame)(e=>d.current&&(d.current.uniforms.time.value=e.clock.elapsedTime*m));let[x]=r.useState(()=>new u);return r.createElement("points",{ref:f},r.createElement("bufferGeometry",null,r.createElement("bufferAttribute",{attach:"attributes-position",args:[c,3]}),r.createElement("bufferAttribute",{attach:"attributes-color",args:[v,3]}),r.createElement("bufferAttribute",{attach:"attributes-size",args:[p,1]})),r.createElement("primitive",{ref:d,object:x,attach:"material",blending:s.AdditiveBlending,"uniforms-fade-value":l,depthWrite:!1,transparent:!0,vertexColors:!0}))});var f=e.i(31067),d=e.i(67335),c=s;class v extends c.ShaderMaterial{constructor(e=new c.Vector2){super({uniforms:{inputBuffer:new c.Uniform(null),depthBuffer:new c.Uniform(null),resolution:new c.Uniform(new c.Vector2),texelSize:new c.Uniform(new c.Vector2),halfTexelSize:new c.Uniform(new c.Vector2),kernel:new c.Uniform(0),scale:new c.Uniform(1),cameraNear:new c.Uniform(0),cameraFar:new c.Uniform(1),minDepthThreshold:new c.Uniform(0),maxDepthThreshold:new c.Uniform(1),depthScale:new c.Uniform(0),depthToBlurRatioBias:new c.Uniform(.25)},fragmentShader:`#include <common>
        #include <dithering_pars_fragment>      
        uniform sampler2D inputBuffer;
        uniform sampler2D depthBuffer;
        uniform float cameraNear;
        uniform float cameraFar;
        uniform float minDepthThreshold;
        uniform float maxDepthThreshold;
        uniform float depthScale;
        uniform float depthToBlurRatioBias;
        varying vec2 vUv;
        varying vec2 vUv0;
        varying vec2 vUv1;
        varying vec2 vUv2;
        varying vec2 vUv3;

        void main() {
          float depthFactor = 0.0;
          
          #ifdef USE_DEPTH
            vec4 depth = texture2D(depthBuffer, vUv);
            depthFactor = smoothstep(minDepthThreshold, maxDepthThreshold, 1.0-(depth.r * depth.a));
            depthFactor *= depthScale;
            depthFactor = max(0.0, min(1.0, depthFactor + 0.25));
          #endif
          
          vec4 sum = texture2D(inputBuffer, mix(vUv0, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv1, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv2, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv3, vUv, depthFactor));
          gl_FragColor = sum * 0.25 ;

          #include <dithering_fragment>
          #include <tonemapping_fragment>
          #include <${l>=154?"colorspace_fragment":"encodings_fragment"}>
        }`,vertexShader:`uniform vec2 texelSize;
        uniform vec2 halfTexelSize;
        uniform float kernel;
        uniform float scale;
        varying vec2 vUv;
        varying vec2 vUv0;
        varying vec2 vUv1;
        varying vec2 vUv2;
        varying vec2 vUv3;

        void main() {
          vec2 uv = position.xy * 0.5 + 0.5;
          vUv = uv;

          vec2 dUv = (texelSize * vec2(kernel) + halfTexelSize) * scale;
          vUv0 = vec2(uv.x - dUv.x, uv.y + dUv.y);
          vUv1 = vec2(uv.x + dUv.x, uv.y + dUv.y);
          vUv2 = vec2(uv.x + dUv.x, uv.y - dUv.y);
          vUv3 = vec2(uv.x - dUv.x, uv.y - dUv.y);

          gl_Position = vec4(position.xy, 1.0, 1.0);
        }`,blending:c.NoBlending,depthWrite:!1,depthTest:!1}),this.toneMapped=!1,this.setTexelSize(e.x,e.y),this.kernel=new Float32Array([0,1,2,2,3])}setTexelSize(e,t){this.uniforms.texelSize.value.set(e,t),this.uniforms.halfTexelSize.value.set(e,t).multiplyScalar(.5)}setResolution(e){this.uniforms.resolution.value.copy(e)}}class p{constructor({gl:e,resolution:t,width:r=500,height:i=500,minDepthThreshold:a=0,maxDepthThreshold:o=1,depthScale:n=0,depthToBlurRatioBias:l=.25}){this.renderToScreen=!1,this.renderTargetA=new s.WebGLRenderTarget(t,t,{minFilter:s.LinearFilter,magFilter:s.LinearFilter,stencilBuffer:!1,depthBuffer:!1,type:s.HalfFloatType}),this.renderTargetB=this.renderTargetA.clone(),this.convolutionMaterial=new v,this.convolutionMaterial.setTexelSize(1/r,1/i),this.convolutionMaterial.setResolution(new s.Vector2(r,i)),this.scene=new s.Scene,this.camera=new s.Camera,this.convolutionMaterial.uniforms.minDepthThreshold.value=a,this.convolutionMaterial.uniforms.maxDepthThreshold.value=o,this.convolutionMaterial.uniforms.depthScale.value=n,this.convolutionMaterial.uniforms.depthToBlurRatioBias.value=l,this.convolutionMaterial.defines.USE_DEPTH=n>0;const u=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),h=new Float32Array([0,0,2,0,0,2]),m=new s.BufferGeometry;m.setAttribute("position",new s.BufferAttribute(u,3)),m.setAttribute("uv",new s.BufferAttribute(h,2)),this.screen=new s.Mesh(m,this.convolutionMaterial),this.screen.frustumCulled=!1,this.scene.add(this.screen)}render(e,t,r){let i,a,o,n=this.scene,s=this.camera,l=this.renderTargetA,u=this.renderTargetB,h=this.convolutionMaterial,m=h.uniforms;m.depthBuffer.value=t.depthTexture;let f=h.kernel,d=t;for(a=0,o=f.length-1;a<o;++a)i=(1&a)==0?l:u,m.kernel.value=f[a],m.inputBuffer.value=d.texture,e.setRenderTarget(i),e.render(n,s),d=i;m.kernel.value=f[a],m.inputBuffer.value=d.texture,e.setRenderTarget(this.renderToScreen?null:r),e.render(n,s)}}var x=s;class g extends x.MeshStandardMaterial{constructor(e={}){super(e),this._tDepth={value:null},this._distortionMap={value:null},this._tDiffuse={value:null},this._tDiffuseBlur={value:null},this._textureMatrix={value:null},this._hasBlur={value:!1},this._mirror={value:0},this._mixBlur={value:0},this._blurStrength={value:.5},this._minDepthThreshold={value:.9},this._maxDepthThreshold={value:1},this._depthScale={value:0},this._depthToBlurRatioBias={value:.25},this._distortion={value:1},this._mixContrast={value:1},this.setValues(e)}onBeforeCompile(e){var t;null!=(t=e.defines)&&t.USE_UV||(e.defines.USE_UV=""),e.uniforms.hasBlur=this._hasBlur,e.uniforms.tDiffuse=this._tDiffuse,e.uniforms.tDepth=this._tDepth,e.uniforms.distortionMap=this._distortionMap,e.uniforms.tDiffuseBlur=this._tDiffuseBlur,e.uniforms.textureMatrix=this._textureMatrix,e.uniforms.mirror=this._mirror,e.uniforms.mixBlur=this._mixBlur,e.uniforms.mixStrength=this._blurStrength,e.uniforms.minDepthThreshold=this._minDepthThreshold,e.uniforms.maxDepthThreshold=this._maxDepthThreshold,e.uniforms.depthScale=this._depthScale,e.uniforms.depthToBlurRatioBias=this._depthToBlurRatioBias,e.uniforms.distortion=this._distortion,e.uniforms.mixContrast=this._mixContrast,e.vertexShader=`
        uniform mat4 textureMatrix;
        varying vec4 my_vUv;
      ${e.vertexShader}`,e.vertexShader=e.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
        my_vUv = textureMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );`),e.fragmentShader=`
        uniform sampler2D tDiffuse;
        uniform sampler2D tDiffuseBlur;
        uniform sampler2D tDepth;
        uniform sampler2D distortionMap;
        uniform float distortion;
        uniform float cameraNear;
			  uniform float cameraFar;
        uniform bool hasBlur;
        uniform float mixBlur;
        uniform float mirror;
        uniform float mixStrength;
        uniform float minDepthThreshold;
        uniform float maxDepthThreshold;
        uniform float mixContrast;
        uniform float depthScale;
        uniform float depthToBlurRatioBias;
        varying vec4 my_vUv;
        ${e.fragmentShader}`,e.fragmentShader=e.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>

      float distortionFactor = 0.0;
      #ifdef USE_DISTORTION
        distortionFactor = texture2D(distortionMap, vUv).r * distortion;
      #endif

      vec4 new_vUv = my_vUv;
      new_vUv.x += distortionFactor;
      new_vUv.y += distortionFactor;

      vec4 base = texture2DProj(tDiffuse, new_vUv);
      vec4 blur = texture2DProj(tDiffuseBlur, new_vUv);

      vec4 merge = base;

      #ifdef USE_NORMALMAP
        vec2 normal_uv = vec2(0.0);
        vec4 normalColor = texture2D(normalMap, vUv * normalScale);
        vec3 my_normal = normalize( vec3( normalColor.r * 2.0 - 1.0, normalColor.b,  normalColor.g * 2.0 - 1.0 ) );
        vec3 coord = new_vUv.xyz / new_vUv.w;
        normal_uv = coord.xy + coord.z * my_normal.xz * 0.05;
        vec4 base_normal = texture2D(tDiffuse, normal_uv);
        vec4 blur_normal = texture2D(tDiffuseBlur, normal_uv);
        merge = base_normal;
        blur = blur_normal;
      #endif

      float depthFactor = 0.0001;
      float blurFactor = 0.0;

      #ifdef USE_DEPTH
        vec4 depth = texture2DProj(tDepth, new_vUv);
        depthFactor = smoothstep(minDepthThreshold, maxDepthThreshold, 1.0-(depth.r * depth.a));
        depthFactor *= depthScale;
        depthFactor = max(0.0001, min(1.0, depthFactor));

        #ifdef USE_BLUR
          blur = blur * min(1.0, depthFactor + depthToBlurRatioBias);
          merge = merge * min(1.0, depthFactor + 0.5);
        #else
          merge = merge * depthFactor;
        #endif

      #endif

      float reflectorRoughnessFactor = roughness;
      #ifdef USE_ROUGHNESSMAP
        vec4 reflectorTexelRoughness = texture2D( roughnessMap, vUv );
        reflectorRoughnessFactor *= reflectorTexelRoughness.g;
      #endif

      #ifdef USE_BLUR
        blurFactor = min(1.0, mixBlur * reflectorRoughnessFactor);
        merge = mix(merge, blur, blurFactor);
      #endif

      vec4 newMerge = vec4(0.0, 0.0, 0.0, 1.0);
      newMerge.r = (merge.r - 0.5) * mixContrast + 0.5;
      newMerge.g = (merge.g - 0.5) * mixContrast + 0.5;
      newMerge.b = (merge.b - 0.5) * mixContrast + 0.5;

      diffuseColor.rgb = diffuseColor.rgb * ((1.0 - min(1.0, mirror)) + newMerge.rgb * mixStrength);
      `)}get tDiffuse(){return this._tDiffuse.value}set tDiffuse(e){this._tDiffuse.value=e}get tDepth(){return this._tDepth.value}set tDepth(e){this._tDepth.value=e}get distortionMap(){return this._distortionMap.value}set distortionMap(e){this._distortionMap.value=e}get tDiffuseBlur(){return this._tDiffuseBlur.value}set tDiffuseBlur(e){this._tDiffuseBlur.value=e}get textureMatrix(){return this._textureMatrix.value}set textureMatrix(e){this._textureMatrix.value=e}get hasBlur(){return this._hasBlur.value}set hasBlur(e){this._hasBlur.value=e}get mirror(){return this._mirror.value}set mirror(e){this._mirror.value=e}get mixBlur(){return this._mixBlur.value}set mixBlur(e){this._mixBlur.value=e}get mixStrength(){return this._blurStrength.value}set mixStrength(e){this._blurStrength.value=e}get minDepthThreshold(){return this._minDepthThreshold.value}set minDepthThreshold(e){this._minDepthThreshold.value=e}get maxDepthThreshold(){return this._maxDepthThreshold.value}set maxDepthThreshold(e){this._maxDepthThreshold.value=e}get depthScale(){return this._depthScale.value}set depthScale(e){this._depthScale.value=e}get depthToBlurRatioBias(){return this._depthToBlurRatioBias.value}set depthToBlurRatioBias(e){this._depthToBlurRatioBias.value=e}get distortion(){return this._distortion.value}set distortion(e){this._distortion.value=e}get mixContrast(){return this._mixContrast.value}set mixContrast(e){this._mixContrast.value=e}}let _=r.forwardRef(({mixBlur:e=0,mixStrength:t=1,resolution:i=256,blur:n=[0,0],minDepthThreshold:l=.9,maxDepthThreshold:u=1,depthScale:h=0,depthToBlurRatioBias:m=.25,mirror:c=0,distortion:v=1,mixContrast:x=1,distortionMap:_,reflectorOffset:S=0,...y},T)=>{(0,d.extend)({MeshReflectorMaterialImpl:g});let M=(0,o.useThree)(({gl:e})=>e),D=(0,o.useThree)(({camera:e})=>e),U=(0,o.useThree)(({scene:e})=>e),B=(n=Array.isArray(n)?n:[n,n])[0]+n[1]>0,w=n[0],b=n[1],F=r.useRef(null);r.useImperativeHandle(T,()=>F.current,[]);let[j]=r.useState(()=>new s.Plane),[R]=r.useState(()=>new s.Vector3),[C]=r.useState(()=>new s.Vector3),[A]=r.useState(()=>new s.Vector3),[E]=r.useState(()=>new s.Matrix4),[P]=r.useState(()=>new s.Vector3(0,0,-1)),[z]=r.useState(()=>new s.Vector4),[V]=r.useState(()=>new s.Vector3),[I]=r.useState(()=>new s.Vector3),[k]=r.useState(()=>new s.Vector4),[L]=r.useState(()=>new s.Matrix4),[G]=r.useState(()=>new s.PerspectiveCamera),W=r.useCallback(()=>{var e;let t=F.current.parent||(null==(e=F.current)||null==(e=e.__r3f.parent)?void 0:e.object);if(!t||(C.setFromMatrixPosition(t.matrixWorld),A.setFromMatrixPosition(D.matrixWorld),E.extractRotation(t.matrixWorld),R.set(0,0,1),R.applyMatrix4(E),C.addScaledVector(R,S),V.subVectors(C,A),V.dot(R)>0))return;V.reflect(R).negate(),V.add(C),E.extractRotation(D.matrixWorld),P.set(0,0,-1),P.applyMatrix4(E),P.add(A),I.subVectors(C,P),I.reflect(R).negate(),I.add(C),G.position.copy(V),G.up.set(0,1,0),G.up.applyMatrix4(E),G.up.reflect(R),G.lookAt(I),G.far=D.far,G.updateMatrixWorld(),G.projectionMatrix.copy(D.projectionMatrix),L.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),L.multiply(G.projectionMatrix),L.multiply(G.matrixWorldInverse),L.multiply(t.matrixWorld),j.setFromNormalAndCoplanarPoint(R,C),j.applyMatrix4(G.matrixWorldInverse),z.set(j.normal.x,j.normal.y,j.normal.z,j.constant);let r=G.projectionMatrix;k.x=(Math.sign(z.x)+r.elements[8])/r.elements[0],k.y=(Math.sign(z.y)+r.elements[9])/r.elements[5],k.z=-1,k.w=(1+r.elements[10])/r.elements[14],z.multiplyScalar(2/z.dot(k)),r.elements[2]=z.x,r.elements[6]=z.y,r.elements[10]=z.z+1,r.elements[14]=z.w},[D,S]),[N,O,H,$]=r.useMemo(()=>{let r={minFilter:s.LinearFilter,magFilter:s.LinearFilter,type:s.HalfFloatType},a=new s.WebGLRenderTarget(i,i,r);a.depthBuffer=!0,a.depthTexture=new s.DepthTexture(i,i),a.depthTexture.format=s.DepthFormat,a.depthTexture.type=s.UnsignedShortType;let o=new s.WebGLRenderTarget(i,i,r),n=new p({gl:M,resolution:i,width:w,height:b,minDepthThreshold:l,maxDepthThreshold:u,depthScale:h,depthToBlurRatioBias:m}),f={mirror:c,textureMatrix:L,mixBlur:e,tDiffuse:a.texture,tDepth:a.depthTexture,tDiffuseBlur:o.texture,hasBlur:B,mixStrength:t,minDepthThreshold:l,maxDepthThreshold:u,depthScale:h,depthToBlurRatioBias:m,distortion:v,distortionMap:_,mixContrast:x,"defines-USE_BLUR":B?"":void 0,"defines-USE_DEPTH":h>0?"":void 0,"defines-USE_DISTORTION":_?"":void 0};return[a,o,n,f]},[M,w,b,L,i,c,B,e,t,l,u,h,m,v,_,x]);return(0,a.useFrame)(()=>{var e;let t=F.current.parent||(null==(e=F.current)||null==(e=e.__r3f.parent)?void 0:e.object);if(!t)return;t.visible=!1;let r=M.xr.enabled,i=M.shadowMap.autoUpdate;W(),M.xr.enabled=!1,M.shadowMap.autoUpdate=!1,M.setRenderTarget(N),M.state.buffers.depth.setMask(!0),M.autoClear||M.clear(),M.render(U,G),B&&H.render(M,N,O),M.xr.enabled=r,M.shadowMap.autoUpdate=i,t.visible=!0,M.setRenderTarget(null)}),r.createElement("meshReflectorMaterialImpl",(0,f.default)({attach:"material",key:"key"+$["defines-USE_BLUR"]+$["defines-USE_DEPTH"]+$["defines-USE_DISTORTION"],ref:F},$,y))});function S({position:e,rotation:i}){let o=(0,r.useRef)(null);return(0,a.useFrame)(({clock:e})=>{o.current&&(o.current.rotation.x=i[0]+.03*Math.sin(.3*e.elapsedTime))}),(0,t.jsxs)("group",{position:e,rotation:i,children:[(0,t.jsxs)("mesh",{ref:o,children:[(0,t.jsx)("boxGeometry",{args:[2.2,.05,1.4]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2e",metalness:.9,roughness:.1})]}),Array.from({length:4}).map((e,r)=>Array.from({length:3}).map((e,i)=>(0,t.jsxs)("mesh",{position:[(r-1.5)*.5,.04,(i-1)*.42],children:[(0,t.jsx)("boxGeometry",{args:[.44,.01,.36]}),(0,t.jsx)("meshStandardMaterial",{color:"#0a1628",metalness:.7,roughness:.2,emissive:"#1a3a6e",emissiveIntensity:.3})]},`${r}-${i}`))),(0,t.jsxs)("mesh",{position:[0,-.4,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.04,.06,.7,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#2a2a3a",metalness:.8,roughness:.3})]})]})}function y(){let e=(0,r.useMemo)(()=>{let e=[];for(let t=-2;t<=2;t++)for(let r=-1;r<=1;r++)e.push({position:[3*t,0,2.5*r],rotation:[-.3+.05*Math.random(),(Math.random()-.5)*.1,0]});return e},[]);return(0,t.jsx)(t.Fragment,{children:e.map((e,r)=>(0,t.jsx)(n.Float,{speed:.5,rotationIntensity:.05,floatIntensity:.1,children:(0,t.jsx)(S,{position:e.position,rotation:e.rotation})},r))})}function T(){let e=(0,r.useRef)(null),i=(0,r.useRef)(null);return(0,a.useFrame)(({clock:e})=>{i.current&&i.current.scale.setScalar(1+.05*Math.sin(.5*e.elapsedTime))}),(0,t.jsxs)("group",{position:[0,5,-10],children:[(0,t.jsxs)("mesh",{ref:e,children:[(0,t.jsx)("sphereGeometry",{args:[1.2,32,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffcc44",emissive:"#ff8800",emissiveIntensity:2})]}),(0,t.jsxs)("mesh",{ref:i,children:[(0,t.jsx)("sphereGeometry",{args:[2.2,32,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#ff8800",transparent:!0,opacity:.15,side:s.BackSide})]}),(0,t.jsx)("pointLight",{color:"#ffaa33",intensity:8,distance:30})]})}function M(){let e=(0,r.useMemo)(()=>{let e=new Float32Array(240);for(let t=0;t<80;t++)e[3*t]=(Math.random()-.5)*20,e[3*t+1]=6*Math.random()-1,e[3*t+2]=(Math.random()-.5)*10;return e},[]),i=(0,r.useRef)(null);return(0,a.useFrame)(({clock:e})=>{if(i.current){let e=i.current.geometry.attributes.position.array;for(let t=0;t<80;t++)e[3*t+1]+=.01,e[3*t+1]>5&&(e[3*t+1]=-1);i.current.geometry.attributes.position.needsUpdate=!0}}),(0,t.jsxs)("points",{ref:i,children:[(0,t.jsx)("bufferGeometry",{children:(0,t.jsx)("bufferAttribute",{attach:"attributes-position",args:[e,3]})}),(0,t.jsx)("pointsMaterial",{color:"#f5a623",size:.04,transparent:!0,opacity:.7,sizeAttenuation:!0})]})}function D(){return(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-.8,0],children:[(0,t.jsx)("planeGeometry",{args:[40,20]}),(0,t.jsx)(_,{blur:[300,100],resolution:1024,mixBlur:1,mixStrength:30,roughness:1,depthScale:1.2,minDepthThreshold:.4,maxDepthThreshold:1.4,color:"#050810",metalness:.5,mirror:0})]})}function U({mouseX:e,mouseY:t}){let{camera:r}=(0,o.useThree)();return(0,a.useFrame)(()=>{r.position.x+=(2*e-r.position.x)*.02,r.position.y+=(+t+1.5-r.position.y)*.02,r.lookAt(0,0,0)}),null}e.s(["default",0,function({mouseX:e,mouseY:r}){return(0,t.jsxs)(i.Canvas,{camera:{position:[0,2,8],fov:55},style:{background:"transparent"},gl:{antialias:!0,alpha:!0},children:[(0,t.jsx)(U,{mouseX:e,mouseY:r}),(0,t.jsx)("ambientLight",{intensity:.3,color:"#1a2040"}),(0,t.jsx)("directionalLight",{position:[5,10,5],intensity:2,color:"#ffcc88",castShadow:!0}),(0,t.jsx)(m,{radius:100,depth:50,count:3e3,factor:3,saturation:0,fade:!0,speed:.5}),(0,t.jsx)(T,{}),(0,t.jsx)(y,{}),(0,t.jsx)(M,{}),(0,t.jsx)(D,{}),(0,t.jsx)("fog",{attach:"fog",args:["#050810",15,35]})]})}],51710)},74025,e=>{e.n(e.i(51710))}]);