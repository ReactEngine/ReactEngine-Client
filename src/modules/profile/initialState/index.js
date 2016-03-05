/**
 * # profileInitialState.js
 * 
 * This class is a Immutable object
 * Working *successfully* with Redux, requires
 * state that is immutable.
 *
 */
'use strict';

const  {Record} = require('immutable');

/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 *
 * The originalProfile is what Server provided and has the objectId
 * The fields are what display on the UI
 */
const Form = Record({
  originalProfile: new(Record({
    username: null,
    email: null,
    objectId: null,
    emailVerified: null
  })),
  disabled: false,
  error: null,
  isValid: false,
  isFetching: false,
  fields: new (Record({
    username: '',
    usernameHasError: false,
    email: '',
    emailHasError: false,
    emailVerified: false
  }))
});


var InitialState = Record({
  form: new Form
});

export default InitialState;
