const xianzaiwoyao = "bingchilling";

const ENABLE_GF = true;
const ENABLE_YT = true;
const ENABLE_MISC = true;
const ENABLE_MISC2 = false;

const { log } = console;
const { floor, random, ceil } = Math;

const pptOptions = {
    headless: true,
    setDefaultNavigationTimeout: 0,
    setDefaultTimeout: 0,
    args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        '--disable-dev-shm-usage',
        //'--single-process', - breaks on glitch smh
        "--disable-web-security"
    ]
};

const axios = require("axios");

const channels = [ //bunch of filler channels
    "https://www.youtube.com/@Taskmaster",
    "https://www.youtube.com/@MrBeast",
    "https://www.youtube.com/channel/UCAiLfjNXkNv24uhpzUgPa6A",
    "https://www.youtube.com/channel/UCIPPMRA040LQr5QPyJEbmXA",
    "https://www.youtube.com/channel/UCUaT_39o1x6qWjz7K2pWcgw",
    "https://www.youtube.com/channel/UC4-79UOlP48-QNGgCko5p2g",
    "https://www.youtube.com/@quadecaX8",
    "https://www.youtube.com/@watcher",
    "https://www.youtube.com/@Zyenith",
    "https://www.youtube.com/@RyanGeorge",
    "https://www.youtube.com/@LegalEagle",
    "https://www.youtube.com/@jacksfilms",
    "https://www.youtube.com/@fantano",
    "https://www.youtube.com/@NerdExplains",
    "https://www.youtube.com/@HowToBasic",
    "https://www.youtube.com/channel/UCxjrNGrX188Riipfmvejjsg"
];

Array.prototype.repeatExtend = function(amt) {
    let initial = this;
    let final = initial;
    for (let i = 0; i < amt; i++) {
        final = final.concat(initial);
    };
    return final;
}; //using this to add weight onto search terms without writing it 100x

//find search terms by going to https://rapidtags.io/generator and looking up whatever tf u want
let searchTerms = [];

searchTerms.push("moomoo.io,moomoo.io hack,moomoo.io defeating hackers,moomooio,moomoo.io mods,moomoo.io insta kill,moomoo.io sandbox,moomoo.io hacks,moomoo.io base,moomoo.io world record,moomoo.io hacker,moomoo.io hack link,moomoo.io high score,moomoo.io trolling,moomoo.io defeating auto healers,moomoo.io raiding bases,moomoo.io update,moomoo.io 2,moomoo.io tutorial,moomoo.io gameplay,moomoo.io new update,moomoo.io instakill,moomoo.io highlights,moomoo.io game".split(","));

searchTerms.push("mrbeast,mr beast,mrbeast team,mrbeast crew,the old mrbeast crew,mrbeast ex employees,mrbeast ex-employees,mrbeast live,mrbeast hindi,mr. beast,mrbeast studio,mrbeast gaming,sunnyv2 mrbeast,mrbeast sunnyv2,mrbeast in hindi,who is mr beast,mr beast hindi,mr beast react,what happened to mrbeast ex employees,mr beast studio,mr beast gaming,mrbeast warehouse,mr beast in hindi,mr beast podcast,mister beast,mrbeast last to leave".split(","));

searchTerms.push("minecraft,minecraft hardcore,hardcore minecraft,minecraft challenge,minecraft but,minecraft mod,minecraft mods,minecraft 100 days,minecraft funny,funny minecraft,minecraft video,minecraft school,100 days minecraft,minecraft animation,w minecraft,minecraft compilation,minecraft pe,monster school minecraft,minecraft monster school,to be continued minecraft,minecraft izle,minecraft story,minecraft movie,minecraft house,minecraft fakir".split(","));

searchTerms.push(["moomoo.io zyenith"].repeatExtend(10));

searchTerms.push(["moomoo.io spyder"].repeatExtend(10));

searchTerms.push("bts,bts v,jin bts,bts news,bts army,v bts,rm bts,bts rm,bts jin,bts sad,sad bts,bts 日本語,bts 韓国語,bts 面白い,cctv bts,suga bts,army bts,bts live,kpop bts,jimin bts,jhope bts,bts funny,bts 日本語字幕,bts update,bts future,bts eating,bts streams,bts 日本語字幕最新,taehyung bts,jungkook bts,bts reaction,bts struggle,bts marriage,bts jungkook,bts 面白い 日本語字幕,bts playlist,bts play game,bts new video,bts news today,bts interview".split(","));

