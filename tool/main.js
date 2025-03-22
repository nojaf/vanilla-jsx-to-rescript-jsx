import * as monaco from "monaco-editor-core";
import { shikiToMonaco } from "@shikijs/monaco";
import { createHighlighter } from "shiki";
import copy from "copy-to-clipboard";
import rescriptTM from "./rescript.tmLanguage.json";
import transform from "../index";

const highlighter = await createHighlighter({
  themes: ["vitesse-dark", "vitesse-light"],
  langs: ["javascript", "typescript", "tsx", "jsx", rescriptTM],
});

monaco.languages.register({ id: "typescript" });
monaco.languages.register({ id: "javascript" });
monaco.languages.register({ id: "tsx" });
monaco.languages.register({ id: "jsx" });

shikiToMonaco(highlighter, monaco);

const defaultInput = `<div>
  <label>Email</label>
  <input type="email" required className="meh" />
</div>`;

const editorNode = document.getElementById("editor");
const resultNode = document.getElementById("result");
const openIssueNode = document.getElementById("open-issue");
const copyToClipboardNode = document.getElementById("copy-to-clipboard");

if (editorNode && resultNode && openIssueNode && copyToClipboardNode) {
  const editor = monaco.editor.create(editorNode, {
    value: defaultInput,
    language: "tsx",
    theme: "vitesse-light",
    fontSize: 15,
    minimap: { enabled: false },
    automaticLayout: true,
  });

  let lastResult = "";

  function updateIssueReport() {
    const input = editor.getValue();
    const title = "Issue converting JSX to ReScript";
    const body = `
Hi there! 👋

I'm letting you know that I tried to convert the following JSX to ReScript:

\`\`\`jsx
${input}
\`\`\`

and got:

\`\`\`rescript
${lastResult}
\`\`\`

while I was expecting:

\`<enter expected output here>.\`

I am:
- [ ] Interested in sending a PR and fixing this myself.
- [ ] Hoping someone else will fix this for me. Although, I accept that might not happen.
`;
    const url = encodeURI(
      `https://github.com/nojaf/telplin/issues/new?title=${title}&body=${body}`,
    );

    openIssueNode.setAttribute("href", url);
  }

  function updateOutput() {
    try {
      const input = editor.getValue();
      let transformed = transform(`<>${input}</>`);
      if (transformed.startsWith("<>")) {
        transformed = transformed.slice(2, -3);
      }
      lastResult = transformed;
      updateIssueReport();
      const html = highlighter.codeToHtml(transformed, {
        lang: "ReScript",
        theme: "vitesse-light",
      });
      resultNode.innerHTML = html;
    } catch (err) {
      lastResult = "";
      updateIssueReport();
      resultNode.innerHTML = `<pre style="color:red;">${String(err)}</pre>`;
    }
  }

  // Initial render
  updateOutput();

  // Listen to changes
  editor.onDidChangeModelContent(updateOutput);

  window.addEventListener("resize", () => {
    updateOutput();
  });

  copyToClipboardNode.addEventListener("click", () => {
    copy(lastResult);
    copyToClipboardNode.lastElementChild.textContent = "Copied!";
    setTimeout(() => {
      copyToClipboardNode.lastElementChild.textContent = "Copy to clipboard";
    }, 1000);
  });
}
