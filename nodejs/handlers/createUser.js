'use strict';

const { randomUUID } = require("crypto");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const client = new DynamoDBClient();
const dynamo = DynamoDBDocumentClient.from(client);
const sqs = new SQSClient(); 

const USERS_TABLE = process.env.USERS_TABLE;
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL; 

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

    const sendMessageParams = {
      QueueUrl: SQS_QUEUE_URL,
      MessageBody: JSON.stringify(user),
    };
    await sqs.send(new SendMessageCommand(sendMessageParams));
    
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