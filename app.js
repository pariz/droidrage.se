(function () {
  let repl = [
    [
      ["      _           _     _                      "],
      ["   __| |_ __ ___ (_) __| |_ __ __ _  __ _  ___ "],
      ["  / _` | '__/ _ \\| |/ _` | '__/ _` |/ _` |/ _ \\"],
      [" | (_| | | | (_) | | (_| | | | (_| | (_| |  __/"],
      ["  \\__,_|_|  \\___/|_|\\__,_|_|  \\__,_|\\__, |\\___|"],
      ["                                    |___/      "],
      [""],
      [["h1", "Welcome to droidrage", {}]],
      [""],
      ["High priest of the mainframe since ´99"],
      [""],
    ],
    [
      [["h1", "About me", {}]],
      [""],
      [
        "My name is Pär. I’m a self-employed developer, born on a cold autumn day in the northern part of Sweden in ’80.",
      ],
      ["I have always had a passion for learning things."],
      [
        "When I got my first computer at 15, I started learning how to code almost immediately.",
      ],
      ["Since ’99, I have worked professionally as a developer."],
      [""],
    ],
    [
      [["h1", "Contact", {}]],
      [""],
      [
        "You can find me at ",
        ["a", "github", { href: "https://github.com/pariz", target: "_blank" }],
        ", ",
        [
          "a",
          "stack overflow",
          {
            href: "https://stackoverflow.com/users/1503261/p%c3%a4r-karlsson",
            target: "_blank",
          },
        ],
        ", ",
        [
          "a",
          "linkedin",
          { href: "https://www.linkedin.com/in/parkarlsson", target: "_blank" },
        ],
      ],
      ["or contact me by dropping an email at hi@{replace-with-my-domain}"],
      [""],
    ],
    [
      [["h1", "Tech stuff", {}]],
      [""],
      [
        "For the past few years, I have mostly worked with Golang, Elixir, JavaScript, SQL/NoSQL DBs, Redis, and RabbitMQ.",
      ],
      [
        "The stuff I have worked on usually runs in AWS or GCP, either on k8s or nomad.",
      ],
      [""],
      [
        "This site was created in the evening of a rainy august, leveraging pure vanilla JavaScript.",
      ],
      [""],
      [
        "If you're interested in learning more about me, my full resumé is available upon request.",
      ],
      [""],
    ],
    [
      [["h1", "What is droidrage?", {}]],
      [
        "Droidrage is the name of my company, it's sort of a wordplay between roid rage and droids.",
      ],
      ["... unfortunately few get it :/"],
      [
        "I decided to start my company in spring 2021 after a long time working as an employed developer.",
      ],
      [""],
    ],
  ];

  let commands = [
    "available commands: ",
    [
      ["home", 0],
      ["whoami", 1],
      ["tech", 3],
      ["contact", 2],
      ["droidrage", 4],
    ],
  ];

  const container = document.getElementsByClassName("terminal-output")[0];
  let inputReady = false;

  async function writeReplLines(lines) {
    for (const line of lines) {
      let [elem, elemContent, removeCursorFunction] = genElements();

      container.appendChild(elem);

      for (const col of line) {
        switch (typeof col) {
          case "object":
            const link = document.createElement(col[0]);

            for (const [key, value] of Object.entries(col[2])) {
              console.log(`${key}: ${value}`);
              link.setAttribute(key, value);
            }

            elemContent.appendChild(link);

            await writeReplChars(col[1], link);
            break;

          default:
            const charElem = document.createElement("span");
            elemContent.appendChild(charElem);
            await writeReplChars(col, charElem);
        }
      }
      removeCursorFunction();
    }
  }

  async function writeReplCommands() {
    const [h, cmds] = commands;

    let [elem, elemContent, removeCursorFunction] = genElements("nav");

    container.appendChild(elem);

    await writeReplChars(h, elemContent);

    for (const cmd of cmds) {
      const commandLink = document.createElement("a");
      commandLink.href = "#/" + cmd[0];

      elemContent.appendChild(commandLink);

      function handleInteraction(e) {
        e.preventDefault();
        pushState(cmd[0], e.type);
        writeRepl(repl[cmd[1]]);
      }

      commandLink.addEventListener("touchend", handleInteraction);
      commandLink.addEventListener("click", handleInteraction);

      await writeReplChars(cmd[0], commandLink);

      const spaceElement = document.createElement("span");
      spaceElement.innerHTML = " ";
      elemContent.append(" ");
    }

    removeCursorFunction();
  }

  async function writeReplChars(chars, element) {
    // Skip slow rendering if crawler
    if (isCrawler()) {
      element.innerHTML = chars;
      return;
    }

    for (let i = 0; i < chars.length; i++) {
      let char = chars[i];

      element.innerHTML += char;

      await sleep();
    }
  }

  async function writeReplInput() {
    const [inputFeedElem, inputFeedElemContent] = genElements();
    //inputFeedElemContent.innerHTML += "> ";
    container.appendChild(inputFeedElem);
  }

  async function writeRepl(lines) {
    inputReady = false;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    await writeReplLines(lines);
    await writeReplCommands();
    await writeReplInput();

    inputReady = true;
  }

  async function sleep() {
    return new Promise((resolve) => setTimeout(resolve, 20));
  }

  function pushState(path, type) {
    window.location.hash = path;
    window.goatcounter.count({
      path: location.pathname + location.search + location.hash,
      title: type + " to " + window.location.hash,
      event: true,
    });
  }

  function genElements(contentTag = "span") {
    let cursor = document.createElement("span");
    cursor.innerHTML = "_";
    cursor.className = "cursor";

    let elem = document.createElement("div");
    elem.className = "repl-line";
    let elemContent = document.createElement(contentTag);

    elem.appendChild(elemContent);
    elem.appendChild(cursor);

    return [
      elem,
      elemContent,
      function () {
        elem.removeChild(cursor);
      },
    ];
  }

  function isCrawler() {
    var botPattern =
      "(googlebot/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";
    var re = new RegExp(botPattern, "i");
    var userAgent = navigator.userAgent;
    return re.test(userAgent);
  }

  // Repl read loop
  (function replReadLoop() {
    let inputBuffer = "";
    window.addEventListener("keydown", function (evt) {
      if (!inputReady) {
        return;
      }

      evt.preventDefault();

      const replElem = container.lastChild.firstChild;

      switch (evt.key) {
        case "Enter":
          const cmd = commands[1].find((c) => c[0] === inputBuffer);
          if (cmd !== undefined) {
            pushState(cmd[0], "keyboard_input");
            writeRepl(repl[cmd[1]]);
          }
          inputBuffer = "";
          break;
        case "Backspace":
          inputBuffer = inputBuffer.slice(0, -1);
          break;

        default: // append to buffer
          if (/^[a-zA-Z]{1}$/.test(evt.key)) {
            inputBuffer += evt.key;
          }
      }
      replElem.innerHTML = inputBuffer;
    });
  })();

  (function () {
    let page = window.location.hash.replace("#", "");
    let replIdx = 0;
    if (page !== "") {
      const cmd = commands[1].find((c) => c[0] === page);
      if (cmd !== undefined) {
        replIdx = cmd[1];
      }
    }
    writeRepl(repl[replIdx]);
  })();
})();
