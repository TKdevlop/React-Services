import React, {
    Component
} from 'react'
import Button from "../../components/UI/Button/Button";
import classes from "./admin.css";
import axios from "axios";
import Spinner from "../../components/UI/Spinner/Spinner";
import Input from "../../components/UI/Input/Input";
import {
    connect
} from "react-redux";
import {
    withRouter
} from "react-router-dom";
import firebase from 'firebase/app';
import 'firebase/storage';

class AdminItems extends Component {
    componentDidMount = async () => {
        let { data } = await axios.get("https://food-ordering-6ccba.firebaseio.com/Catagories.json")
        let catagories = [];
        for (let catagorie in data) {
            catagories.push({
                value: catagorie,
                displayValue: catagorie
            })
        }

        let updated = JSON.parse(JSON.stringify(this.state.orderForm));
        updated.catagories.elementConfig.options = catagories
        this.setState({ orderForm: updated })
    }
    elementConfig = (placeHolder, type) => {
        return {

            elementType: type || 'input',
            elementConfig: {
                type: type || "text",
                placeholder: placeHolder || ""
            },
            value: "",
            valdiator: {
                isRequired: true,
                minLength: 0,
                maxLength: 1000
            },
            isValid: false,
            touched: false
        }
    }

    state = {
        show: false,
        orderForm: {
            catagories: {
                elementType: 'select',
                elementConfig: {
                    type: "",
                    options: []
                },
                value: 'food',
                isValid: true

            },
            itemName: this.elementConfig("Item Name"),
            itemPrice: this.elementConfig("Item Price in US Dollor", "number"),
            itemDescription: this.elementConfig("Item Description", "textarea")

        },
        formValid: false,
        loading: false,
        selectedFile: null,
        imageSpinner: false,
        url: '',
    }


    validHandler = (value, rules) => {
        let valid = false;
        if (rules.isRequired) {
            valid = value.trim() !== "";
        }
        if (rules.minLength && rules.maxLength) {
            valid = value.length >= rules.minLength && value.length <= rules.maxLength;
        }
        return valid
    }
    changeHandler = (event, id) => {
        const updatedOrderForm = JSON.parse(JSON.stringify(this.state.orderForm))

        updatedOrderForm[id].value = event.target.value;
        if (updatedOrderForm[id].valdiator) {
            updatedOrderForm[id].isValid = this.validHandler(updatedOrderForm[id].value, updatedOrderForm[id].valdiator)
            updatedOrderForm[id].touched = true;
        }
        let formValid = true;
        for (let formIdentity in updatedOrderForm) {
            formValid = updatedOrderForm[formIdentity].isValid && formValid
        }
        this.setState({ orderForm: updatedOrderForm, formValid })


    }
    orderHandler = (e) => {
        e.preventDefault()
        const formData = {};
        for (let formIdentity in this.state.orderForm) {
            formData[formIdentity] = this.state.orderForm[formIdentity].value
        }
        formData.url = this.state.url
        this.setState({ loading: true })
        axios.post(`https://food-ordering-6ccba.firebaseio.com/Items/${formData.catagories}/${formData.itemName}.json?auth=${this.props.JWT}`, { name: formData.itemName, price: parseFloat(parseFloat((formData.itemPrice)).toFixed(2)), value: 0, Description: formData.itemDescription,url:formData.url })
            .then(res => {
                this.setState({ loading: false })

            })
            .catch(err => this.setState({ loading: false }))

    }
    fileChangedHandler = (event) => {
        this.setState({selectedFile: event.target.files[0]})
    }
    uploadHandler = (e) => {
        e.preventDefault()
    
        this.setState({imageSpinner:true})
      firebase.storage().ref('images' + this.state.selectedFile.name).put(this.state.selectedFile)
        .then(snapshot => {
            snapshot.ref.getDownloadURL().then((downloadURL) =>{
                this.setState({imageSpinner:false})
                this.setState({url:downloadURL})
        }).catch(e => {
        this.setState({imageSpinner:false})
        throw new Error("Cannot upload Image")
        })
      })
    }
    render() {
        let formElementArray = [];
        for (let key in this.state.orderForm) {
            formElementArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }
        let Inputs = formElementArray.map(formElement => {
        
            return (
                <React.Fragment key={formElement.id}>
                    <Input
                        touched={formElement.config.touched}
                        shouldValidate={formElement.config.valdiator}
                        invalid={!formElement.config.isValid}
                        changed={(e) => this.changeHandler(e, formElement.id)}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value} />
                  
                </React.Fragment>
            )
        })
        let imageSpinner = null;
        if(this.state.imageSpinner){
            imageSpinner= <Spinner/> 
        }
              let form = (<form onSubmit={this.orderHandler}>
      
                  {Inputs}
                  <input type="file" onChange={this.fileChangedHandler} />
                  <Button clicked={this.uploadHandler} btnType="Success">UPLOAD</Button>
                 
      {imageSpinner}
      <br/>
                  <Button disabled={!this.state.formValid || !this.state.url} btnType="Success">ADD TO DATABASE</Button>
                  
      
              </form>); 
              if (this.state.loading) {
                  form = <Spinner />;
      
              }
        return (
            <div style={{ textAlign: "center" }} className={classes.ContactData}>
            <h4 style={{ padding: 20, marginTop: -16 }} className="bg-primary text-white">DASHBOARD ITEMS</h4>
            {form}
          
          </div>
        )
    }
}

const mapStateTorprops = (state) => {
    return {
        JWT: state.token
    }
}

export default withRouter(connect(mapStateTorprops)(AdminItems))