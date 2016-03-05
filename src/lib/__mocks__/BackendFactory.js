/**
 * # Maxleap.js
 * 
 * This class interfaces with Server using the rest api
 * see [https://parse.com/docs/rest/guide](https://parse.com/docs/rest/guide)
 *
 */
'use strict';


const backend = require('./Backend').default;

export default function BackendFactory(token = null) {
  return new backend();
}
