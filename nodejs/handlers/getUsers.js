'use strict';

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const dynamodb = DynamoDBDocumentClient.from(client);

const USERS_TABLE = process.env.USERS_TABLE;

module.exports.getUsers = async () => {
  try {
    const result = await dynamodb.send(
      new ScanCommand({ TableName: USERS_TABLE })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items || []),
    };
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno al obtener usuarios" }),
    };
  }
};
