import { test, expect } from "bun:test";
import transfrom from "../index";

test("13 became React.int", () => {
  expect(transfrom("<span>13</span>")).toMatchSnapshot();
});

test(" 7  became React.int", () => {
  expect(transfrom("<span> 7 </span>")).toMatchSnapshot();
});

test("4.2 became React.float", () => {
  expect(transfrom("<span>4.2</span>")).toMatchSnapshot();
});

test("33.7 became React.float", () => {
  expect(transfrom("<span> 33.7 </span>")).toMatchSnapshot();
});

test("single space does not become React.string", () => {
  expect(transfrom("<span> </span>")).toMatchSnapshot();
});

test("newline does not become React.string", () => {
  expect(
    transfrom(`<span>
</span>`),
  ).toMatchSnapshot();
});
