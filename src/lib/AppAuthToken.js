/**
 * # AppAuthToken.js
 * 
 * A thin wrapper over the react-native-simple-store
 *
 */
'use strict'
/**
 * ## Imports
 * 
 * Redux  & the config file
 */ 
import store from 'react-native-simple-store'


export default class AppAuthToken {

  /**
   * ### storeAccessToken
   * Store the session key 
   */
  storeAccessToken(accessToken) {
    return store.save('ACCESSTOKEN',{
      accessToken: accessToken
    })

  }
  /**
   * ### getAccessToken
   * @param {Object} accessToken the currentUser object from maxleap.cn
   *
   * When Hot Loading, the accessToken  will be passed in, and if so,
   * it needs to be stored on the device.  Remember, the store is a
   * promise so, have to be careful.
   */
  getAccessToken(accessToken) {
    if (accessToken) {
      return store.save('ACCESSTOKEN',{
          accessToken: accessToken
      }).then(() => {
        return store.get('ACCESSTOKEN')
      })
    }
    return store.get('ACCESSTOKEN')
  }
  /**
   * ### deleteAccessToken
   * Deleted during log out
   */
  deleteAccessToken() {
    return store.delete('ACCESSTOKEN')
  }
}

