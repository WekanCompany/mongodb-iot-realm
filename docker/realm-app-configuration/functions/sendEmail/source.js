exports = async function (arg) {
  const { fullDocument } = arg;
  await context.http.post({
    url: "https://api.sendgrid.com/v3/mail/send",
    headers: {
      authorization:
        "Bearer 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",
      "Content-Type": "application/json",
    },
    body: {
      personalizations: [
        {
          to: [
            { email: "ramachandrang@wekan.company" },
            { email: "ranjanm@wekan.company" },
            { email: "sanchanm@wekan.company" },
          ],
          dynamic_template_data: {
            sensorId: fullDocument.sensorId,
            edgeId: fullDocument.edgeId,
            value: fullDocument.data.value,
          },
        },
      ],
      from: { email: "ramachandrang@wekan.company" },
      template_id: "d-6f4703d08384459ba0ce51341a73c818",
    },
    encodeBodyAsJSON: true,
  });
};