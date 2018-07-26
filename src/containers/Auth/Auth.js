import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from "../../components/UI/Spinner/Spinner";
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import {Redirect,withRouter} from "react-router-dom";

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Mail Address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignUp:true
    }

    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }
        
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }
switchAuthMode = (event) => {
    this.setState(prevState => {
        return {
            isSignUp:!prevState.isSignUp
        }
    })
}
    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        };
        this.setState({controls: updatedControls});
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value,this.state.isSignUp);
    }

    render () {
        const formElementsArray = [];
        for ( let key in this.state.controls ) {
            formElementsArray.push( {
                id: key,
                config: this.state.controls[key]
            } );
        }

        const form = formElementsArray.map( formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={( event ) => this.inputChangedHandler( event, formElement.id )} />
        ) );

        let formValid = <form onSubmit={this.submitHandler}>
          <strong>{this.state.isSignUp?'New User SIGNUP':'Welcome Back User SIGNIN'}</strong>
        {form}
       
        <Button btnType="Success">SUBMIT</Button>
    </form>
    if(this.props.loading){
        formValid = <Spinner/>
    }
    let authRedirect = null;

    if(this.props.isAuth){
        if(this.props.carthasItems){
            authRedirect = <Redirect to ="/checkout"/>
        }
        else{
            authRedirect = <Redirect to ="/"/>
        }
        
    }
        return (
            <div className={classes.Auth}>
            {authRedirect}
             {this.props.error?  <p style={{color:"red"}}>{this.props.error.response.data.error.message}</p> :null}
                  {formValid}
                
                <Button clicked={this.switchAuthMode} btnType="Success">SWITCH TO {this.state.isSignUp?'SIGNIN':'SIGNUP'}</Button>

                <button onClick={this.props.onGoogleAuth} className="btn btn-block btn-primary"><i className="fab fa-google"></i> &nbsp;SignIn With Google</button>
                <button onClick={this.props.onTwitterAuth} className="btn btn-block btn-info"><i className="fab fa-twitter"></i> &nbsp;SignIn With Twitter</button>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        carthasItems:state.cart.length >1,
        loading:state.loading,
        error:state.error,
        isAuth:state.token !== null
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password,isSignUp) => dispatch(actions.auth(email, password,isSignUp)),
        onGoogleAuth:() => dispatch(actions.googleLogin()),
        onTwitterAuth:() =>  dispatch(actions.twitterLogin())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Auth));