searchTerms = searchTerms.flat(3);

Array.prototype.random = function () {
    return this[floor((random()*this.length))];
}; //this is so much easier fuck you people who hate prototype modifications

const arrs = new Map();
Array.prototype.randomFlush = function (identifier) {
    let _random = this[floor((random()*this.length))];
    if (!arrs.has(identifier)) arrs.set(identifier, new Set());
    const usedCache = arrs.get(identifier);
    while (usedCache.has(_random)) {
        if (usedCache.size === this.length) {
            usedCache.clear();
        };
        _random = this[floor((random()*this.length))];
    };
    usedCache.add(_random);
    return _random;
};

const createServer = true;

const NETWORK_PATIENCE = 8000 + (random()*3000); //per instance and global

if (createServer) {
    const server = require("http").createServer(function (req, res) {
        res.writeHead(200);
        res.end('0');
    });
    server.listen(process.env.PORT || 8080);
};

function getRandomInt(min, max) {
    const _min = ceil(min);
    return floor(random() * (floor(max) - _min + 1)) + _min;
};

async function createPage(browser, link) {
    let page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(link, { waitUntil: ['domcontentloaded'], timeout: 0 });
    return page;
};

/**
 * 
 * @param {PuppeteerPage} youtubePage 
 * @param {string} loc 
 * @returns 
 */
async function standardGoto(youtubePage, loc, skipIdle) {
    console.log("navigating to", loc);
    await youtubePage.goto(loc, { waitUntil: ['domcontentloaded'], timeout: 0});
    console.log("page dom content loaded");
    if (skipIdle) {
      await wait(30000 + random() * 15000);
    } else {
      await standardWaitForNetIdle(youtubePage);
    }
    await wait(5000 + random() * 10000);
    return true;
};

async function standardWaitForNetIdle(youtubePage) {
  await wait(5000);
  console.log("waiting for network idle...");
  await youtubePage.waitForNetworkIdle({ idleTime: 7500, timeout: 0 });
  console.log("network idle...");
  return true;
}

async function randomWait() {
    await wait(5000 + (random() * 5000));
    return true;
};

async function watchRandomFrontScreenVideo(youtubePage) {
    console.log("watching...");
    await youtubePage.evaluate(() => {
        function get_random(list) {
            return list[Math.floor((Math.random()*list.length))];
        };

        const videosOnFrontPage = Array.from(document.getElementsByClassName("yt-core-image--fill-parent-height yt-core-image--fill-parent-width yt-core-image yt-core-image--content-mode-scale-aspect-fill yt-core-image--loaded")).slice(0, 7);

        get_random(videosOnFrontPage).setAttribute("id", "__scope");
    });

    await randomWait();
    await youtubePage.click("#__scope");
    
    await standardWaitForNetIdle(youtubePage);

    const maxTime = await getMaxTime(youtubePage);
    console.log("maxtime", maxTime);

    // watch between 2-5 mins, or max length if it's shorter than 2-5mins
    await wait(Math.min(60000 * getRandomInt(2, 5), maxTime));

    return true;
};

async function getMaxTime(youtubePage) {
    return await youtubePage.evaluate(() => {
        const timeValues = {
            "Seconds": 1000,
            "Minutes": 60000,
            "Hours": 3600000,
            "Second": 1000,
            "Minute": 60000,
            "Hour": 3600000
        };
        let t = Array.from(document.getElementsByClassName("ytp-progress-bar")).pop().ariaValueText;
        let tt = 0;
        t = t.split(t.includes("of") ? " of " : ", ")[1].split(" ");
        for (let i = 0; i < t.length; i += 2) {
            tt += t[i] * timeValues[t[i + 1]];
        }
        return tt;
    });
};

//START IMPORTANT ISOLATED ACTIONS, ALL OF THESE CAN BE RAN ALONE:

