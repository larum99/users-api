'use strict';

const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const sns = new SNSClient();

const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

module.exports.sendEmails = async (event) => {
  try {

    for (const record of event.Records) {
      const userData = JSON.parse(record.body);

      const message = `¡Nuevo usuario creado!
      
      ID: ${userData.id}
      Nombre: ${userData.nombre}
      Email: ${userData.email}
      `;

      const params = {
        Message: message,
        Subject: "Nuevo Usuario Registrado",
        TopicArn: SNS_TOPIC_ARN,
      };

      await sns.send(new PublishCommand(params));
      console.log("Mensaje publicado en SNS con éxito para el usuario:", userData.email);
    }
  } catch (err) {
    console.error("Error al procesar el mensaje de SQS y enviar a SNS:", err);
    
    throw err;
  }
};