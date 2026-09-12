const express = require("express");
const { validateCreate, validatePatch } = require("./validation");

function createApp(repository) {
  const app = express();
  app.use(express.json());

  app.get("/api/v1/persons", async (req, res, next) => {
    try {
      const persons = await repository.list();
      res.json(persons);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/v1/persons", async (req, res, next) => {
    try {
      const errors = validateCreate(req.body);
      if (errors) {
        return res.status(400).json({ message: "Invalid data", errors });
      }
      const person = await repository.create(req.body);
      res.status(201).location(`/api/v1/persons/${person.id}`).end();
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/v1/persons/:id", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const person = Number.isInteger(id) ? await repository.get(id) : null;
      if (!person) {
        return res.status(404).json({ message: `Person ${req.params.id} not found` });
      }
      res.json(person);
    } catch (err) {
      next(err);
    }
  });

  app.patch("/api/v1/persons/:id", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const errors = validatePatch(req.body);
      if (errors) {
        return res.status(400).json({ message: "Invalid data", errors });
      }
      const person = Number.isInteger(id) ? await repository.update(id, req.body || {}) : null;
      if (!person) {
        return res.status(404).json({ message: `Person ${req.params.id} not found` });
      }
      res.json(person);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/api/v1/persons/:id", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const removed = Number.isInteger(id) ? await repository.remove(id) : false;
      if (!removed) {
        return res.status(404).json({ message: `Person ${req.params.id} not found` });
      }
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}

module.exports = { createApp };
