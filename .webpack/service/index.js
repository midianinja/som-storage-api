module.exports=function(e){var o={};function r(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=o,r.d=function(e,o,t){r.o(e,o)||Object.defineProperty(e,o,{enumerable:!0,get:t})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,o){if(1&o&&(e=r(e)),8&o)return e;if(4&o&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(r.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&o&&"string"!=typeof e)for(var n in e)r.d(t,n,function(o){return e[o]}.bind(null,n));return t},r.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(o,"a",o),o},r.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},r.p="",r(r.s="./index.js")}({"./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! exports provided: uploadImageFunction, uploadSongFunction, uploadDocumentFunction */function(e,o,r){"use strict";r.r(o),r.d(o,"uploadImageFunction",function(){return u}),r.d(o,"uploadSongFunction",function(){return c}),r.d(o,"uploadDocumentFunction",function(){return d});var t=r(/*! dotenv */"dotenv"),n=r.n(t),i=r(/*! ./src/images */"./src/images.js"),a=r(/*! ./src/songs */"./src/songs.js"),s=r(/*! ./src/documents */"./src/documents.js");n.a.config();const u=i.upload,c=a.upload,d=s.upload},"./src/aws.repository.js":
/*!*******************************!*\
  !*** ./src/aws.repository.js ***!
  \*******************************/
/*! exports provided: default */function(e,o,r){"use strict";r.r(o);var t=r(/*! aws-sdk */"aws-sdk");const n=new(r.n(t).a.S3)({signatureVersion:"v4"});o.default={upload:(e,o,r=null,t="som-dev-storage")=>{console.log("Bucket: ",t);const i={Body:e,Bucket:t,Key:o,ACL:"public-read"};return r&&(i.ContentType=r),new Promise((e,o)=>{n.upload(i,(r,t)=>{r?o(r):e(t)})})}}},"./src/documents.js":
/*!**************************!*\
  !*** ./src/documents.js ***!
  \**************************/
/*! exports provided: upload, remove */function(e,o,r){"use strict";r.r(o),r.d(o,"upload",function(){return n}),r.d(o,"remove",function(){return i});var t=r(/*! ./aws.repository */"./src/aws.repository.js");const n=async e=>{const{file:o,id:r,fileName:n}=JSON.parse(e.body),i=n||`${(new Date).getTime()}.pdf`,a=o.replace(/^data:application\/pdf+;base64,/,"");try{const e=Buffer.from(a,"base64"),o=await t.default.upload(e,`${(()=>`documents/${r}/pdf/${i}`)()}.mp3`,"application/pdf",void 0);return{statusCode:200,body:JSON.stringify({link:o.Location})}}catch(e){return{statusCode:500,body:JSON.stringify({error:{type:"upload_document_error",info:e}})}}},i=e=>{console.log("here",e)}},"./src/images.js":
/*!***********************!*\
  !*** ./src/images.js ***!
  \***********************/
/*! exports provided: upload, remove */function(e,o,r){"use strict";r.r(o),r.d(o,"upload",function(){return p}),r.d(o,"remove",function(){return f});var t=r(/*! base64-img */"base64-img"),n=r.n(t),i=r(/*! imagemin */"imagemin"),a=r.n(i),s=r(/*! imagemin-jpeg-recompress */"imagemin-jpeg-recompress"),u=r.n(s),c=r(/*! fs */"fs"),d=r.n(c),l=r(/*! ./aws.repository */"./src/aws.repository.js");const p=async e=>{const{file:o,id:r}=JSON.parse(e.body),t=`${(new Date).getTime()}`,i=o.replace(/^data:image\/\w+;base64,/,""),s=Buffer.from(i,"base64"),c=e=>`images/${r}/jpg/${e}/${t}`,p=await n.a.imgSync(`data:image/jpg;base64,${i}`,"/tmp/originals/",t);await a()([p],"/tmp/mimifieds/",{plugins:[u()({loops:4,quality:"high"})]}),await a()([p],"/tmp/thumbnails/",{plugins:[u()({loops:4,quality:"low"})]});const f={};console.log("urls: ",f);try{const e=await l.default.upload(s,`${c("originals")}.jpg`,"image/jpeg",void 0);f.original=e.Location}catch(e){return console.log("Orifinal image error",e),{statusCode:500,body:JSON.stringify({error:{type:"upload_original_image",info:e}})}}try{const e=await d.a.readFileSync(`${"/tmp/mimifieds/"+t}.jpg`),o=await l.default.upload(e,`${c("mimifieds")}.jpg`,"image/jpeg",void 0);f.mimified=o.Location}catch(e){return console.log("mimified image error",e),{statusCode:500,body:JSON.stringify({error:{type:"process_mimified_image",info:e}})}}try{const e=await d.a.readFileSync(`${"/tmp/thumbnails/"+t}.jpg`),o=await l.default.upload(e,`${c("thumbnails")}.jpg`,"image/jpeg",void 0);f.thumbnail=o.Location}catch(e){return console.log("upload image error",e),{statusCode:500,body:JSON.stringify({error:{type:"process_thumbnail_image",info:e}})}}return console.log("urls: ",f),{statusCode:200,body:JSON.stringify({urls:f})}},f=e=>{console.log("here",e)}},"./src/songs.js":
/*!**********************!*\
  !*** ./src/songs.js ***!
  \**********************/
/*! exports provided: upload, remove */function(e,o,r){"use strict";r.r(o),r.d(o,"upload",function(){return n}),r.d(o,"remove",function(){return i});var t=r(/*! ./aws.repository */"./src/aws.repository.js");const n=async e=>{const{file:o,id:r}=JSON.parse(e.body),n=`${(new Date).getTime()}`,i=o.replace(/^data:audio\/mp3+;base64,/,"");try{const e=Buffer.from(i,"base64"),o=await t.default.upload(e,`${(()=>`songs/${r}/mp3/${n}`)()}.mp3`,"audio/mp3",void 0);return{statusCode:200,body:JSON.stringify({link:o.Location})}}catch(e){return console.log("Orifinal image error",e),{statusCode:500,body:JSON.stringify({error:{type:"upload_song_error",info:e}})}}},i=e=>{console.log("here",e)}},"aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/*! no static exports found */function(e,o){e.exports=require("aws-sdk")},"base64-img":
/*!*****************************!*\
  !*** external "base64-img" ***!
  \*****************************/
/*! no static exports found */function(e,o){e.exports=require("base64-img")},dotenv:
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */function(e,o){e.exports=require("dotenv")},fs:
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */function(e,o){e.exports=require("fs")},imagemin:
/*!***************************!*\
  !*** external "imagemin" ***!
  \***************************/
/*! no static exports found */function(e,o){e.exports=require("imagemin")},"imagemin-jpeg-recompress":
/*!*******************************************!*\
  !*** external "imagemin-jpeg-recompress" ***!
  \*******************************************/
/*! no static exports found */function(e,o){e.exports=require("imagemin-jpeg-recompress")}});
//# sourceMappingURL=index.js.map