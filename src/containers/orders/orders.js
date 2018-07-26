import React, { Component } from 'react'
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "axios";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";
import { Link, withRouter } from "react-router-dom";

class Orders extends Component {
  state = {
    userOrders: null
  }


  componentDidMount = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId")

    const queryParams = '?auth=' + token;
    axios.get(`https://food-ordering-6ccba.firebaseio.com/orders.json` + queryParams)
      .then(res => {
        let userOrder = [];
        for (let order in res.data) {
if(res.data[order].userId === userId )  {
  userOrder.unshift(res.data[order].items.concat(res.data[order].date.join(" ")))
}
         

  

          this.setState({ userOrders: userOrder })
        }
      }).catch(e => {
        
      })

  }
  // ".read": "auth != null", 
  // ".write": "auth != null",


  render() {

    let wholeOrder = <Spinner />;
    if (this.state.userOrders) {
      wholeOrder = this.state.userOrders.map((orders, i) => {
        return orders.map((order, i) => {
     
          if (order.length - 1) {
            return (
              <React.Fragment  key={i}>
              <p className="text-secondary">Order Placed on {order}</p>
              <hr style={{background:"black"}}/>
              
              </React.Fragment>
            )
          }
          return (
            <React.Fragment key={i}>
              <div className="container">
                <div className="row mx-auto text-center">
                <div className="col-md-6 col-sm-12">
                    <img className="img-fluid" style={{borderRadius:"50%",width:"125px",height:"125px"}} src={order.url} alt="order" />
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <p>Order name : <strong>{order.name}</strong></p>
                    <p>Order price : <strong>{order.price}</strong></p>
                    <p>Order Quantity : <strong>{order.value}</strong></p>

                  </div>
                 
                </div>
              </div>
<hr/>
            </React.Fragment>
          )
        })
      })
    }
  
    return (

      <div>
        {wholeOrder.length !== 0 ? wholeOrder : <h1 className="display-4 text-center">No orders placed Yet <Link to="/">SHOW NOW!</Link></h1>}
      </div>

    )
  }
}
const MapStateToProps = (state) => {
  return {
    userId: state.userId,
    token: state.token
  }
}

export default withRouter(connect(MapStateToProps)(withErrorHandler(Orders, axios)))