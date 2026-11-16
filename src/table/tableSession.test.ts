import { afterEach, vi } from "vitest";
import {
  loadTable,
  parseTable,
  saveTable,
  TABLE_KEY,
} from "@/table/tableSession";

afterEach(() => {
  vi.restoreAllMocks();
  window.sessionStorage.clear();
});

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

describe("table storage", () => {
  it("saves, loads and clears the table", () => {
    saveTable(7);
    expect(window.sessionStorage.getItem(TABLE_KEY)).toBe("7");
    expect(loadTable()).toBe(7);
    saveTable(null);
    expect(loadTable()).toBeNull();
  });

  it("ignores a corrupt stored value", () => {
    window.sessionStorage.setItem(TABLE_KEY, "999");
    expect(loadTable()).toBeNull();
  });

  it("tolerates sessionStorage that throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(loadTable()).toBeNull();
    expect(() => saveTable(3)).not.toThrow();
  });
});
