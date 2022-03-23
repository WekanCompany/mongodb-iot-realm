exports = async function (arg) {
  const { fullDocument } = arg;
  await context.http.post({
    url: "https://api.sendgrid.com/v3/mail/send",
    headers: {
      authorization:
        "YOUR_SENDGRID_API_KEY",
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
      template_id: "YOUR_TEMPLATE_ID",
    },
    encodeBodyAsJSON: true,
  });
};