/* goes to a random channel as defined in the channels list, and then watches one of the videos for a random amount of time */
async function anchorAndView(youtubePage) {
    log("goto channel and view video process...");

    await standardGoto(youtubePage, channels.random());

    await youtubePage.click("tp-yt-paper-tab.style-scope:nth-child(4) > div:nth-child(1)");
    log("clicked video stuff");

    await standardWaitForNetIdle(youtubePage);

    log("page network idle x2");

    await youtubePage.evaluate(() => {
        function get_random(list) {
            return list[Math.floor((Math.random()*list.length))];
        };
        const videoList = Array.from(document.querySelectorAll("#contents")).filter(e => e.getAttribute("class") == "style-scope ytd-rich-grid-row").slice(6).map(e => Array.from(e.children)).flat(1).map(e => e.childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[1]);
        const randomVideo = get_random(videoList);
        randomVideo.setAttribute("id", "__hookedVidToWatch");
        return videoList.map(e => e.href);
    });

    await wait(getRandomInt(1000, 5000));

    await youtubePage.click("#__hookedVidToWatch");
    console.log("woah clicked some videoo");

    await wait(15000);

    const maxTime = await getMaxTime(youtubePage);
    const watchTime = Math.min(60000 * getRandomInt(2, 5), maxTime);
    console.log(`watching vid for ${watchTime}ms, max time: ${maxTime}ms`);

    // watch between 2-5 mins, or max length if it's shorter than 2-5mins
    await wait(watchTime);

    return true;
};

/* goes to the front screen and clicks a random video to seem like a real person yk */
async function frontScreenActions(youtubePage) {
    log("going to front screen and clicking random video...");
    
    await standardWaitForNetIdle(youtubePage);

    await randomWait();

    log("click attempt...");
    await youtubePage.evaluate(() => {
        function get_random(list) {
            return list[Math.floor((Math.random()*list.length))];
        };
        get_random(Array.from(document.getElementsByClassName("style-scope ytd-rich-grid-row")).filter(e => e.id != "contents")).children[0].children[0].children[0].children[0].children[0].setAttribute("id", "gottemezez")
    });

    await randomWait();

    await youtubePage.click("#gottemezez");

    await standardWaitForNetIdle(youtubePage);

    await watchRandomFrontScreenVideo(youtubePage);

    return true;
};

async function searchAndView(youtubePage) {
    log("searching youtube results");

    await randomWait();

    await youtubePage.evaluate(() => {
        let searchBoxes = Array.from(document.querySelectorAll("#search"));
        let searchBoxReal = document.getElementById("__searchBoxReal");

        if (searchBoxReal) return;

        searchBoxes.find(e => e.tagName === "INPUT").setAttribute("id", "__searchBoxReal");
    });

    await youtubePage.type("#__searchBoxReal", searchTerms.random(), {delay: 100 + (50 * random())});

    await wait(500 + (300 * random()));

    await youtubePage.click("#search-icon-legacy");

    console.log("searching...");

    await (async function loop() {
        let _wait = await youtubePage.evaluate(() => {
            return Array.from(document.getElementsByTagName("ytd-video-renderer")).length;
        });

        if (!_wait) return await loop();
        return;
    })();

    await standardWaitForNetIdle(youtubePage);

    let maxTime = await youtubePage.evaluate(() => {
        const timeValues = {
            "seconds": 1000,
            "minutes": 60000,
            "hours": 3600000,
            "second": 1000,
            "minute": 60000,
            "hour": 3600000
        };

        function get_random(list) {
            return list[Math.floor((Math.random()*list.length))];
        };

        function digestTime(time) {
            let t = time.split(", ").map(e => e.split(" ")).flat(1), tt = 0;
            for (let i = 0; i < t.length; i += 2) {
                tt += t[i] * timeValues[t[i + 1]];
            }
            return tt;
        }

        const videoResults = Array.from(document.getElementsByTagName("ytd-video-renderer")).map(e => e.childNodes[2].childNodes[1].childNodes[1]);

        const result = get_random(videoResults);
        const maxTime = result.childNodes[5].childNodes[0].childNodes[2].ariaLabel;

        result.setAttribute("id", "__hookedVidToClick");
        result.scrollIntoView();

        return digestTime(maxTime);
    });

    await wait(Math.random() * 15000);
    await youtubePage.click("#__hookedVidToClick");

    // watch 1-10 mins or max amount of time if time is shorter
    let time = Math.min(60000 * getRandomInt(1, 10), maxTime + 5000);
    console.log("watching video for " + time + "ms");
    await wait(time);

    return true;
};

