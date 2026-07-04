export const OPEN_API_EDITOR_INITIAL_VALUE = `openapi: 3.0.0
info:
  title: My API
  version: 1.0.0
paths:
  /paths:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: ""
      responses:
        "201":
          description: ""
          content:
            application/json:
              schema:
                $ref: ""
components:
  schemas:
    User:
      "type": "object"`;
