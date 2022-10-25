import {
  afterEach,
  beforeEach,
  describe,
  it,
} from "https://deno.land/std@0.155.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import {
  deleteFromInventory,
  deleteUser,
  fetchUsers,
  getDefaultInventory,
  insertIntoInventory,
  insertUser,
  InventoryObject,
  User,
} from "./stubs.ts";

describe("User DB operations testing", () => {
  it("fetches correct user based on username", () => {
    const user = fetchUsers("testUser");
    assertEquals(user.length, 3);
  });

  it("inserts user correctly", () => {
    const newUser: User = {
      name: "newTestUser",
      id: "newtestuser",
      password: "newtestuser",
    };
    insertUser(newUser);

    const user = fetchUsers("new");
    assertEquals(user.length, 1);
    assertEquals(user[0].name, "newTestUser");
  });

  it("deletes user correctly", () => {
    deleteUser("newTestUser", "newtestuser");
    const user = fetchUsers("test");
    assertEquals(user.length, 3);
  });
});

describe("Inventory operations", () => {
  let inv: Array<InventoryObject>;

  beforeEach(() => {
    inv = getDefaultInventory();
  });

  afterEach(() => {
    inv = [];
  });

  it("inserts object into inventory", () => {
    insertIntoInventory(inv, {
      ojbType: "book",
      name: "just Another book",
      id: 4,
      owner: "testUser3",
    });

    assertEquals(inv.length, 4);
    assertEquals(inv[3], {
      ojbType: "book",
      name: "just Another book",
      id: 4,
      owner: "testUser3",
    });
  });

  it("deletes object from inventory", () => {
    inv = deleteFromInventory(inv, 3);
    assertEquals(inv.length, 2);

    const defaultInv = getDefaultInventory();

    assertEquals(inv[0], defaultInv[0]);
    assertEquals(inv[1], defaultInv[1]);
  });
});
