import bcrypt from "bcrypt";

const users = [
  {
    name: "Bob",
    email: "bob@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Steve",
    email: "steve@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