const hookPlaylistPoints = [
    "eHpl-BjXo58",
    "wVnKGSjY3i8",
    "tSiKyCpwnSY",
    "x2gfhCLHd94",
    "tUTCq3iiw_4",
    "-PgyODlV6V8"
];
async function keyWatch(youtubePage) {
    log("standard keyWatch...");

    await standardGoto(youtubePage, "https://www.youtube.com/watch?v=" + hookPlaylistPoints.random() + "&list=PL7D9Ps0wVt5cynwDE_CPYb6aBUkYyfi-y", false);

    log("clicking...");

    //selectors change if ur logged in:
    await youtubePage.click("#button > ytd-button-renderer > yt-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill")
    await youtubePage.click("#top-level-buttons-computed > ytd-toggle-button-renderer > yt-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill");

    const cleanupInterval = setInterval(async () => {
        //this keeps running so we ensure that the player is always playing without tracking whenever we change pages ez
        log("executed cleanup interval, check process...");
        await youtubePage.evaluate(() => {
            setTimeout(() => { //override autoplay blocking ez:
                if (document.querySelector(".ytp-large-play-button")?.offsetParent) { //if its paused/not playing...
                    document.querySelector(".ytp-large-play-button")?.click?.();
                };
            }, 3000 + Math.random() * 1000);
        });
    }, 7000);

    await wait(60000 * getRandomInt(4, 55)); //5 mins -> 55 mins

    clearInterval(cleanupInterval); //IMPORTANT ----- CLEANUP

    return true; //clear everything post-here
};

const GlobalActions = [
    searchAndView,
    anchorAndView,
    frontScreenActions,
    keyWatch
];
//END IMPORTANT ISOLATED ACTIONS, ALL OF THESE CAN BE RAN ALONE

const wait = (s) => new Promise((r) => setTimeout(r, s));
async function runYTModule(browser, userAction) {
    const youtubePage = await createPage(browser, "https://www.youtube.com/");
    console.log("navigated to youtube...");

    await randomWait();

    while (1) {
        let error = false;
        try {
            await standardWaitForNetIdle(youtubePage);
            await (GlobalActions.random()(youtubePage));
        } catch (e) {
            console.log((error = true, e));
            youtubePage.close();
        };

        if (error) return true;

        await randomWait();
    };
    return true;
};

