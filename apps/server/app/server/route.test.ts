import test from "node:test"
import assert from "node:assert/strict"

import { GET } from "./route"

test("GET /server returns the server health response", async () => {
  const response = await GET()

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), {
    service: "server",
    status: "ok",
  })
})
