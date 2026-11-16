import { parseTable, readAccess } from "@/table/tableSession";

describe("parseTable", () => {
  it("accepts integers from 1 to max", () => {
    expect(parseTable("7", 20)).toBe(7);
    expect(parseTable("1", 20)).toBe(1);
    expect(parseTable("20", 20)).toBe(20);
  });

  it.each([null, "", "0", "21", "3.5", "abc", "07", "-1", " 7"])(
    "rejects %j",
    (raw) => {
      expect(parseTable(raw, 20)).toBeNull();
    },
  );
});

describe("readAccess", () => {
  const KEY = "abcDEF1234567890_-xyz";

  it("returns the table when the key and n are valid", () => {
    expect(readAccess(`?k=${KEY}&n=7`, KEY, 20)).toBe(7);
    expect(readAccess(`?n=20&k=${KEY}`, KEY, 20)).toBe(20);
  });

  it.each([
    ["wrong key", `?k=otra&n=7`],
    ["no key", `?n=7`],
    ["empty key param", `?k=&n=7`],
    ["no n", `?k=${KEY}`],
    ["n = 0", `?k=${KEY}&n=0`],
    ["n out of range", `?k=${KEY}&n=21`],
    ["n with leading zero", `?k=${KEY}&n=07`],
    ["n not a number", `?k=${KEY}&n=abc`],
    ["empty search", ""],
  ])("returns null with %s", (_name, search) => {
    expect(readAccess(search, KEY, 20)).toBeNull();
  });

  it("fails closed when the configured key is undefined or empty", () => {
    expect(readAccess(`?k=${KEY}&n=7`, undefined, 20)).toBeNull();
    expect(readAccess(`?k=&n=7`, "", 20)).toBeNull();
  });

  it("uses site.tables as the default maximum", () => {
    expect(readAccess(`?k=${KEY}&n=20`, KEY)).toBe(20);
    expect(readAccess(`?k=${KEY}&n=21`, KEY)).toBeNull();
  });
});
