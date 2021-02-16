const express = require('express');
const Docker = require('dockerode');
const axios = require('axios');

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const app = express();
app.disable('x-powered-by');

app.use(express.json());

const BROKER_BASE_URL = process.env.BROKER_BASE_URL;
const port = 9000;

app.post('/container/', async (req, res) => {
  const currentContainerId = req.body.currentContainerId;
  const newImageName = req.body.newContainerName;
  let status = 'updated';

  const currentContainer = docker.getContainer(currentContainerId);
  const containerInfo = await currentContainer.inspect();

  const currentImageName = containerInfo.Config.Image;

  return docker
    .pull(newImageName)
    .then(async (result) => {
      if (currentContainer) {
        await currentContainer.stop();
        await currentContainer.remove();
      }
      return createBrokerContainer(newImageName).on('container', function (
        container
      ) {
        setTimeout(() => {
          axios
            .get(`${BROKER_BASE_URL}/health`)
            .then(async (response) => {
              if (response.status === 200 && response.data) {
                return res.status(200).json({ status: status });
              }
              return revertToStable(container, currentImageName, res);
            })
            .catch(async (error) => {
              return revertToStable(container, currentImageName, res, error);
            });
        }, 10000);
      });
    })
    .catch((error) => res.status(500).json({ error: String(error) }));
});

async function revertToStable(container, imageName, res, error) {
  if (container) {
    await container.stop();
    await container.remove();
  }
  createBrokerContainer(imageName);
  res.status(500).json({
    status: 'reverted',
    desc: 'Failed to update image, reverted to last stable version',
    error: String(error),
  });
}

function createBrokerContainer(imageName) {
  return docker.run(
    imageName,
    [],
    null,
    {
      name: 'broker',
      HostConfig: {
        NetworkMode: 'realm-aedes-net',
        RestartPolicy: { Name: 'unless-stopped' },
        PortBindings: {
          '1883/tcp': [{ HostIP: '0.0.0.0', HostPort: '1883' }],
          '3000/tcp': [{ HostIP: '0.0.0.0', HostPort: '3000' }],
        },
      },
      Env: [
        'EDGE_ID=' + process.env.EDGE_ID,
        'REALM_APP_ID=' + process.env.REALM_APP_ID,
        'REALM_EMAIL=' + process.env.REALM_EMAIL,
        'REALM_PASSWORD=' + process.env.REALM_PASSWORD,
        'COMPACTION_CHECK_INTERVAL=' + process.env.COMPACTION_CHECK_INTERVAL,
        'MESSAGE_SYNC_INTERVAL=' + process.env.MESSAGE_SYNC_INTERVAL,
        'UPDATE_BASE_URL=' + process.env.UPDATE_BASE_URL,
        'UPDATE_CHECK_INTERVAL=' + process.env.UPDATE_CHECK_INTERVAL,
      ],
    },
    function (error, data, container) {
      if (error) {
        console.log('Docker run failed', error);
      }
    }
  );
}

app.listen(port, () => {
  console.log(`Updater listening at ${port}`);
});
