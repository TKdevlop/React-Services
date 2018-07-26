import React, { Component } from 'react'
import { Link } from "react-router-dom";
import Spinner from "../UI/Spinner/Spinner";
import axios from "axios";
export default class Services extends Component {
  state = {
    services: [],
    loading: false
  }
  componentDidMount = () => {
    this.setState({ loading: true })
    axios.get("https://food-ordering-6ccba.firebaseio.com/Catagories/.json")
      .then(({ data }) => {

        this.setState({ loading: false })
        let dataArr = [];
        for (let i in data) {

          dataArr.push({ ...data[i], i })
        }
        this.setState({ services: dataArr })
      })
  }
  render() {
    let servicesUrl = <Spinner />

    if (!this.state.loading) {
      servicesUrl = this.state.services.map(service => {
        let url = `/catagories/${service.i}`
        return (
          <div key={service.i} className="card">
            <img className="card-img-top p-3" style={{ width: "70%", margin: "0 auto" }} src={service.url} alt="" />
            <div className="card-body">
              <h4 className="card-title"><strong>{service.i}</strong></h4>
              <p className="card-text">{service.Description}</p>
              <Link to={url} className="btn btn-primary btn-lg mt-2">Know More</Link>
            </div>
          </div>
        )

      })
    }


    return (


      <div className="container text-center">
        {servicesUrl}
      </div>



    )
  }
}
