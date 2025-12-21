import init, {
  highlight,
  run_program,
  version as wasmVersion,
  check,
} from "/pkg/talk_wasm.js";

export async function loadTalk() {
  await init();

  return {
    runProgram: (source) => run_program(source),
    highlight: (source) => highlight(source),
    check: (source) => check(source),
    version: () => wasmVersion(),
  };
}

const talk = await loadTalk();

for (const el of document.querySelectorAll(".actions .run")) {
  initRunnable(el);
}

for (const el of document.querySelectorAll(".code-editable")) {
  initEditable(el);
}

function initRunnable(el) {
  el.addEventListener("click", async function (e) {
    let container = e.target.closest(".runnable");
    if (!container) return;
    let editor = container.querySelector(".code-editable");
    if (!editor) return;
    let content = editor.value || "";
    let output = await talk.runProgram(content);
    let result = container.querySelector(".result");
    result.innerHTML = `<pre class="output">${output}</pre>`;
    result.classList.add("active");
  });
}

function initEditable(el) {
  let container = el.closest(".runnable");
  if (!container) return;
  let highlight = container.querySelector(".code-highlight");
  if (!highlight) return;

  let isComposing = false;

  let resizeEditor = () => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  let renderHighlight = () => {
    let source = el.value || "";

    let checkResult = check(source);
    if (checkResult) {
      console.log(checkResult);
    }

    highlight.innerHTML = talk.highlight(source);
    syncScroll();
  };

  let handleInput = () => {
    resizeEditor();
    if (isComposing) return;
    renderHighlight();
  };

  let syncScroll = () => {
    highlight.scrollTop = el.scrollTop;
    highlight.scrollLeft = el.scrollLeft;
  };

  el.addEventListener("input", handleInput);
  el.addEventListener("scroll", syncScroll);
  el.addEventListener("compositionstart", () => {
    isComposing = true;
  });
  el.addEventListener("compositionend", () => {
    isComposing = false;
    handleInput();
  });

  resizeEditor();
}

console.log(await talk.runProgram("1 + 2 + 3"));
