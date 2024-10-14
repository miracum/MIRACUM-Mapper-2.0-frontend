import Keycloak from 'keycloak-js'

const options = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  realm: import.meta.env.VITE_KEYCLOAK_REALM
}

const keycloak = new Keycloak(options)
let authenticated: boolean
// let store = null

/**
 * Initializes Keycloak, then run callback. This will prompt you to login.
 *
 * @param onAuthenticatedCallback
 */
async function init(onInitCallback: any) {
  try {
    authenticated = await keycloak.init({}) // { onLoad: 'login-required' }
    // alert(authenticated)
    // initStore(storeInstance)
    // store.CallInitStore(keycloak)
    onInitCallback()
  } catch (error) {
    console.error('Keycloak init failed')
    console.error(error)
  }
}

async function login(storeInstance: any) {
  try {
    await keycloak.login()
    // initStore(storeInstance)
  } catch (error) {
    console.error('Keycloak login failed')
    console.error(error)
  }
}

/**
 * Initializes store with Keycloak user data
 *
 */
async function initStore(storeInstance: any) {
  try {
    // store = storeInstance
    storeInstance.initOauth(keycloak, false)

    // Show alert if user is not authenticated
    if (!authenticated) {
      // alert('not authenticated')
    }
  } catch (error) {
    console.error('Keycloak init failed')
    console.error(error)
  }
}

/**
 * Logout user
 */
function logout(url: string) {
  keycloak.logout({ redirectUri: url })
}

/**
 * Refreshes token
 */
async function refreshToken() {
  try {
    await keycloak.updateToken(480)
    return keycloak
  } catch (error) {
    console.error('Failed to refresh token')
    console.error(error)
  }
}

const KeycloakService = {
  CallInit: init,
  CallInitStore: initStore,
  CallLogout: logout,
  CallTokenRefresh: refreshToken,
  CallLogin: login
}

export default KeycloakService
