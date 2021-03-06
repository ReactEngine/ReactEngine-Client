/**
 * # Login.js
 * 
 * This class is a little complicated as it handles multiple states.
 *
 */
'use strict'
/**
 * ## Imports
 * 
 * Redux 
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


/**
 * Immutable
 */ 
import {Map} from 'immutable'

/**
 * Router actions
 */
import { Actions as routerActions }  from 'react-native-router-flux'

/**
 * The Header will display a Image and support Hot Loading
 */
import Header from '../../../common/components/Header'
/**
 * The ErrorAlert displays an alert for both ios & android
 */
import ErrorAlert from '../../../common/components/ErrorAlert'
/**
 * The FormButton will change it's text between the 4 states as necessary
 */
import FormButton from '../../../common/components/FormButton'
/**
 *  The UserForm does the heavy lifting of displaying the fields for
 * textinput and displays the error messages
 */
import UserForm from './form'
/**
 * The itemCheckbox will toggle the display of the password fields 
 */
import ItemCheckbox from '../../../common/components/ItemCheckbox'

/**
 * The necessary React components
 */
import React,
{
  Component,
  StyleSheet,
  ScrollView,
  Text,
  TouchableHighlight,
  View
}
from 'react-native'

import Dimensions from 'Dimensions'
var {height, width} = Dimensions.get('window') // Screen dimensions in current orientation

/**
 * ## Styles
 */
var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1
  },
  inputs: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10
  },
  forgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  }
})
/**
 * ## Redux boilerplate
 */
const actions = [
]

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  const creators = Map()
          .merge(...actions)
          .filter(value => typeof value === 'function')
          .toObject()

  return {
    actions: bindActionCreators(creators, dispatch),
    dispatch
  }
}

class UserComponent extends Component {
  constructor(props) {
    super(props)
    this.errorAlert = new ErrorAlert()
    this.state ={
      value: {
        email: this.props.currentViewState.form.fields.email,
        password: this.props.currentViewState.form.fields.password,
      }
    }
  }
  
  /**
   * ### componentWillReceiveProps
   * As the properties are validated they will be set here.
   */
  componentWillReceiveProps(nextprops) {
    this.setState({
      value: {
      	email: nextprops.currentViewState.form.fields.email,
      	password: nextprops.currentViewState.form.fields.password,
      }
    })
  }
  
  /**
   * ### onChange
   *
   * As the user enters keys, this is called for each key stroke.
   * Rather then publish the rules for each of the fields, I find it
   * better to display the rules required as long as the field doesn't
   * meet the requirements.
   * *Note* that the fields are validated by the authReducer
   */
  onChange(value) { 
    if (value.email != '') {
      this.props.formFieldChange('email',value.email)
    }
    if (value.password != '') {
      this.props.formFieldChange('password',value.password)
    }
    this.setState(
      {value}
    )
  }
  
  /**
   * ### render
   * Setup some default presentations and render 
   */
  render() {
    var loginButtonText = this.props.loginButtonText
    var onButtonPress = this.props.onButtonPress
    var displayPasswordCheckbox = this.props.displayPasswordCheckbox
    var passwordCheckbox = <Text/>

    let self = this

    // display the login / register / change password screens
    this.errorAlert.checkError(this.props.currentViewState.form.error)
    
    /**
     * Toggle the display of the Password and PasswordAgain fields
     */
    if (displayPasswordCheckbox) {
      passwordCheckbox =
      <ItemCheckbox
          text="Show Password"
          disabled={this.props.currentViewState.form.isFetching}
          onCheck={() => {
	           this.props.formFieldChange('showPassword',true)
            }}
          onUncheck={() => {
	           this.props.formFieldChange('showPassword',false)
            }}
      />
    }

    /**
     * The Form is now defined with the required fields.  Just
     * surround it with the Header and the navigation messages
     * Note how the button too is disabled if we're fetching. The 
     * header props are mostly for support of Hot reloading. 
     * See the docs for Header for more info.
     */
    
    return(
      <View style={styles.container}>
      	<ScrollView horizontal={false} width={width} height={height}>
        	<View>
            
            
        	    <Header isFetching={this.props.currentViewState.form.isFetching}
                            showState={this.props.global.showState}
                            currentState={this.props.global.currentState}
                            onGetState={this.props.actions.getState}
                            onSetState={this.props.actions.setState}                      
        	    />
        	    
        	    <View style={styles.inputs}>
        	      <UserForm
                          form={this.props.currentViewState.form}
                          value={this.state.value}
                          onChange={self.onChange.bind(self)}
        	      />

        	      {passwordCheckbox}
              </View>
        	    
        	    <FormButton
                        isDisabled={!this.props.currentViewState.form.isValid || this.props.currentViewState.form.isFetching}
                        onPress={onButtonPress}
                        buttonText={loginButtonText}/>
        	    
        	    <View >
        	      <View style={styles.forgotContainer}>
                   <TouchableHighlight 
                    onPress={() => {
                        // userStateActions.register()
                        //路由切换
                        routerActions.userRegister()
                      }} >
                  <Text>Register</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => {
                        // userStateActions.forgotPassword()
                        //路由切换
                        routerActions.userForgotPassword()
                      }} >
                  <Text>Forgot Password?</Text>
                </TouchableHighlight>
                </View>
      	   </View>	 
      	    
      	  </View>
      	</ScrollView>
      </View>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(UserComponent)
