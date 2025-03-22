import { parseSync } from "oxc-parser";
import { walk } from "oxc-walker";
import type { Node } from "oxc-walker";
import MagicString from "magic-string";

const integerRegex = /^-?\d+$/;
const floatRegex = /^-?\d+(\.\d+)?$/;

const rescriptKeywords = new Set(["type", "open", "as", "in"]);

function transform(input: string): string {
  const magicString = new MagicString(input);
  const parseResult = parseSync("meh.tsx", input, {
    astType: "ts",
    lang: "tsx",
  });

  walk(parseResult.program, {
    enter: (node: Node, parent) => {
      // node is typed correctly
      if (node.type === "JSXAttribute") {
        // Replace single quotes with double quotes
        if (node.value?.type === "Literal" && node.value.raw?.startsWith("'")) {
          magicString.update(
            node.value.start,
            node.value.end,
            `"${node.value.raw.slice(1, -1)}"`,
          );
        }

        // Append _ if is rescript keyword
        if (
          typeof node.name.name === "string" &&
          rescriptKeywords.has(node.name.name)
        ) {
          magicString.appendRight(node.name.end, "_");
        }

        // Update aria-* to aria*
        if (
          typeof node.name.name === "string" &&
          node.name.name.startsWith("aria-")
        ) {
          // Replace dash + lowercase letter with uppercase letter
          magicString.update(
            node.name.start + 4,
            node.name.start + 6,
            node.name.name[5]?.toUpperCase() || "",
          );
        }

        // Update data-testid to dataTestid
        if (node.name.name === "data-testid") {
          magicString.update(node.name.start, node.name.end, "dataTestId");
        }

        // Replace punning with prop=true
        if (node.value === null) {
          magicString.appendRight(node.end, "=true");
        }
      } else if (node.type === "JSXText") {
        if (node.raw && integerRegex.test(node.raw.trim())) {
          // Wrap integer in React.int
          magicString.prependLeft(node.start, "{React.int(");
          magicString.appendRight(node.end, ")}");
        } else if (node.raw && floatRegex.test(node.raw.trim())) {
          // Wrap float in React.float
          magicString.prependLeft(node.start, "{React.float(");
          magicString.appendRight(node.end, ")}");
        } else if (node.value.trim()) {
          // Wrap text in React.string
          magicString.prependLeft(node.start, '{React.string("');
          magicString.appendRight(node.end, '")}');
        }
      }
    },
  });

  return magicString.toString();
}

export default transform;
