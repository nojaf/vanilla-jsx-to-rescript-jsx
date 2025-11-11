import { parseSync, type Node } from "oxc-parser";
import { walk } from "oxc-walker";
import MagicString from "magic-string";

const integerRegex = /^-?\d+$/;
const floatRegex = /^-?\d+(\.\d+)?$/;

const rescriptKeywords = new Set(["type", "open", "as", "in"]);

export function transformJsx(input: string): string {
  const magicString = new MagicString(input);
  const parseResult = parseSync("clipboard-input.tsx", input, {
    astType: "ts",
    lang: "tsx",
  });

  walk(parseResult.program, {
    enter: (node: Node, parent: Node | null) => {
      if (node.type === "JSXAttribute") {
        if (node.value?.type === "Literal" && node.value.raw?.startsWith("'")) {
          magicString.update(
            node.value.start,
            node.value.end,
            `"${node.value.raw.slice(1, -1)}"`,
          );
        }

        // Convert numeric expressions in SVG width/height attributes to strings
        if (
          parent?.type === "JSXOpeningElement" &&
          parent.name.type === "JSXIdentifier" &&
          parent.name.name.toLowerCase() === "svg" &&
          node.name.type === "JSXIdentifier" &&
          (node.name.name === "width" || node.name.name === "height") &&
          node.value?.type === "JSXExpressionContainer" &&
          node.value.expression?.type === "Literal" &&
          typeof node.value.expression.value === "number"
        ) {
          const numericValue = String(node.value.expression.value);
          magicString.update(
            node.value.start,
            node.value.end,
            `"${numericValue}"`,
          );
        }

        if (
          node.name.type === "JSXIdentifier" &&
          rescriptKeywords.has(node.name.name)
        ) {
          magicString.appendRight(node.name.end, "_");
        }

        if (
          node.name.type === "JSXIdentifier" &&
          node.name.name.startsWith("aria-")
        ) {
          magicString.update(
            node.name.start + 4,
            node.name.start + 6,
            node.name.name[5]?.toUpperCase() || "",
          );
        }

        if (
          node.name.type === "JSXIdentifier" &&
          node.name.name === "data-testid"
        ) {
          magicString.update(node.name.start, node.name.end, "dataTestId");
        }

        if (node.value === null) {
          magicString.appendRight(node.end, "=true");
        }
      } else if (node.type === "JSXText") {
        if (node.raw && integerRegex.test(node.raw.trim())) {
          magicString.prependLeft(node.start, "{React.int(");
          magicString.appendRight(node.end, ")}");
        } else if (node.raw && floatRegex.test(node.raw.trim())) {
          magicString.prependLeft(node.start, "{React.float(");
          magicString.appendRight(node.end, ")}");
        } else if (node.value.trim()) {
          magicString.prependLeft(node.start, '{React.string("');
          magicString.appendRight(node.end, '")}');
        }
      }
    },
  });

  return magicString.toString();
}

export default transformJsx;
