const terminalOutput = document.querySelector(".terminal__output");
const terminalContent = document.querySelector(".terminal__content");

let currentLang = "en";

const switchLang = (lang) => {
  currentLang = lang;
  document.getElementById("lang-en").classList.toggle("lang-active", lang === "en");
  document.getElementById("lang-ru").classList.toggle("lang-active", lang === "ru");
  document.querySelectorAll("[data-" + lang + "]").forEach((el) => {
    el.textContent = el.dataset[lang];
  });
};

terminalContent.addEventListener("keydown", (e) => {
  if (e.target.classList.contains("command-input") && e.key === "Enter") {
    runCommand(e.target.value.trim().toLowerCase());
  }
});

const printOutput = (templateId) => {
  const template = document.getElementById(templateId);
  const items = template.children;

  let delay = 0;
  const delayInc = 100;

  for (let i = 0; i < items.length; i++) {
    const cloned = items[i].cloneNode(true);
    cloned.classList.add("command-output");

    setTimeout(() => {
      terminalOutput.appendChild(cloned);

      if (i === items.length - 1) {
        addEmptyRow();
        createNewPrompt();
      }
    }, delay);

    delay += delayInc;
  }
};

const createNewPrompt = () => {
  const newPrompt = document.createElement("div");
  newPrompt.className = "terminal__prompt";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "command-input";
  input.autocomplete = "off";
  input.value = "$ ";

  newPrompt.appendChild(input);
  terminalOutput.appendChild(newPrompt);
  input.focus();
};

const addEmptyRow = () => {
  terminalOutput.appendChild(document.createElement("br"));
};

const commandNotFound = () => {
  const div = document.createElement("div");
  div.textContent = "Error: Command not found.";
  terminalOutput.appendChild(div);
};

const freezeLastPrompt = (cmd) => {
  const lastPrompt =
    terminalOutput.querySelector(".terminal__prompt:last-of-type") ||
    terminalContent.querySelector(":scope > .terminal__prompt");

  const lastInput = lastPrompt?.querySelector("input");

  if (lastInput) {
    lastInput.value = "$ " + cmd;
    lastInput.readOnly = true;
  }
};

const commands = new Map([
  ["about", () => printOutput("about-" + currentLang)],
  ["skills", (cmd) => printOutput(cmd)],
  ["php", () => printOutput("php-" + currentLang)],
  ["mysql", () => printOutput("mysql-" + currentLang)],
  ["linux", () => printOutput("linux-" + currentLang)],
  ["javascript", () => printOutput("javascript-" + currentLang)],
  ["symfony", () => printOutput("symfony-" + currentLang)],
  ["docker", () => printOutput("docker-" + currentLang)],
  ["contact", () => printOutput("contact-" + currentLang)],
  [
    "resume",
    () => {
      const isRu = currentLang === "ru";
      const url = isRu ? "Дмитрий_Чащин_Резюме.pdf" : "Dmitry_Chashchin_Resume.pdf";
      window.open(url, "_blank");
      createNewPrompt();
    },
  ],
  [
    "clear",
    () => {
      const firstPrompt = terminalContent.querySelector(
        ":scope > .terminal__prompt",
      );
      firstPrompt?.remove();
      terminalOutput.textContent = "";
      createNewPrompt();
    },
  ],
]);

const runCommand = (rawCommand) => {
  const cmd = rawCommand
    .replace(/^\$\s*/, "")
    .trim()
    .toLowerCase();

  if (!cmd) return;

  freezeLastPrompt(cmd);

  const execution = commands.get(cmd);

  if (execution) {
    execution(cmd);
  } else {
    commandNotFound();
    createNewPrompt();
  }
};

const firstInput = document.querySelector(".command-input");
firstInput.value = "$ ";