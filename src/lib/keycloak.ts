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
async function init(storeInstance: any, onInitCallback: any) {
  try {
    let newLogin = false
    if (storeInstance.authenticated) {
      authenticated = await keycloak.init({
        refreshToken: storeInstance.user.refToken,
        token: storeInstance.user.token
      })
    } else {
      authenticated = await keycloak.init()
      newLogin = true
    }
    if (authenticated) {
      // if (keycloak.isTokenExpired()) {
      //   // { onLoad: 'login-required' }
      //   await storeInstance.refreshUserToken()
      // }
      keycloak.onTokenExpired = function () {
        storeInstance.refreshUserToken()
      }
      if (newLogin) {
        // send login request to backend
      }
    }
    await initStore(storeInstance)
    // alert(authenticated)
    // initStore(storeInstance)
    // store.CallInitStore(keycloak)
  } catch (error) {
    console.error('Keycloak init failed')
    console.error(error)
  }
  onInitCallback()
}

async function login(storeInstance) {
  try {
    storeInstance.clearUserData()
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
    // if (!authenticated) {
    // alert('not authenticated')
    // }
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
  await keycloak.updateToken()
  //   .then((refreshed) => {
  //   if (refreshed) {
  //     console.debug('Token refreshed')
  //   } else {
  //     console.warn(
  //       'Token not refreshed, valid for ' +
  //         Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) +
  //         ' seconds'
  //     )
  //   }
  // })
  return keycloak
}

const KeycloakService = {
  CallInit: init,
  CallInitStore: initStore,
  CallLogout: logout,
  CallTokenRefresh: refreshToken,
  CallLogin: login
}

export default KeycloakService
