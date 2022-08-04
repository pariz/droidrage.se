(function () {
  var repl = [
    [
      [">       _           _     _                      "],
      [">    __| |_ __ ___ (_) __| |_ __ __ _  __ _  ___ "],
      [">   / _` | '__/ _ \\| |/ _` | '__/ _` |/ _` |/ _ \\"],
      [">  | (_| | | | (_) | | (_| | | | (_| | (_| |  __/"],
      [">   \\__,_|_|  \\___/|_|\\__,_|_|  \\__,_|\\__, |\\___|"],
      [">                                     |___/      "],
      [">  "],
      ["> welcome to droidrage"],
      [">  "],
      ["> highpriest of the mainframe since ´99"],
      [">  "],
    ],
    [
      [
        "> My name is Pär. I’m a self-employed developer, born on a cold autumn day in the northern part of Sweden in ’80.",
      ],
      ["> I have always had a passion for learning things."],
      [
        "> When I got my first computer at 15, I started learning how to code almost immediately.",
      ],
      ["> Since ’99, I have worked professionally as a developer."],
      [">  "],
    ],
    [
      ["> wanna get in touch?"],
      [
        "> you can find me at ",
        ["github", "https://github.com/pariz"],
        ", ",
        [
          "stack overflow",
          "https://stackoverflow.com/users/1503261/p%c3%a4r-karlsson",
        ],
        ", ",
        ["linkedin", "https://www.linkedin.com/in/parkarlsson"],
      ],
      ["> or contact me by dropping an email at hi@{replace-with-my-domain}"],
      [">  "],
    ],
    [
      [
        "> For the past few years, I have mostly worked with Golang, Elixir, JavaScript, SQL/NoSQL DBs, Redis, and RabbitMQ.",
      ],
      [
        "> The stuff I have worked on usually runs in AWS or GCP, either on k8s or nomad.",
      ],
      [">  "],
      [
        "> This site was created in the evening of a rainy august, leveraging pure vanilla JavaScript.",
      ],
      [">  "],
      [
        "> If you're interested in learning more about me, my full resumé is available upon request.",
      ],
      [">  "],
    ],
    [
      [
        "> Droidrage is the name of my company, it's sort of a wordplay between roid rage and droids.",
      ],
      ["> ... unfortunately few get it :/"],
      [
        "> I decided to start my company in spring 2021 after a long time working as an employed developer.",
      ],
      [">  "],
    ],
  ];

  var commands = [
    "> available commands: ",
    [
      ["home", 0],
      ["whoami", 1],
      ["tech", 3],
      ["contact", 2],
      ["droidrage", 4],
    ],
  ];

  const container = document.getElementsByClassName("terminal-output")[0];

  var inputReady = false;

  async function writeReplLines(lines) {
    for (const line of lines) {
      var [elem, elemContent, removeCursorFunction] = genElements();

      container.appendChild(elem);

      for (const col of line) {
        switch (typeof col) {
          case "object":
            const link = document.createElement("a");
            link.setAttribute("href", "#" + col[1]);
            link.setAttribute("target", "_blank");

            elemContent.appendChild(link);

            await writeChars(col[0], link);
            break;

          default:
            const charElem = document.createElement("span");
            elemContent.appendChild(charElem);
            await writeChars(col, charElem);
        }
      }
      removeCursorFunction();
    }
  }

  async function writeReplCommands() {
    const [h, cmds] = commands;

    var [elem, elemContent, removeCursorFunction] = genElements();

    container.appendChild(elem);

    await writeChars(h, elemContent);

    for (const cmd of cmds) {
      const commandLink = document.createElement("a");
      commandLink.href = "#/" + cmd[0];

      elemContent.appendChild(commandLink);

      function handleInteraction(e) {
        e.preventDefault();
        pushState(cmd[0]);
        writeRepl(repl[cmd[1]]);
      }

      commandLink.addEventListener("touchend", handleInteraction);

      commandLink.addEventListener("click", handleInteraction);

      await writeChars(cmd[0], commandLink);

      const spaceElement = document.createElement("span");
      spaceElement.innerHTML = " ";
      elemContent.append(" ");
    }

    removeCursorFunction();
  }

  async function writeChars(chars, element) {
    for (let i = 0; i < chars.length; i++) {
      let char = chars[i];

      element.innerHTML += char;
      await sleep(20);
    }
  }

  async function writeReplInput() {
    const [inputFeedElem, inputFeedElemContent] = genElements();
    inputFeedElemContent.innerHTML += "> ";
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

  function pushState(state) {
    window.location.hash = state;
  }

  function genElements() {
    var cursor = document.createElement("span");
    cursor.innerHTML = "_";
    cursor.className = "cursor";

    var elem = document.createElement("div");
    var elemContent = document.createElement("span");
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

  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Repl read loop
  (async function replReadLoop() {
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
            pushState(cmd[0]);
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
      replElem.innerHTML = "> " + inputBuffer;
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
