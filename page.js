import init, { run_program, version as wasmVersion } from "/pkg/talk_wasm.js";

/**
 * Loads the WebAssembly bundle and returns helpers that mirror the talk CLI.
 */
export async function loadTalk() {
  await init();

  return {
    runProgram: (source) => run_program(source),
    version: () => wasmVersion(),
  };
}

const talk = await loadTalk();

for (const el of document.querySelectorAll(".actions .run")) {
  console.log(el);
  initRunnable(el);
}

function initRunnable(el) {
  el.addEventListener("click", async function (e) {
    let container = e.target.closest(".runnable");
    let content = container.querySelector("pre").textContent;
    console.log(content);
    let result = await talk.runProgram(content);
    console.log(result);
  });
}

console.log(await talk.runProgram("1 + 2 + 3"));
