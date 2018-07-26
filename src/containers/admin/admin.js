import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter} from "react-router-dom";
import AddItems from "./AdminItems";
import AddCategoies from "./AddCategories";
class Admin extends Component {
    state ={
        isAddItem:true
    }
addItems = (e) => {
    e.preventDefault()
this.setState({isAddItem:true})
}
addCategoies = (e) => {
    e.preventDefault()
this.setState({isAddItem:false})
}
render(){
let currentAdmin =  <AddCategoies/>
if(this.state.isAddItem){
  currentAdmin =  <AddItems/>;
}

return (
<React.Fragment>
    <div className="container">
    <nav className="nav nav-pills nav-justified m-0 p-0 py-4">
  <button onClick={this.addItems} className="nav-item nav-link btn-primary btn" >ADD ITEMS</button>
  <button onClick={this.addCategoies} className="nav-item nav-link btn-success btn">ADD CATAGORIES</button>
</nav>
{currentAdmin}
    </div>

</React.Fragment>

)
}
}
const mapStateTorprops = (state) => {
    return {
        JWT: state.token
    }
}

export default withRouter(connect(mapStateTorprops)(Admin))



