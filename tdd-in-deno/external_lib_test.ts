import chai from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it } from "https://deno.land/x/deno_mocha/mod.ts";

const assert = chai.assert;
const expect = chai.expect;

import { deleteUser, fetchUsers, insertUser, User } from "./stubs.ts";

describe("User DB operations testing using chai/mocha", () => {
  it("fetches correct user based on username", () => {
    const user = fetchUsers("testUser");
    assert(user.length === 3);
  });

  it("inserts user correctly", () => {
    const newUser: User = {
      name: "newTestUser",
      id: "newtestuser",
      password: "newtestuser",
    };
    insertUser(newUser);

    const user = fetchUsers("new");
    expect(user).to.have.lengthOf(1);
    expect(user[0].name).to.be.a("string");
    expect(user[0].name).to.equal("newTestUser");
  });

  it("deletes user correctly", () => {
    deleteUser("newTestUser", "newtestuser");
    const user = fetchUsers("test");
    expect(user).to.have.lengthOf(3);
  });
});