const scriptTargets = [
    {
        url: "https://greasyfork.org/en/scripts/404065-%E7%BD%91%E9%A1%B5%E7%B2%BE%E7%81%B5",
        preRef: "https://greasyfork.org/en/scripts/by-site/51cto.com"
    },
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
    },
    {
        url: "https://greasyfork.org/en/scripts/1196-view-youtube-tags",
        preRef: "https://greasyfork.org/en/scripts/by-site/youtube.com?page=9"
    },
    {
        url: "https://greasyfork.org/en/scripts/21012-youtubeext",
        preRef: "https://greasyfork.org/en/scripts/by-site/youtube.com?page=9"
    },
    {
        url: "https://greasyfork.org/en/scripts/20798-youtube-hide-volume-control",
        preRef: "https://greasyfork.org/en/scripts/by-site/youtube.com?page=9"
    },
    {
        url: "https://greasyfork.org/en/scripts/9090-youtube-add-video-id-text-field",
        preRef: "https://greasyfork.org/en/scripts/by-site/youtube.com?page=9"
    },
    {
        url: "https://greasyfork.org/en/scripts/20710-calm-down-youtube",
        preRef: "https://greasyfork.org/en/scripts/by-site/youtube.com?page=9"
    },
    {
        url: "https://greasyfork.org/en/scripts/39544-youtube-polymer-disable",
        preRef: "https://greasyfork.org/en/scripts/by-site/youtube.com?page=9"
    },
    {
        url: "https://greasyfork.org/en/scripts/412698-youtube-auto-skip-ads",
        preRef: "https://greasyfork.org/en/scripts/by-site/youtube.com?page=9"
    },
    {
        url: "https://greasyfork.org/en/scripts/413965-youtube-like-dislike-video-and-skip-ad-keyboard-shortcuts-fork-from-nerevar009",
        preRef: "https://greasyfork.org/en/scripts/by-site/youtube.com?page=9"
    },
    {
        url: "https://greasyfork.org/en/scripts/39919-youtube-suggested-video-hider-for-youtube-classic",
        preRef: "https://greasyfork.org/en/scripts/by-site/youtube.com?page=9"
    },
    {
        url: "https://greasyfork.org/en/scripts/414756-requesthook",
        preRef: "https://greasyfork.org/en/scripts/by-site/youtube.com?page=9"
    },
    {
        url: "https://greasyfork.org/en/scripts/414876-live-chat-mod-caliber",
        preRef: "https://greasyfork.org/en/scripts/by-site/youtube.com?page=9"
    },
    {
        url: "https://greasyfork.org/en/scripts/40462-youtube-no-resume",
        preRef: "https://greasyfork.org/en/scripts/by-site/youtube.com?page=9"
    },
    {
        url: "https://greasyfork.org/en/scripts/40517-youtube-resume",
        preRef: "https://greasyfork.org/en/scripts/by-site/youtube.com?page=9"
    },
    {
        url: "https://greasyfork.org/en/scripts/415706-moomoo-io-remove-cookie-preferences-tab",
        preRef: "https://greasyfork.org/en/scripts/by-site/moomoo.io"
    },
    {
        url: "https://greasyfork.org/en/scripts/405955-web-security",
        preRef: "https://greasyfork.org/en/scripts/by-site/*"
    },
    {
        url: "https://greasyfork.org/en/scripts/381682-html5%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC",
        preRef: "https://greasyfork.org/en/scripts/by-site/*"
    },
    {
        url: "https://greasyfork.org/en/scripts/429635-always-on-focus",
        preRef: "https://greasyfork.org/en/scripts/by-site/*"
    },
    {
        url: "https://greasyfork.org/en/scripts/30310-removeads",
        preRef: "https://greasyfork.org/en/scripts/by-site/*"
    },
    {
        url: "https://greasyfork.org/en/scripts/455853-%E7%BD%91%E9%A1%B5%E8%AE%BF%E9%97%AE%E5%8A%A0%E9%80%9F%E5%99%A8",
        preRef: "https://greasyfork.org/en/scripts/by-site/*"
    },
    {
        url: "https://greasyfork.org/en/scripts/454941-hcaptcha-captcha-solver-by-nocaptchaai",
        preRef: "https://greasyfork.org/en/scripts/by-site/*"
    },
    {
        url: "https://greasyfork.org/en/scripts/374794-lift-web-restrictions-io-game-mods-moomoo-io-krunker-io-ad-link-bypasser-adblock-more",
        preRef: "https://greasyfork.org/en/scripts/by-site/baidu.com"
    },
    {
        url: "https://greasyfork.org/en/scripts/374794-lift-web-restrictions-io-game-mods-moomoo-io-krunker-io-ad-link-bypasser-adblock-more",
        preRef: "https://greasyfork.org/en/scripts/by-site/moomoo.io"
    },
    {
        url: "https://greasyfork.org/en/scripts/374794-lift-web-restrictions-io-game-mods-moomoo-io-krunker-io-ad-link-bypasser-adblock-more",
        preRef: "https://greasyfork.org/en/scripts/by-site/discord.com"
    },
    {
        url: "https://greasyfork.org/en/scripts/407994-mope-io-auto-dive-auto-boost-see-people-underwater-see-invisible-players-remove-ads",
        preRef: "https://greasyfork.org/en/scripts/by-site/mope.io"
    },
    {
        url: "https://greasyfork.org/en/scripts/424066-pancake-mod-katana-musket-autoheal-anti-insta-starter-resources-and-more",
        preRef: "https://greasyfork.org/en/scripts/by-site/moomoo.io"
    },
    {
        url: "https://greasyfork.org/en/scripts/429746-best-moomoo-io-hack-mod-2022-2023",
        preRef: "https://greasyfork.org/en/scripts/by-site/moomoo.io"
    },
    {
        url: "https://greasyfork.org/en/scripts/405943-moomoo-io-agar-io-surviv-io-slither-io-diep-io-global-name-manager-krunker-coming-soon",
        preRef: "https://greasyfork.org/en/scripts/by-site/moomoo.io"
    },
    {
        url: "https://greasyfork.org/en/scripts/456855-anti-anti-adblock-v1-all-sites",
        preRef: "https://greasyfork.org/en/scripts/by-site/*"
    },
    {
        url: "https://greasyfork.org/en/scripts/454134-moomoo-io-dune-mod-autoheal-autobreak-fast-and-more",
        preRef: "https://greasyfork.org/en/scripts/by-site/moomoo.io"
    },
    {
        url: "https://greasyfork.org/en/scripts/424447-xtaming-client-taming-io-hacks",
        preRef: "https://greasyfork.org/en/scripts/by-site/taming.io"
    },
    {
        url: "https://greasyfork.org/en/scripts/451547-moomoo-io-insane-mod-beta-too-fast-read-description",
        preRef: "https://greasyfork.org/en/scripts/by-site/moomoo.io"
    },
    {
        url: "https://greasyfork.org/en/scripts/424655-i30cps-utility-mod",
        preRef: "https://greasyfork.org/en/scripts/by-site/moomoo.io"
    },
    {
        url: "https://greasyfork.org/en/scripts/448601-%E5%8A%9B%E6%89%A3%E9%A2%98%E7%9B%AE%E8%BD%ACmarkdown",
        preRef: "https://greasyfork.org/en/scripts/by-site/leetcode.cn"
    },
    {
        url: "https://greasyfork.org/en/scripts/445806-moomoo-io-auto-heal",
        preRef: "https://greasyfork.org/en/scripts/by-site/moomoo.io"
    },
    {
        url: "https://greasyfork.org/en/scripts/434199-moomoo-io-helper-to-become-pro",
        preRef: "https://greasyfork.org/en/scripts/by-site/moomoo.io"
    },
    {
        url: "https://greasyfork.org/en/scripts/405943-moomoo-io-agar-io-surviv-io-slither-io-diep-io-global-name-manager-krunker-coming-soon",
        preRef: "https://greasyfork.org/en/scripts/by-site/slither.io"
    },
    {
        url: "https://greasyfork.org/en/scripts/454409-video-downloader-for-tampermonkey",
        preRef: "https://greasyfork.org/en/scripts/by-site/*"
    },
    {
        url: "https://greasyfork.org/en/scripts/452314-adblock-script-for-webview",
        preRef: "https://greasyfork.org/en/scripts/by-site/*"
    },
    {
        url: "https://greasyfork.org/en/scripts/35466-mouseplus",
        preRef: "https://greasyfork.org/en/scripts/by-site/*"
    },
    {
        url: "https://greasyfork.org/en/scripts/456851-omnifocus",
        preRef: "https://greasyfork.org/en/scripts/by-site/*"
    },
    {
        url: "https://greasyfork.org/en/scripts/430253-arras-io-multibox-script",
        preRef: "https://greasyfork.org/en/scripts/by-site/arras.io"
    },
    {
        url: "https://greasyfork.org/en/scripts/438879-diep-io-permanent-leader-arrow",
        preRef: "https://greasyfork.org/en/scripts/by-site/diep.io"
    },
    {
        url: "https://greasyfork.org/en/scripts/430255-warinspace-bots",
        preRef: "https://greasyfork.org/en/scripts/by-site/warin.space"
    },
    {
        url: "https://greasyfork.org/en/scripts/444523-diep-io-minimap-highlights",
        preRef: "https://greasyfork.org/en/scripts/by-site/diep.io"
    },
    {
        url: "https://greasyfork.org/en/scripts/456856-optimize-quill-org",
        preRef: "https://greasyfork.org/en/scripts/by-site/quill.org"
    }
];
async function runGFModule(browser, userAction) {
    async function createPage() { //incognito session - also this is a self-calling infinite loop func that creates new contexts and stuff
        const { url: scriptRealLink, preRef: potentialPreReferrer } = scriptTargets.randomFlush(1); //per page, ez (pro algorithm)

        const context = await browser.createIncognitoBrowserContext();
        const page = await context.newPage();

        let stopFlag = 0;

        /* setup session */
        await page.goto(potentialPreReferrer, { timeout: NETWORK_PATIENCE }).catch(e => (stopFlag++));
        if (stopFlag) return (await page.close(), await context.close(), createPage());

        const ctx = await page.evaluate(`document.documentElement.innerHTML`);
        log(ctx.slice(0, 50));
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

            class Sha1 {
                constructor(sharedMemory) {
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
                update(message) {
                    if (this.finalized) {
                        return;
                    }
                    var notString = typeof (message) !== 'string';
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

                        if (notString) {
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
                }
                finalize() {
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
                }
                hash() {
                    var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4;
                    var f, j, t, blocks = this.blocks;

                    for (j = 16; j < 80; ++j) {
                        t = blocks[j - 3] ^ blocks[j - 8] ^ blocks[j - 14] ^ blocks[j - 16];
                        blocks[j] = (t << 1) | (t >>> 31);
                    }

                    for (j = 0; j < 20; j += 5) {
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

                    for (; j < 40; j += 5) {
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

                    for (; j < 60; j += 5) {
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

                    for (; j < 80; j += 5) {
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
                }
                hex() {
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
                }
                digest() {
                    this.finalize();

                    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4;

                    return [
                        (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, h0 & 0xFF,
                        (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF,
                        (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF,
                        (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, h3 & 0xFF,
                        (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, h4 & 0xFF
                    ];
                }
                arrayBuffer() {
                    this.finalize();

                    var buffer = new ArrayBuffer(20);
                    var dataView = new DataView(buffer);
                    dataView.setUint32(0, this.h0);
                    dataView.setUint32(4, this.h1);
                    dataView.setUint32(8, this.h2);
                    dataView.setUint32(12, this.h3);
                    dataView.setUint32(16, this.h4);
                    return buffer;
                }
            }

            Sha1.prototype.toString = Sha1.prototype.hex;

            Sha1.prototype.array = Sha1.prototype.digest;


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
};

const userAgents = [
    "Mozilla/5.0 (Linux; Android 10; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; SM-A102U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; SM-N960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.46",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
];
const miscSites = [ //random sites to provide cover traffic: - also all of these should be able to handle the traffic
    "https://discord.com",
    "https://stratums.io",
    "https://www.npmjs.com/",
    "https://github.com",
    "https://minecraft.net",
    "https://www.wsj.com/",
    "https://zbeacon.org",
    "https://yahoo.com",
    "https://www.theguardian.com/",
    "https://baidu.com/",
    "https://wikipedia.org",
    "https://pornhub.com" //<<< lmao obligatory isnt it
];
const miscSites2 = [ //these are actually visited
    "https://medium.com/",
    "https://medium.com/@digitalgiraffes/7-awesome-and-free-ai-tools-you-should-know-43a1630ea409",
    "https://medium.com/@syn_52523/a-commentary-on-the-ai-wave-215d668f827a",
    "https://medium.com/@melih193/react-developer-roadmap-2022-76ca119188bd",
    "https://medium.com/entrepreneur-s-handbook/is-your-startup-a-good-fit-for-venture-capital-bc59596df9e4",
    "https://medium.com/trendyol-tech/spring-boot-2-2-6-code-quality-with-sonarqube-8-2-community-70a76634bf75",
    "https://medium.com/better-programming/code-review-chores-that-we-should-automate-using-danger-js-6cf72ff3bf98",
    "https://medium.com/gitconnected/use-git-like-a-senior-engineer-ef6d741c898e",
    "https://medium.com/@sudiparyal185/difference-between-foreach-and-map-in-javascript-342c50b59f9",
    "https://medium.com/@dan-perry/the-world-that-knew-too-much-e9ca2372ee21",
    "https://medium.com/bitsrc/advanced-data-structures-and-algorithms-tries-47db931e20e",
    "https://dashmacintyre.medium.com/a-list-of-stories-donald-trump-paid-to-catch-and-kill-just-leaked-5e29f9f5f687",
    "https://medium.com/thebelladonnacomedy/quiz-are-you-in-a-wedding-party-or-a-cult-46097461eb72",
    "https://medium.com/@michaelcostello.swe/dbspy-4-0-6989c6ea47d8",
    "https://medium.com/@syn_52523/chatgpt-on-itself-3b1042b968cb",
    "https://medium.com/@thisisjimkeller/please-stop-including-color-names-in-your-css-classes-f1090f6f2e29",
    "https://medium.com/@mattcodes06/building-projects-takes-time-18dfa6d6e702",
    "https://medium.com/@syn_52523/a-rabbit-hole-of-js-hyper-optimization-a618288174b",
    "https://medium.com/@olopadeadunola/the-chaos-in-our-twenties-8fcefe061ef8",
    "https://medium.com/@leanfolks/mobile-app-architecture-6848aa1d5764",
    "https://blog.bitsrc.io/i-asked-chat-gpt-to-build-a-to-do-app-have-we-finally-met-our-replacement-ad347ad74c51",
    "https://medium.com/@alexey.inkin/never-have-separate-sign-in-routes-7c9a6dd4dc7c"
];
(async () => {
    console.log("index.js called");

    const { FakeBrowser } = require('fakebrowser');
    const path = require('path');
    const userDataDir = path.resolve(__dirname, './fakeBrowserUserData');

    const builder = new FakeBrowser.Builder()
        // [Optional]: Set the fake device description
        // [Optional]: Show user action layers
        .displayUserActionLayer(false)
        // [Optional]: Set startup options (https://pptr.dev/#?product=Puppeteer&show=api-puppeteerlaunchoptions)
        .vanillaLaunchOptions(pptOptions)
        .usePlugins([ //adblock please:
            require("puppeteer-extra-plugin-adblocker")({
              blockTrackers: true, //both of these are nondefault
              blockTrackersAndAnnoyances: true
            })
        ])
        // Must be set: path to save user data
        // We will create a fake device description (fake browser fingerprint) and save the browser's user cache information to this folder.
        // Note: Once the fake browser fingerprint is created, it will not change, just like a normal user using the browser.
        // If you want to get a different browser fingerprint, see demo2.
        .userDataDir(userDataDir);
  
    let fakeBrowser;
    x: while (1) {
      try {
        let deviceFP = await (async function loop() { //these projects are public, so DD_URL should be hidden
            let data;

            try {
              data = (await axios.get(process.env.DD_URL, {
                  headers: {
                      "User-Agent": userAgents.random(),
                      "Accept-Encoding": "none"
                  }
              }))?.data; //DD_URL returns a string of a device fingerprint on a CDN
            } catch(e){};
            if (data) {
                try {
                  data = (await axios.get(data, {
                      headers: {
                          "User-Agent": userAgents.random(),
                          "Accept-Encoding": "none"
                      }
                  }))?.data;
                } catch(e) {}
            };
            if (!data) return ((await randomWait()), (await loop()));
            try {
                return typeof data === "object" ? data : (typeof data === "string" ? JSON.parse(data) : {});
            } catch(e) {
                if (!data) return ((await randomWait()), (await loop()));
            };
        })();

        builder.deviceDescriptor(deviceFP);
        fakeBrowser = await builder.launch();
        break x;
      } catch(e) {
          console.warn(e)
          await randomWait();
      }
    }
    
    const userAction = fakeBrowser.userAction;

    console.log("browser launched");

    // vanillaBrowser is a puppeteer.Browser object
    const browser = fakeBrowser.vanillaBrowser;

    ENABLE_YT && (setTimeout(async () => {
        while (1) {
            await runYTModule(browser, userAction);
        };
    }, 100));
    ENABLE_GF && (setTimeout(async () => {
        await runGFModule(browser, userAction); //ONLY NEEDS TO BE RUN ONCE
    }, 100));
    ENABLE_MISC && (setTimeout(async () => {
        const reqInstance = axios.create({
            headers: {
                "User-Agent": userAgents.random()
            }
        });
        reqInstance.get(miscSites.random(), {
            timeout: 0,
            headers: {
                "User-Agent": userAgents.random(),
                "Accept-Encoding": "none"
            }
        }).catch(e => {});
        setInterval(() => {
            reqInstance.get(miscSites.random(), {
                timeout: 0,
                headers: {
                  "User-Agent": userAgents.random(),
                  "Accept-Encoding": "none"
                }
            }).catch(e => {});
        }, 7000 * getRandomInt(1, 5));

        ENABLE_MISC2 && (async function process() {
            const context = await browser.createIncognitoBrowserContext();
            const page = await context.newPage();
            while (1) {        
                let stopFlag = 0;
        
                await page.goto(miscSites2, { timeout: NETWORK_PATIENCE }).catch(e => (stopFlag++));

                await randomWait();

                if (stopFlag) return (await page.close(), await context.close(), process()); //not awaiting the process func to not hang a dead func and allow gc? not sure

                await randomWait();
            };
        })();
    }, 100));
})();
