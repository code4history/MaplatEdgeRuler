"use strict";const j=require("robust-predicates"),p=require("./BitSet.cjs");function E(f){return f%3===2?f-2:f+1}function m(f){return f%3===0?f+2:f-1}const S=class S{constructor(t,i){if(!t||typeof t!="object"||!t.triangles||!t.halfedges||!t.coords)throw new Error("Expected an object with Delaunator output");if(t.triangles.length%3||t.halfedges.length!==t.triangles.length||t.coords.length%2)throw new Error("Delaunator output appears inconsistent");if(t.triangles.length<3)throw new Error("No edges in triangulation");this.del=t;const e=2**32-1,n=t.coords.length>>1,s=t.triangles.length;this.vertMap=new Uint32Array(n).fill(e),this.flips=new p.BitSet8(s),this.consd=new p.BitSet8(s);for(let r=0;r<s;r++){const o=t.triangles[r];this.vertMap[o]===e&&this.updateVert(r)}i&&this.constrainAll(i)}constrainOne(t,i){const{triangles:e,halfedges:n}=this.del,s=this.vertMap,r=this.consd,o=s[t];let a=o;do{const c=e[a],w=E(a);if(c===i)return this.protect(a);const d=m(a),g=e[d];if(g===i)return this.protect(w),w;if(this.intersectSegments(t,i,g,c)){a=d;break}a=n[w]}while(a!==-1&&a!==o);let h=a,l=-1;for(;a!==-1;){const c=n[a],w=m(a),d=m(c),g=E(c);if(c===-1)throw new Error("Constraining edge exited the hull");if(r.has(a))throw new Error("Edge intersects already constrained edge");if(this.isCollinear(t,i,e[a])||this.isCollinear(t,i,e[c]))throw new Error("Constraining edge intersects point");if(!this.intersectSegments(e[a],e[c],e[w],e[d])){if(l===-1&&(l=a),e[d]===i){if(a===l)throw new Error("Infinite loop: non-convex quadrilateral");a=l,l=-1;continue}if(this.intersectSegments(t,i,e[d],e[c]))a=d;else if(this.intersectSegments(t,i,e[g],e[d]))a=g;else if(l===a)throw new Error("Infinite loop: no further intersect after non-convex");continue}if(this.flipDiagonal(a),this.intersectSegments(t,i,e[w],e[d])&&(l===-1&&(l=w),l===w))throw new Error("Infinite loop: flipped diagonal still intersects");e[d]===i?(h=d,a=l,l=-1):this.intersectSegments(t,i,e[g],e[d])&&(a=g)}const u=this.flips;this.protect(h);do{var v=0;u.forEach(c=>{u.delete(c);const w=n[c];w!==-1&&(u.delete(w),this.isDelaunay(c)||(this.flipDiagonal(c),v++))})}while(v>0);return this.findEdge(t,i)}delaunify(t=!1){const i=this.del.halfedges,e=this.flips,n=this.consd,s=i.length;do{var r=0;for(let o=0;o<s;o++){if(n.has(o))continue;e.delete(o);const a=i[o];a!==-1&&(e.delete(a),this.isDelaunay(o)||(this.flipDiagonal(o),r++))}}while(t&&r>0);return this}constrainAll(t){const i=t.length;for(let e=0;e<i;e++){const n=t[e];this.constrainOne(n[0],n[1])}return this}isConstrained(t){return this.consd.has(t)}findEdge(t,i){const e=this.vertMap[i],{triangles:n,halfedges:s}=this.del;let r=e,o=-1;do{if(n[r]===t)return r;o=E(r),r=s[o]}while(r!==-1&&r!==e);return n[E(o)]===t?-o:1/0}protect(t){const i=this.del.halfedges[t],e=this.flips,n=this.consd;return e.delete(t),n.add(t),i!==-1?(e.delete(i),n.add(i),i):-t}markFlip(t){const i=this.del.halfedges,e=this.flips;if(this.consd.has(t))return!1;const s=i[t];return s!==-1&&(e.add(t),e.add(s)),!0}flipDiagonal(t){const{triangles:i,halfedges:e}=this.del,n=this.flips,s=this.consd,r=e[t],o=m(t),a=E(t),h=m(r),l=E(r),u=e[o],v=e[h];if(s.has(t))throw new Error("Trying to flip a constrained edge");return i[t]=i[h],e[t]=v,n.set(t,n.has(h))||s.set(t,s.has(h)),v!==-1&&(e[v]=t),e[o]=h,i[r]=i[o],e[r]=u,n.set(r,n.has(o))||s.set(r,s.has(o)),u!==-1&&(e[u]=r),e[h]=o,this.markFlip(t),this.markFlip(a),this.markFlip(r),this.markFlip(l),n.add(o),s.delete(o),n.add(h),s.delete(h),this.updateVert(t),this.updateVert(a),this.updateVert(r),this.updateVert(l),o}isDelaunay(t){const{triangles:i,halfedges:e}=this.del,n=e[t];if(n===-1)return!0;const s=i[m(t)],r=i[t],o=i[E(t)],a=i[m(n)];return!this.inCircle(s,r,o,a)}updateVert(t){const{triangles:i,halfedges:e}=this.del,n=this.vertMap,s=i[t];let r=m(t),o=e[r];for(;o!==-1&&o!==t;)r=m(o),o=e[r];return n[s]=r,r}intersectSegments(t,i,e,n){const s=this.del.coords;return t===e||t===n||i===e||i===n?!1:D(s[t*2],s[t*2+1],s[i*2],s[i*2+1],s[e*2],s[e*2+1],s[n*2],s[n*2+1])}inCircle(t,i,e,n){const s=this.del.coords;return j.incircle(s[t*2],s[t*2+1],s[i*2],s[i*2+1],s[e*2],s[e*2+1],s[n*2],s[n*2+1])<0}isCollinear(t,i,e){const n=this.del.coords;return j.orient2d(n[t*2],n[t*2+1],n[i*2],n[i*2+1],n[e*2],n[e*2+1])===0}};S.intersectSegments=D;let M=S;function D(f,t,i,e,n,s,r,o){const a=j.orient2d(f,t,n,s,r,o),h=j.orient2d(i,e,n,s,r,o);if(a>0&&h>0||a<0&&h<0)return!1;const l=j.orient2d(n,s,f,t,i,e),u=j.orient2d(r,o,f,t,i,e);return l>0&&u>0||l<0&&u<0?!1:a===0&&h===0&&l===0&&u===0?!(Math.max(n,r)<Math.min(f,i)||Math.max(f,i)<Math.min(n,r)||Math.max(s,o)<Math.min(t,e)||Math.max(t,e)<Math.min(s,o)):!0}module.exports=M;