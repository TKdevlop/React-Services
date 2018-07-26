import React, { Component } from 'react';
import Button from "../../components/UI/Button/Button";
import classes from "./admin.css";
import axios from "axios";
import Spinner from "../../components/UI/Spinner/Spinner";
import Input from "../../components/UI/Input/Input";
import Modal from "../../components/UI/Modal/Modal";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import firebase from 'firebase/app';
import 'firebase/storage'; 


class Admin extends Component {
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
    componentDidMount = async () => {
        let { data } = await axios.get("https://food-ordering-6ccba.firebaseio.com/Items.json")
        let catagories = [];
        for (let catagorie in data) {
            catagories.push({
                value: catagorie,
                displayValue: catagorie
            })
        }

        let updated = JSON.parse(JSON.stringify(this.state.orderForm));
        //   let updated = {
        //       ...this.state.orderForm,
        //     deliveryMethod:{
        //         ...this.state.orderForm.deliveryMethod
        //     },
        //     elementConfig:{
        //         ...this.state.orderForm.deliveryMethod.elementConfig,
        //         options:catagories
        //     }
        //   }

        updated.catagories.elementConfig.options = catagories
        this.setState({ orderForm: updated })
    }


    state = {
        catagorie: null,
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
            itemPrice: this.elementConfig("Item Price in US Dollor", "number", "number"),
            itemDescription: this.elementConfig("Item Description", "textarea")

        },
        formValid: false,
        loading: false,
        selectedFile:null,
        progress:0,
        imageSpinner:false,
        url:'',
        isItems:true
    }

    orderHandler = (e) => {
        e.preventDefault()
        const formData = {};
        for (let formIdentity in this.state.orderForm) {
            formData[formIdentity] = this.state.orderForm[formIdentity].value
        }
        formData.url = this.state.url
        this.setState({ loading: true })
        console.log(formData)
        axios.post(`https://food-ordering-6ccba.firebaseio.com/Items/${formData.catagories}/${formData.itemName}.json?auth=${this.props.JWT}`, { name: formData.itemName, price: parseFloat(parseFloat((formData.itemPrice)).toFixed(2)), value: 0, Description: formData.itemDescription,url:formData.url })
            .then(res => {
                this.setState({ loading: false })

            })
            .catch(err => this.setState({ loading: false }))

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
        console.log(updatedOrderForm[id])
        this.setState({ orderForm: updatedOrderForm, formValid })


    }
    showModal = (e) => {
        e.preventDefault()
        this.setState({ show: !this.state.show })
    }
    change = (e) => {

        this.setState({ catagorie: e.target.value })
    }
    addCatgories = () => {
        let updated = JSON.parse(JSON.stringify(this.state.orderForm));
        updated.catagories.elementConfig.options.push({
            value: this.state.catagorie,
            displayValue: this.state.catagorie
        })
        this.setState({ orderForm: updated })

    }
    fileChangedHandler = (event) => {
        this.setState({selectedFile: event.target.files[0]})
    }
    uploadHandler = (e) => {
        console.log("Trigger")
        e.preventDefault()
        // axios.post('https://us-central1-food-ordering-6ccba.cloudfunctions.net/uploadFile?auth${this.props}', this.state.selectedFile,{
        //     onUploadProgress: progressEvent => {
        //        this.setState({progress:Number(progressEvent.loaded / progressEvent.total * 100)})
        //       }
        // })
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
    switchAdmin = (e) => {
        e.preventDefault()
        this.setState({isItems:!this.state.isItems})
    }
    render() {
        let formElementArray = [];
        for (let key in this.state.orderForm) {
            formElementArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
            console.log(this.state.orderForm[key])
        }
        let title = "Select Catagories";

        let Inputs = formElementArray.map(formElement => {
        
            return (
                <React.Fragment key={formElement.id}>
                    <Input
                        title={title}
                        touched={formElement.config.touched}
                        shouldValidate={formElement.config.valdiator}
                        invalid={!formElement.config.isValid}
                        changed={(e) => this.changeHandler(e, formElement.id)}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value} />
                    {formElement.config.elementType === "select" ? <React.Fragment><button className="btn btn-info" onClick={this.showModal}>Add Catagoires</button>
                        <Modal show={this.state.show} modalClosed={this.showModal}>Catagoires Name: <input onChange={this.change} type="text" /><Button btnType="Success" clicked={this.addCatgories}>ADD</Button></Modal></React.Fragment> : null}
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
            <Button disabled={!this.state.formValid} btnType="Success">ADD TO DATABASE</Button>
            

        </form>); 
        if (this.state.loading) {
            form = <Spinner />;

        }
        let renderAdmin =  (<div style={{ textAlign: "center" }} className={classes.ContactData}>
        <h4 style={{ padding: 20, marginTop: -16 }} className="bg-success text-white">DASHBOARD CATAGORIES</h4>
        {form}
        <button onClick={this.switchAdmin} className="btn btn-success">Switch To Items</button>
    </div>)

        if(this.state.isItems){
           renderAdmin = (<div style={{ textAlign: "center" }} className={classes.ContactData}>
            <h4 style={{ padding: 20, marginTop: -16 }} className="bg-primary text-white">DASHBOARD ITEMS</h4>
            {form}
            <button onClick={this.switchAdmin} className="btn btn-info">Switch To Catagoires</button>
        </div>)
        }
        return (
      <div>
          {renderAdmin}
      </div>
        )
    }
}
const mapStateTorprops = (state) => {
    return {
        JWT: state.token
    }
}

export default withRouter(connect(mapStateTorprops)(Admin))



