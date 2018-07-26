import React, { Component } from 'react'
import { connect } from "react-redux"
import axios from "axios";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import classes from "./food.css";
class Food extends Component {
    state = {
        loading: false,
        items: [],
        show: false,
    }
    showModal = () => {
        this.setState({ show: true })
        setTimeout(() => {
            this.setState({ show: false })
        }, 1000)
    }
    componentDidMount = async () => {
        let url = this.props.history.location.pathname.split("/");
        try {
            let response = await axios.get(`https://food-ordering-6ccba.firebaseio.com/Items/${url[2]}.json`);

            const { data } = response;

            const items = [];
            const dataIng = [];
            for (let item in data) {
                items.unshift(data[item])
            }
            for (let item of items) {
                for (let itemData in item) {
                    dataIng.unshift(item[itemData])
                }
            }

            this.setState({ items: dataIng, loading: true })
        }
        catch (e) {
            this.setState({ loading: false })
        }
    }
    checkout = (item) => {
        this.props.addItem(item);
        if (this.props.isAuth) {
            this.props.history.push("/checkout")
        }
        else {
            this.props.history.push("/auth")
        }

    }
    render() {

        let modal = <div className="text-center"><span style={{ transform: this.state.show ? "translateY(0)" : "translateY(-300px)", transition: "all 0.8s" }} className={classes.modal}>Item Added to cart Successfully.</span> </div>
        let items = <Spinner />
        if (this.state.loading) {

            items = this.state.items.map((item, key) => {
                return (
                    <React.Fragment key={key}>
                        <div className="col-md-4 col-sm-12 mb-4 text-center">
                            <div className="card" style={{ width: "18rem" }}>
                                <img className="card-img-top" src={item.url} alt="Card cap" />
                                <div className="card-body">
                                    <h5 className="card-title"><strong>{item.name}</strong></h5>
                                    <p className="card-text">{item.Description} 
                                  
                                    <br/>
                                   <span>Price :</span> <strong>{item.price}$.</strong></p>
                                </div>

                                <div className="card-body p-0 pb-2">

                                    <button onClick={() => {

                                        this.showModal()

                                        this.props.addItem(item)
                                    }} className={["btn", "card-link", classes.btnCart].join(" ")}> Add To Cart</button>

                                    <button onClick={() => { this.checkout(item) }} className={["btn", "card-link", classes.btnCart].join(" ")}>Checkout</button>
                                </div>
                            </div>
                        </div>


                    </React.Fragment>
                )
            })
        }

        return (
            <div style={{ marginTop: "80px" }} className="container">
                {modal}
                <div className="row mx-auto">


                    {items}



                </div>
            </div>
        )
    }
}

const mapStateToprops = (state) => {
    return {
        items: state.items,
        isAuth: state.token !== null
    }
}
const mapDispatchToprops = (dispatch) => {
    return {
        addItem: (item) => dispatch({ type: "ADD_ITEM", item })
    }
}

export default connect(mapStateToprops, mapDispatchToprops)(withErrorHandler(Food, axios))