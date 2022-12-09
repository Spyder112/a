Array.prototype.random = function() {
    return this[Math.floor(Math.random()*this.length)];
};

const express = require("express");
const app = express();
const log = console.log;

const ENABLE = true;
const NETWORK_PATIENCE = 8000 + (Math.random()*3000); //per instance and global

app.use(express.static("public"));
app.get("/", (r, r2) => r2.end("0"));
const listener = app.listen(process.env.PORT || 8080, () => log(listener.address().port));

const scriptTargets = [
    {
        url: "https://greasyfork.org/en/scripts/22545-anti-bd-redirect",
        preRef: "https://greasyfork.org/zn-CN/scripts/by-site/baidu.com?page=4"
    },
    {
        url: "https://greasyfork.org/zn-CN/scripts/385044-zhihu-anonymous-users",
        preRef: "https://greasyfork.org/zn-CN/scripts/by-site/zhihu.com"
    },
    {
        url: "https://greasyfork.org/zn-CN/scripts/30236-zhihu-link-fix",
        preRef: "https://greasyfork.org/zn-CN/scripts/by-site/zhihu.com"
    },
    {
        url: "https://greasyfork.org/en/scripts/435948-btb",
        preRef: "https://greasyfork.org/en/scripts/by-site/baidu.com"
    },
    {
        url: "https://greasyfork.org/en/scripts/430335-wb-script",
        preRef: "https://greasyfork.org/en/scripts/by-site/zhihu.com"
    },
    {
        url: "https://greasyfork.org/en/scripts/430572-beautify-the-baidu-homepage",
        preRef: "https://greasyfork.org/en/scripts/by-site/zhihu.com"
    },
    {
        url: "https://greasyfork.org/en/scripts/410781-diep-io-anti-afk-timeout",
        preRef: "https://greasyfork.org/en/scripts/by-site/diep.io"
    }
];

