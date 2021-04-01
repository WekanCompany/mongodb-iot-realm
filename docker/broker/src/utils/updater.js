'use strict';

const axios = require('axios');
const os = require('os');
const moment = require('moment');
const realmUtils = require('./realm');

const LOG_PREFIX = 'Updater';

exports.start = function start(
  realm,
  edgeId,
  broker,
  brokerPort,
  updateBaseUrl,
  updateInterval
) {
  setInterval(async () => {
    const configuration = realmUtils.getEdgeConfiguration(realm, edgeId);

    const updateDt = getUpdateDt(
      configuration[0].updateDay,
      configuration[0].updateTime
    );
    const lastUpdateDt = new Date(configuration[0].lastUpdateDt);
    const currentDt = new Date();

    if (updateDt > lastUpdateDt) {
      realm.write(() => {
        const result = realmUtils.getEdgeConfiguration(realm, edgeId);
        result[0].lastUpdateDt = currentDt;
      });

      broker.close();

      await axios
        .post(`${updateBaseUrl}/container/`, {
          currentContainerId: os.hostname(),
          newContainerName: configuration[0].updateImageName,
        })
        .catch((error) => {
          console.log(`[${LOG_PREFIX}] Update failed ...`, error);
        });

      broker.start(brokerPort);
    }
  }, updateInterval * 60 * 1000);
};

function getUpdateDt(updateDay, updateTime) {
  const updateDate = moment().isoWeekday(updateDay);
  const updateTimeArr = updateTime.split(':');

  updateDate.set('hours', updateTimeArr[0]);
  updateDate.set('minutes', updateTimeArr[1]);

  return updateDate.toDate();
}
