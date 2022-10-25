import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { deleteUser, fetchUsers, insertUser, User } from "./stubs.ts";

Deno.test("update User Name", async (t) => {
  const name = "testUser1";
  const newName = "testUserUpdated";
  let user: User;

  await t.step("fetch user", () => {
    const temp = fetchUsers(name);
    assertEquals(temp.length, 1);
    assertEquals(temp[0].name, name);
    user = temp[0];
  });

  await t.step("update and store", () => {
    const newUser: User = {
      ...user,
      name: newName,
    };
    insertUser(newUser);

    let temp = fetchUsers(newName);

    assertEquals(temp.length, 1);
    assertEquals(temp[0].name, newName);
    assertEquals(temp[0].id, user.id);
    assertEquals(temp[0].password, user.password);

    temp = fetchUsers(name);
    assertEquals(temp.length, 1);
    assertEquals(temp[0].name, name);
  });

  await t.step("delete old user data", () => {
    deleteUser(user.name, user.id);

    let temp = fetchUsers(name);
    assertEquals(temp.length, 0);

    temp = fetchUsers(newName);
    assertEquals(temp.length, 1);
  });
});
