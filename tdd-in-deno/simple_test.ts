import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { fetchUsers } from "./stubs.ts";

Deno.test("return empty array on empty string", () => {
  const users = fetchUsers("");
  assertEquals(users.length, 0);
});

Deno.test("return all users matching given name", () => {
  const users = fetchUsers("test");
  assertEquals(users.length, 3);
  assertEquals(users[0].name, "testUser1");
  assertEquals(users[1].name, "testUser2");
  assertEquals(users[2].name, "testUser3");
});

Deno.test("return empty array on not matching name", () => {
  const users = fetchUsers("abc");
  assertEquals(users.length, 0);
});
