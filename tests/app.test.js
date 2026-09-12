const request = require("supertest");
const { createApp } = require("../src/app");

function createFakeRepository() {
  let nextId = 1;
  const store = new Map();

  return {
    async list() {
      return [...store.values()];
    },
    async get(id) {
      return store.get(id) || null;
    },
    async create({ name, age, address, work }) {
      const person = { id: nextId++, name, age, address, work };
      store.set(person.id, person);
      return person;
    },
    async update(id, patch) {
      const existing = store.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...patch };
      store.set(id, updated);
      return updated;
    },
    async remove(id) {
      return store.delete(id);
    },
  };
}

describe("Person REST API", () => {
  let app;

  beforeEach(() => {
    app = createApp(createFakeRepository());
  });

  test("POST /api/v1/persons creates a person and returns 201 with Location header", async () => {
    const res = await request(app)
      .post("/api/v1/persons")
      .send({ name: "Ivan", age: 30, address: "Moscow", work: "Acme" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({});
    expect(res.headers.location).toMatch(/^\/api\/v1\/persons\/\d+$/);
  });

  test("POST /api/v1/persons without name returns 400", async () => {
    const res = await request(app).post("/api/v1/persons").send({ age: 30 });

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty("name");
  });

  test("GET /api/v1/persons/:id returns the created person", async () => {
    const createRes = await request(app)
      .post("/api/v1/persons")
      .send({ name: "Petr", age: 25, address: "Spb", work: "Beta" });
    const id = createRes.headers.location.split("/").pop();

    const res = await request(app).get(`/api/v1/persons/${id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ name: "Petr", age: 25, address: "Spb", work: "Beta" });
  });

  test("GET /api/v1/persons/:id returns 404 for unknown id", async () => {
    const res = await request(app).get("/api/v1/persons/999999");
    expect(res.status).toBe(404);
  });

  test("PATCH /api/v1/persons/:id updates only provided fields", async () => {
    const createRes = await request(app)
      .post("/api/v1/persons")
      .send({ name: "Anna", age: 40, address: "Kazan", work: "Gamma" });
    const id = createRes.headers.location.split("/").pop();

    const res = await request(app)
      .patch(`/api/v1/persons/${id}`)
      .send({ name: "Anna K.", address: "Ufa" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      name: "Anna K.",
      address: "Ufa",
      age: 40,
      work: "Gamma",
    });
  });

  test("DELETE /api/v1/persons/:id removes the person and returns 204", async () => {
    const createRes = await request(app)
      .post("/api/v1/persons")
      .send({ name: "Oleg" });
    const id = createRes.headers.location.split("/").pop();

    const deleteRes = await request(app).delete(`/api/v1/persons/${id}`);
    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get(`/api/v1/persons/${id}`);
    expect(getRes.status).toBe(404);
  });
});
