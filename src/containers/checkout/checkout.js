import React, { Component } from 'react';
import Button from "../../components/UI/Button/Button";
import classes from "./Checkout.css";
import axios from "axios";
import Spinner from "../../components/UI/Spinner/Spinner";
import Input from "../../components/UI/Input/Input";
import {connect} from "react-redux";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

 class Checkout extends Component {
     componentDidMount = () => {
        const token = localStorage.getItem("token");
        const userId =localStorage.getItem("userId")
        const queryParams = '?auth=' + token;
        axios.get(`https://food-ordering-6ccba.firebaseio.com/orders.json` + queryParams)
        .then(res => {

            let userOrder = [];
           
        for (let order in res.data) {
            if(res.data[order].userId === userId){
                userOrder.push(res.data[order].formData)
            }
            
        }
        const updatedOrderForm = JSON.parse(JSON.stringify(this.state.orderForm))
            if(userOrder.length>=1){
                for(let id in updatedOrderForm){
           
                    updatedOrderForm[id].value = userOrder[userOrder.length-1][id];
                   
                   }
                  
               this.setState({orderForm:updatedOrderForm,formValid:true})
            }
               
        }).catch(e => {
        
        })
   
     }
    elementConfig = (placeHolder,type) => {
        return {
           
                elementType:'input',
                elementConfig:{
                    type:type||"text",
                    placeholder:placeHolder || ""
                },
                value:"",
                valdiator:{
                    isRequired:true,
                    minLength:5,
                    maxLength:100
                },
                isValid:false,
                touched:false
    }
}

    state = {
        orderForm: {

            name:this.elementConfig("Your Name"),
            street: this.elementConfig("Your Street Address"),
            zipCode: this.elementConfig("Your Zip Code"),
            country: this.elementConfig("Your Country"),
            email: this.elementConfig("Your Email","email"),
    },
    formValid:false,
    loading: false,
    newAddress:false
}

    orderHandler = (e) => {
        e.preventDefault()
        const formData ={};
        for(let formIdentity in this.state.orderForm){
            formData[formIdentity] = this.state.orderForm[formIdentity].value
        }
        this.setState({ loading: true })
        let currentTime = new Date();
        let date = [currentTime.getDate(),currentTime.getMonth()+1,currentTime.getFullYear()]
        const order = {
            formData,
            items: this.props.items,
            date,
            userId:this.props.userId

        }
   
        axios.post(`https://food-ordering-6ccba.firebaseio.com/orders.json?auth=`+this.props.token, order)
            .then(res => {
                this.setState({ loading: false })
                this.props.oderSuccess()
                this.props.history.push("/");
    
            })
            .catch(err => this.setState({ loading: false }))
        
    }
    validHandler = (value,rules) => {
        let valid = false;
      if(rules.isRequired){
          valid = value.trim() !== "";
      }
        return valid
    }
    changeHandler = (event,id) => {
        const updatedOrderForm = JSON.parse(JSON.stringify(this.state.orderForm))
        updatedOrderForm[id].value = event.target.value;
        if( updatedOrderForm[id].valdiator){
            updatedOrderForm[id].isValid = this.validHandler(updatedOrderForm[id].value,updatedOrderForm[id].valdiator)
            updatedOrderForm[id].touched = true;
        }
     let formValid = true;
  if(this.state.newAddress){
    for(let formIdentity in  updatedOrderForm){
        formValid = updatedOrderForm[formIdentity].isValid && formValid
    }
  }
  this.setState({orderForm:updatedOrderForm,formValid})


    }
    formResetHandler = () => {
        const updatedOrderForm = JSON.parse(JSON.stringify(this.state.orderForm))

        for(let id in updatedOrderForm){
    
         updatedOrderForm[id].value = "";
        }
   
    this.setState({orderForm:updatedOrderForm,newAddress:true})
    }
    render() {
        let formElementArray = [];
        for(let key in this.state.orderForm){
             formElementArray.push({
                 id:key,
                 config:this.state.orderForm[key]
             })

        }
        let Inputs = formElementArray.map(formElement => (
            <Input touched={formElement.config.touched} shouldValidate={formElement.config.valdiator} invalid={!formElement.config.isValid} changed={(e) => this.changeHandler(e,formElement.id)} key={formElement.id} elementType={formElement.config.elementType} elementConfig={formElement.config.elementConfig} value={formElement.config.value} />
         ))
   
        let form = (<form onSubmit={this.orderHandler}>
             {Inputs}
            <Button disabled={!this.state.formValid} btnType="Success">ORDER</Button>
        </form>);
        if (this.state.loading) {
            form = <Spinner />;

        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}  <button onClick={this.formResetHandler} className="btn btn-link mr-4">New address Click Here</button>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
 return {
     token:state.token,
     userId:state.userId,
    items :state.cart
 }
}
const mapDispatchToprops = (dispatch) => {
    return {
        oderSuccess : () => dispatch({type:"ORDER_SUCCESS"})
    }
}
export default connect(mapStateToProps,mapDispatchToprops)(withErrorHandler(Checkout,axios))