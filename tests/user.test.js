const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");
const { user1, user1ID, setUpDB } = require("./fixtures/db");

// Before running each test case
// There are also functions like afterEach, beforeAll, afterAll
beforeEach(setUpDB);

// To stop open handles after test
afterAll(() => mongoose.disconnect());

test("Should sign up a user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Adithya",
      email: "adithya@test.com",
      password: "Thisisa123pswd!",
    })
    .expect(201);
});

test("Should login Gullyboy", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: user1.email,
      password: user1.password,
    })
    .expect(200);
});

test("Should not login fake Gullyboy", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: user1.email,
      password: "I am Gullyboy",
    })
    .expect(400);
});

test("Should get profile for Gullyboy", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for Gullyboy", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Shoould upload an image to avatar", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${user1.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/default.jpg")
    .expect(200);
  const user = await User.findById(user1ID);
  // Use toEqual instead of toBe for objects (toBe uses ===)
  expect(user.avatar).toEqual(expect.any(Buffer));
});
