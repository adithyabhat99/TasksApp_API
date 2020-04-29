const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");
const Task = require("../src/models/task");
const { user1, user1ID, setUpDB } = require("./fixtures/db");

// Before running each test case
// There are also functions like afterEach, beforeAll, afterAll
beforeEach(setUpDB);

// To stop open handles after test
afterAll(() => mongoose.disconnect());

test("Should create a task for the Gullyboy", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${user1.tokens[0].token}`)
    .send({
      description: "Complete tests",
    })
    .expect(201);
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test("Should fetch Gullyboy's tasks",async ()=>{
    const response = await request(app)
    .get("/tasks")
    .set("Authorization",`Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200);
    // Gullyboy has 2 tasks
    expect(response.body.length).toEqual(2);
});
