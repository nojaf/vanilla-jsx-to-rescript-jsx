import { test, expect } from "bun:test";
import transfrom from "../index";

test("type became type_", () => {
  expect(transfrom('<input type="text" />')).toMatchSnapshot();
});

test("single quotes become double", () => {
  expect(transfrom("<input type='text' />")).toMatchSnapshot();
});

test("punning becomes prop=true", () => {
  expect(transfrom("<input disabled />")).toMatchSnapshot();
});

test("open becomes open_", () => {
  expect(transfrom("<dialog open />")).toMatchSnapshot();
});

test("as becomes as", () => {
  expect(transfrom('<dialog as="foo" />')).toMatchSnapshot();
});

test("aria-details becomes ariaDetails", () => {
  expect(transfrom('<dialog aria-details="foo" />')).toMatchSnapshot();
});

test("aria-grabbed becomes ariaGrabbed", () => {
  expect(transfrom("<dialog aria-grapped />")).toMatchSnapshot();
});

test("data-testid becomes dataTestid", () => {
  expect(transfrom('<dialog data-testid="foo" />')).toMatchSnapshot();
});

test("dark prop punning", () => {
  expect(
    transfrom(`<dark-mode-toggle
    id="dark-mode-toggle-1"
    legend="Theme Switcher"
    appearance="switch"
    dark      
    light="Light"
    remember="Remember this"
  ></dark-mode-toggle>`),
  ).toMatchSnapshot();
});
