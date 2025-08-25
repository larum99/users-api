'use strict';

const { randomUUID } = require("crypto");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const dynamo = DynamoDBDocumentClient.from(client);

const USERS_TABLE = process.env.USERS_TABLE;

module.exports.createUser = async (event) => {
  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body || {};

    const nombre = body.name ?? body.nombre;
    const email = body.email;

    if (!nombre || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Faltan campos: nombre/name y email son requeridos" }),
      };
    }

    const user = {
      id: randomUUID(),
      nombre,
      email,
    };

    await dynamo.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: user,
      })
    );

    return {
      statusCode: 201,
      body: JSON.stringify(user),
    };
  } catch (err) {
    console.error("Error al crear usuario:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno al crear usuario" }),
    };
  }
};
