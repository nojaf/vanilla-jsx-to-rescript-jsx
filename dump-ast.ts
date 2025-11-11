import { parseSync } from "oxc-parser";
import { readFileSync } from "fs";

const testJsxPath = "./test.jsx";

try {
  const input = readFileSync(testJsxPath, "utf-8");
  const parseResult = parseSync(testJsxPath, input, {
    astType: "ts",
    lang: "jsx",
  });

  console.log(JSON.stringify(parseResult.program, null, 2));
} catch (error) {
  if ((error as NodeJS.ErrnoException).code === "ENOENT") {
    console.error(`Error: File ${testJsxPath} not found.`);
    process.exit(1);
  } else {
    throw error;
  }
}