if (ENABLE) {
  const { log } = console;
  const { floor, random } = Math;

  (async () => {
      const puppeteer = require("puppeteer-extra");
      puppeteer.use(require('puppeteer-extra-plugin-stealth')());
      puppeteer.use(require('puppeteer-extra-plugin-adblocker')({ blockTrackers: true }));

      const browser = await puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"]
      });
      
      async function createPage() { //incognito session
        const { url: scriptRealLink, preRef: potentialPreReferrer } = scriptTargets.random(); //per page, ez

        const context = await browser.createIncognitoBrowserContext();
        const page = await context.newPage();

        let stopFlag = 0;

        /* setup session */
        await page.goto(potentialPreReferrer, { timeout: NETWORK_PATIENCE }).catch(e => (stopFlag++));
        if (stopFlag) return (await page.close(), await context.close(), createPage());

        const ctx = await page.evaluate(`document.documentElement.innerHTML`);
        console.log(ctx.slice(0, 50));
        if (!ctx.includes("script-description")) return (await page.close(), await context.close(), createPage());

        log("p1");
        /* close session */

        /* extract keys step */
        await page.goto(scriptRealLink, { timeout: NETWORK_PATIENCE }).catch(e => (stopFlag++));
        if (stopFlag) return (await page.close(), await context.close(), createPage());

        await new Promise(r => setTimeout(r, (2000 + floor(random()* 1000))));

        log("p2");
        /* end extract keys step */
        
        log(await page.evaluate(() => {
            
              var root = typeof window === 'object' ? window : {};
              var NODE_JS = !root.JS_SHA1_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
              if (NODE_JS) {
                root = global;
              }
              var HEX_CHARS = '0123456789abcdef'.split('');
              var EXTRA = [-2147483648, 8388608, 32768, 128];
              var SHIFT = [24, 16, 8, 0];
              var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];

              var blocks = [];

              var createOutputMethod = function (outputType) {
                  return function (message) {
                      return new Sha1(true).update(message)[outputType]();
                  };
              };

              var createMethod = function () {
                  var method = createOutputMethod('hex');
                  if (NODE_JS) {
                      method = nodeWrap(method);
                  }
                  method.create = function () {
                      return new Sha1();
                  };
                  method.update = function (message) {
                      return method.create().update(message);
                  };
                  for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
                      var type = OUTPUT_TYPES[i];
                      method[type] = createOutputMethod(type);
                  }
                  return method;
              };

              var nodeWrap = function (method) {
                  var crypto = eval("require('crypto')");
                  var Buffer = eval("require('buffer').Buffer");
                  var nodeMethod = function (message) {
                      if (typeof message === 'string') {
                          return crypto.createHash('sha1').update(message, 'utf8').digest('hex');
                      } else if (message.constructor === ArrayBuffer) {
                          message = new Uint8Array(message);
                      } else if (message.length === undefined) {
                          return method(message);
                      }
                      return crypto.createHash('sha1').update(new Buffer(message)).digest('hex');
                  };
                  return nodeMethod;
              };

              function Sha1(sharedMemory) {
                  if (sharedMemory) {
                      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                          blocks[4] = blocks[5] = blocks[6] = blocks[7] =
                          blocks[8] = blocks[9] = blocks[10] = blocks[11] =
                          blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
                      this.blocks = blocks;
                  } else {
                      this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                  }

                  this.h0 = 0x67452301;
                  this.h1 = 0xEFCDAB89;
                  this.h2 = 0x98BADCFE;
                  this.h3 = 0x10325476;
                  this.h4 = 0xC3D2E1F0;

                  this.block = this.start = this.bytes = this.hBytes = 0;
                  this.finalized = this.hashed = false;
                  this.first = true;
              }

              Sha1.prototype.update = function (message) {
                  if (this.finalized) {
                      return;
                  }
                  var notString = typeof(message) !== 'string';
                  if (notString && message.constructor === root.ArrayBuffer) {
                      message = new Uint8Array(message);
                  }
                  var code, index = 0, i, length = message.length || 0, blocks = this.blocks;

                  while (index < length) {
                      if (this.hashed) {
                          this.hashed = false;
                          blocks[0] = this.block;
                          blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                              blocks[4] = blocks[5] = blocks[6] = blocks[7] =
                              blocks[8] = blocks[9] = blocks[10] = blocks[11] =
                              blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
                      }

                      if(notString) {
                          for (i = this.start; index < length && i < 64; ++index) {
                              blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
                          }
                      } else {
                          for (i = this.start; index < length && i < 64; ++index) {
                              code = message.charCodeAt(index);
                              if (code < 0x80) {
                                  blocks[i >> 2] |= code << SHIFT[i++ & 3];
                              } else if (code < 0x800) {
                                  blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
                                  blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                              } else if (code < 0xd800 || code >= 0xe000) {
                                  blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
                                  blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                                  blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                              } else {
                                  code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                                  blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
                                  blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
                                  blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                                  blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                              }
                          }
                      }

                      this.lastByteIndex = i;
                      this.bytes += i - this.start;
                      if (i >= 64) {
                          this.block = blocks[16];
                          this.start = i - 64;
                          this.hash();
                          this.hashed = true;
                      } else {
                          this.start = i;
                      }
                  }
                  if (this.bytes > 4294967295) {
                      this.hBytes += this.bytes / 4294967296 << 0;
                      this.bytes = this.bytes % 4294967296;
                  }
                  return this;
              };

              Sha1.prototype.finalize = function () {
                  if (this.finalized) {
                      return;
                  }
                  this.finalized = true;
                  var blocks = this.blocks, i = this.lastByteIndex;
                  blocks[16] = this.block;
                  blocks[i >> 2] |= EXTRA[i & 3];
                  this.block = blocks[16];
                  if (i >= 56) {
                      if (!this.hashed) {
                          this.hash();
                      }
                      blocks[0] = this.block;
                      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                          blocks[4] = blocks[5] = blocks[6] = blocks[7] =
                          blocks[8] = blocks[9] = blocks[10] = blocks[11] =
                          blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
                  }
                  blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
                  blocks[15] = this.bytes << 3;
                  this.hash();
              };

              Sha1.prototype.hash = function () {
                  var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4;
                  var f, j, t, blocks = this.blocks;

                  for(j = 16; j < 80; ++j) {
                      t = blocks[j - 3] ^ blocks[j - 8] ^ blocks[j - 14] ^ blocks[j - 16];
                      blocks[j] =  (t << 1) | (t >>> 31);
                  }

                  for(j = 0; j < 20; j += 5) {
                      f = (b & c) | ((~b) & d);
                      t = (a << 5) | (a >>> 27);
                      e = t + f + e + 1518500249 + blocks[j] << 0;
                      b = (b << 30) | (b >>> 2);

                      f = (a & b) | ((~a) & c);
                      t = (e << 5) | (e >>> 27);
                      d = t + f + d + 1518500249 + blocks[j + 1] << 0;
                      a = (a << 30) | (a >>> 2);

                      f = (e & a) | ((~e) & b);
                      t = (d << 5) | (d >>> 27);
                      c = t + f + c + 1518500249 + blocks[j + 2] << 0;
                      e = (e << 30) | (e >>> 2);

                      f = (d & e) | ((~d) & a);
                      t = (c << 5) | (c >>> 27);
                      b = t + f + b + 1518500249 + blocks[j + 3] << 0;
                      d = (d << 30) | (d >>> 2);

                      f = (c & d) | ((~c) & e);
                      t = (b << 5) | (b >>> 27);
                      a = t + f + a + 1518500249 + blocks[j + 4] << 0;
                      c = (c << 30) | (c >>> 2);
                  }

                  for(; j < 40; j += 5) {
                      f = b ^ c ^ d;
                      t = (a << 5) | (a >>> 27);
                      e = t + f + e + 1859775393 + blocks[j] << 0;
                      b = (b << 30) | (b >>> 2);

                      f = a ^ b ^ c;
                      t = (e << 5) | (e >>> 27);
                      d = t + f + d + 1859775393 + blocks[j + 1] << 0;
                      a = (a << 30) | (a >>> 2);

                      f = e ^ a ^ b;
                      t = (d << 5) | (d >>> 27);
                      c = t + f + c + 1859775393 + blocks[j + 2] << 0;
                      e = (e << 30) | (e >>> 2);

                      f = d ^ e ^ a;
                      t = (c << 5) | (c >>> 27);
                      b = t + f + b + 1859775393 + blocks[j + 3] << 0;
                      d = (d << 30) | (d >>> 2);

                      f = c ^ d ^ e;
                      t = (b << 5) | (b >>> 27);
                      a = t + f + a + 1859775393 + blocks[j + 4] << 0;
                      c = (c << 30) | (c >>> 2);
                  }

                  for(; j < 60; j += 5) {
                      f = (b & c) | (b & d) | (c & d);
                      t = (a << 5) | (a >>> 27);
                      e = t + f + e - 1894007588 + blocks[j] << 0;
                      b = (b << 30) | (b >>> 2);

                      f = (a & b) | (a & c) | (b & c);
                      t = (e << 5) | (e >>> 27);
                      d = t + f + d - 1894007588 + blocks[j + 1] << 0;
                      a = (a << 30) | (a >>> 2);

                      f = (e & a) | (e & b) | (a & b);
                      t = (d << 5) | (d >>> 27);
                      c = t + f + c - 1894007588 + blocks[j + 2] << 0;
                      e = (e << 30) | (e >>> 2);

                      f = (d & e) | (d & a) | (e & a);
                      t = (c << 5) | (c >>> 27);
                      b = t + f + b - 1894007588 + blocks[j + 3] << 0;
                      d = (d << 30) | (d >>> 2);

                      f = (c & d) | (c & e) | (d & e);
                      t = (b << 5) | (b >>> 27);
                      a = t + f + a - 1894007588 + blocks[j + 4] << 0;
                      c = (c << 30) | (c >>> 2);
                  }

                  for(; j < 80; j += 5) {
                      f = b ^ c ^ d;
                      t = (a << 5) | (a >>> 27);
                      e = t + f + e - 899497514 + blocks[j] << 0;
                      b = (b << 30) | (b >>> 2);

                      f = a ^ b ^ c;
                      t = (e << 5) | (e >>> 27);
                      d = t + f + d - 899497514 + blocks[j + 1] << 0;
                      a = (a << 30) | (a >>> 2);

                      f = e ^ a ^ b;
                      t = (d << 5) | (d >>> 27);
                      c = t + f + c - 899497514 + blocks[j + 2] << 0;
                      e = (e << 30) | (e >>> 2);

                      f = d ^ e ^ a;
                      t = (c << 5) | (c >>> 27);
                      b = t + f + b - 899497514 + blocks[j + 3] << 0;
                      d = (d << 30) | (d >>> 2);

                      f = c ^ d ^ e;
                      t = (b << 5) | (b >>> 27);
                      a = t + f + a - 899497514 + blocks[j + 4] << 0;
                      c = (c << 30) | (c >>> 2);
                  }

                  this.h0 = this.h0 + a << 0;
                  this.h1 = this.h1 + b << 0;
                  this.h2 = this.h2 + c << 0;
                  this.h3 = this.h3 + d << 0;
                  this.h4 = this.h4 + e << 0;
              };

              Sha1.prototype.hex = function () {
                  this.finalize();

                  var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4;

                  return HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
                      HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
                      HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
                      HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
                      HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
                      HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
                      HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
                      HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
                      HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
                      HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
                      HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
                      HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
                      HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F] +
                      HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
                      HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
                      HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
                      HEX_CHARS[(h4 >> 28) & 0x0F] + HEX_CHARS[(h4 >> 24) & 0x0F] +
                      HEX_CHARS[(h4 >> 20) & 0x0F] + HEX_CHARS[(h4 >> 16) & 0x0F] +
                      HEX_CHARS[(h4 >> 12) & 0x0F] + HEX_CHARS[(h4 >> 8) & 0x0F] +
                      HEX_CHARS[(h4 >> 4) & 0x0F] + HEX_CHARS[h4 & 0x0F];
              };

              Sha1.prototype.toString = Sha1.prototype.hex;

              Sha1.prototype.digest = function () {
                  this.finalize();

                  var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4;

                  return [
                      (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, h0 & 0xFF,
                      (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF,
                      (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF,
                      (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, h3 & 0xFF,
                      (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, h4 & 0xFF
                  ];
              };

              Sha1.prototype.array = Sha1.prototype.digest;

              Sha1.prototype.arrayBuffer = function () {
                  this.finalize();

                  var buffer = new ArrayBuffer(20);
                  var dataView = new DataView(buffer);
                  dataView.setUint32(0, this.h0);
                  dataView.setUint32(4, this.h1);
                  dataView.setUint32(8, this.h2);
                  dataView.setUint32(12, this.h3);
                  dataView.setUint32(16, this.h4);
                  return buffer;
              };

              const sha1 = createMethod();

                window.localStorage.setItem('manualOverrideInstallJS', "1");
                let installLink = document.getElementsByClassName("install-link")[0];
                window.Promise = class _Promise extends window.Promise {
                    constructor(...args) {
                      let skip = false;
                             if (args[0].toString().includes("getAttribute(\"data-ping-url")) {
                                args[0] = (resolve) => {
                                    let pingUrl = installLink.getAttribute("data-ping-url")
                                    if (pingUrl) {
                                      let ping_key = sha1(installLink.getAttribute("data-ip-address") + installLink.getAttribute("data-script-id") + installLink.getAttribute("data-ping-key"));
                                      let xhr = new XMLHttpRequest();
                                      xhr.open("POST", pingUrl + "&mo=3" + "&ping_key=" + encodeURIComponent(ping_key), true);
                                      xhr.overrideMimeType("text/plain");
                                      xhr.onload = () => {
                                        //location.href = installLink.href;
                                        //setTimeout(() => {
                                        //}, 3000);
                                      }
                                      xhr.send();
                                      skip = true;
                                    } else {
                                      //location.href = installLink.href;
                                      //skip = true;
                                    }
                                }
                             }
                             skip || super(...args);
                         }
                };

                window.setTimeout(() => {
                    installLink.click();
                }, 1500);
          return Promise.resolve(1);
        }));
        
        log("after...");

        await new Promise(r => setTimeout(r, NETWORK_PATIENCE)); //lmao what a problem solver, just wait for it

        return (await page.close(), await context.close(), createPage());
      };

      for (let i = 0; i < 1; i++) {
        createPage();
      };
    })();
}