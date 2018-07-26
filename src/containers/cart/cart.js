import React, { PureComponent } from 'react'
import { connect } from "react-redux";
import { Link } from "react-router-dom";
class Cart extends PureComponent {
  state = {
    totalPrice: 0
  }
  componentDidMount() {
    let TotalPrice = 0;
    //   // let TotalPrice = this.props.items.reduce((prev,next)=> {
    //   //   return prev.price += next.price
    //   // })
    for (let item of this.props.items) {
      TotalPrice += item.price
    }
    //   console.log(TotalPrice)
    this.setState({ totalPrice: TotalPrice })

  }
  componentDidUpdate = (one, two) => {
    let TotalPrice = 0;
    //   // let TotalPrice = this.props.items.reduce((prev,next)=> {
    //   //   return prev.price += next.price
    //   // })
    for (let item of this.props.items) {
      TotalPrice += item.price
    }
    //   console.log(TotalPrice)
    this.setState({ totalPrice: TotalPrice })


  }
  totalPriceHandler = () => {
    let TotalPrice = 0;

    for (let item of this.props.items) {
      TotalPrice += item.price
    }
    console.log(TotalPrice)
  }
  render() {
    let cartItems = this.props.items.map((item, key) => {
      let checkout = <Link to="/auth" className="btn btn-primary">Sign-In To Checkout</Link>
      if (this.props.userId) {
        checkout = <Link to="/checkout" className="btn btn-primary">Procced To Checkout</Link>
      }

      return (
        <div key={key}>
        <div  className="container">
          <div className="row mb-5">
            <div className="col-md-6 col-sm-12">

              <img style={{ borderRadius: "100%" }} className="card-img-top" src={item.url} alt="" />

            </div>
            <div className="col-md-6 col-sm-12 mt-5">
              <h5 className="card-title"><strong>{item.name}</strong></h5>
              <hr/>
              <span onClick={() => this.props.decQuantity(item)}><i class="fas fa-minus-circle fa-2x mt-1"></i></span>
              <span className="card-text mb-0 pb-0">&nbsp;QTY:<strong>{item.value}</strong>&nbsp;</span>
              <span onClick={() => this.props.incQuantity(item)}><i class="fas fa-plus-circle fa-2x"></i></span>
              <br />
              <br/>
              <span>Price : &nbsp;</span><strong className="card-text">{(parseFloat(item.price)).toFixed(2)}$</strong>
              <br />
              <br/>
              <Link to="/">BUY MORE</Link>
             
          <hr/>
              {checkout}
            </div>
    
          </div>
          </div>

<hr/>
        </div>
      )
    })
    return (
      <div className="container text-center">
        <p className="display-4">Your cart:</p>
        {cartItems}
        <h4 className="mb-2"><strong>SubTotal : {parseFloat(this.state.totalPrice).toFixed(2)}$</strong></h4>

      </div>
    )
  }
}

const mapStateToProps = (state) => {

  return {
    items: state.cart,
    userId: state.userId,
    totalPrice: state.totalPrice,
  }

}
const mapDispatchToProps = (dispatch) => {
  return {
    incQuantity: (item) => dispatch({ type: "INC_QUANTITY", item }),
    decQuantity: (item) => dispatch({ type: "DEC_QUANTITY", item }),
    checkout: () => dispatch({ type: "CHECKOUT" })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart)