export interface User {
  name: string;
  id: string;
  password: string;
}

export interface InventoryObject {
  ojbType: string;
  name: string;
  id: number;
  owner: string;
}

let users: Array<User> = [
  {
    name: "testUser1",
    id: "tu1",
    password: "tu1",
  },
  {
    name: "testUser2",
    id: "tu2",
    password: "tu2",
  },
  {
    name: "testUser3",
    id: "tu3",
    password: "tu3",
  },
];

const defaultInventory: Array<InventoryObject> = [
  {
    ojbType: "book",
    name: `It's a nice book`,
    id: 1,
    owner: "testUser1",
  },
  {
    ojbType: "sword",
    name: `sting`,
    id: 2,
    owner: "testUser2",
  },
  {
    ojbType: "ring",
    name: `precious`,
    id: 3,
    owner: "testUser3",
  },
];

export const fetchUsers = (name: string): Array<User> => {
  if (name.length === 0) {
    return [];
  } else {
    return users.filter((u) => u.name.includes(name));
  }
};

export const insertUser = (u: User) => {
  users.push(u);
};

export const deleteUser = (name: string, id: string) => {
  users = users.filter((u) => u.name !== name || u.id !== id);
};

export const getDefaultInventory = () => {
  return JSON.parse(JSON.stringify(defaultInventory));
};

export const insertIntoInventory = (
  inv: Array<InventoryObject>,
  obj: InventoryObject,
) => {
  inv.push(obj);
};

export const deleteFromInventory = (
  inv: Array<InventoryObject>,
  id: number,
) => {
  return inv.filter((obj) => obj.id !== id);
};
