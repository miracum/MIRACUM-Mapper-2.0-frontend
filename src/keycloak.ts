import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'YOUR_KEYCLOAK_URL',
  realm: 'YOUR_REALM',
  clientId: 'YOUR_CLIENT_ID',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;