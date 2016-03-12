import * as constantUtils from '../../../utils/constants'

const prefix = "RE$MODULE$"

export default constantUtils.addPrefix([

  "USER_REGISTER_REQUEST_START",
  "USER_REGISTER_REQUEST_SUCCESS",
  "USER_REGISTER_REQUEST_FAILURE",
  "USER_REGISTER_INIT_START",
  "USER_REGISTER_FORMFIELD_CHANGE",

  "USER_LOGIN_REQUEST_START",
  "USER_LOGIN_REQUEST_SUCCESS",
  "USER_LOGIN_REQUEST_FAILURE",
  "USER_LOGIN_INIT_START",
  "USER_LOGIN_FORMFIELD_CHANGE",

  "USER_LOGOUT_REQUEST_START",
  "USER_LOGOUT_REQUEST_SUCCESS",
  "USER_LOGOUT_REQUEST_FAILURE",
  "USER_LOGOUT_INIT_START",
  "USER_LOGOUT_FORMFIELD_CHANGE",

  "USER_FORGOTPASSWORD_REQUEST_START",
  "USER_FORGOTPASSWORD_REQUEST_SUCCESS",
  "USER_FORGOTPASSWORD_REQUEST_FAILURE",
  "USER_FORGOTPASSWORD_INIT_START",
  "USER_FORGOTPASSWORD_FORMFIELD_CHANGE",

  "USER_PROFILE_GET_START",
  "USER_PROFILE_GET_SUCCESS",
  "USER_PROFILE_GET_FAILURE",

  "USER_PROFILE_UPDATE_START",
  "USER_PROFILE_UPDATE_SUCCESS",
  "USER_PROFILE_UPDATE_FAILURE",

  "USER_PROFILE_INIT_START",
  "USER_PROFILE_FORMFIELD_CHANGE",

],prefix)
