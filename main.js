const LCUConnector = require("lcu-connector");
const connector = new LCUConnector();

connector.on("connect", (data) => {
  console.log(data);
});
connector.start();
