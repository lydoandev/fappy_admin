import React from 'react'
import {
  CCard,
  CRow,
  CCardBody,
  CCol,
  CCardHeader,
} from '@coreui/react'
import ChartLineSimple from '../charts/ChartLineSimple'

import { Bar } from 'react-chartjs-2';

import fire from "../../config/fire";

class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: "",
      nameSelected: "",
      listMarketer: [],
      listOrder: [],
      listRestaurant: [],
      listOrderInYear: [],
      monthTotal: [],
      yearsTotal: []
    };
  }
  componentDidMount() {
    fire.database().ref('orders').on('value', snapshot => {
      const orderObject = snapshot.val();

      const orderList = Object.keys(orderObject).map(key => ({
        ...orderObject[key],
        uid: key,
      }));

      this.setState({
        listOrder: orderList
      });
    });

    fire.database().ref('marketers').on('value', snapshot => {
      const marketerObject = snapshot.val();
      const marketerList = Object.keys(marketerObject).map(key => ({
        ...marketerObject[key],
        uid: key,
      }));

      this.setState({
        listMarketer: marketerList,
      });
    });

    fire.database().ref('restaurants').on('value', snapshot => {
      const restaurantObject = snapshot.val();
      const restaurantList = Object.keys(restaurantObject).map(key => ({
        ...restaurantObject[key],
        uid: key,
      }));

      this.setState({
        listRestaurant: restaurantList,
      });
    });
  }

  handleChange = (event) => {
    let { listOrder, listOrderInYear } = this.state;
    let year = event.target.value;
    if (year !== "") {
      listOrderInYear = listOrder.filter(order => {
        let dateOrder = new Date(order.orderDate);
        let fullYear = dateOrder.getFullYear();

        if (fullYear === Number(year)) {
          return order
        }
      })

      this.setState({ year, listOrderInYear, nameSelected: "" });
    } else {
      this.setState({ year, listOrderInYear: [] });
    }

    this.getCharData(listOrderInYear);
  };

  handleChangeTarget = (event) => {
    let { listOrder, listOrderInYear, year } = this.state;
    let nameSelected = event.target.value;

    if (nameSelected !== "" && year !== "") {
      listOrderInYear = listOrder.filter(item => {
        if (item.seller.name === nameSelected) {
          return item
        }
      })
    } else if (nameSelected !== "" && year === "") {
      listOrderInYear = listOrder.filter(item => {
        if (item.seller.name === nameSelected) {
          return item
        }
      })
    } else if (nameSelected === "") {
      listOrderInYear = []
    }

    this.setState({ nameSelected, listOrderInYear });
    this.getCharData(listOrderInYear);
    this.getDataCharYear(nameSelected);
  }

  getDataCharYear = (nameSelected) => {
    let { listOrder } = this.state;
    const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020];
    let yearsTotal = [];

    years.map(year => {
      let price = 0;
      listOrder.map(item => {
        let date = new Date(item.orderDate)
        let yearCurrent = date.getFullYear();
        if (item.status === "success" && yearCurrent === year && item.seller.name === nameSelected) {
          price = price + item.totalPrice
        }
      })
      price = price * 0.1
      yearsTotal.push(price)
    })
    this.setState({ yearsTotal })
  }

  getCharData = (listOrderInYear) => {
    let data = [];

    for (let index = 1; index <= 12; index++) {
      let amount = 0;
      listOrderInYear.map(item => {
        if (item.status === "success") {
          let date = new Date(item.orderDate)
          let month = date.getMonth() + 1;

          if (month === index) {
            amount = amount + (item.totalPrice * 0.1)
          }
        }
      })
      data.push(amount)
    }
    this.setState({ monthTotal: data })
  }


  render() {
    const years = [2020, 2019, 2018, 2017, 2016, 2015, 2014];
    const ListYears = ['Year 2014', 'Year 2015', 'Year 2016', 'Year 2017', 'Year 2018', 'Year 2019', 'Year 2020'];
    const { listMarketer, listRestaurant, nameSelected, year, monthTotal, yearsTotal } = this.state

    return (
      <div className="statistic">
        <div className="title"> <h3>Statistics Yearly Turnover</h3></div>
        <CRow>
          <CCol sm="6">
            <label style={{ color: "white" }}>Choose Year: </label>
            <select className="form-control" value={year} onChange={this.handleChange}>
              <option value="" disabled>Choose Year</option>
              {years.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <CCard className="chart-card">
              <CCardHeader>
                Monthly Revenue Chart
          <div className="card-header-actions">
                  <a href="" className="card-header-action">
                    <small className="text-muted">Monthly Income</small>
                  </a>
                </div>
              </CCardHeader>
              <CCardBody>

                <Bar
                  data={
                    {
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                      datasets: [
                        {
                          label: 'Monthly Income',
                          backgroundColor: '#f23a5f',
                          borderWidth: 2,
                          data: monthTotal
                        }
                      ]
                    }
                  }
                  options={{
                    title: {
                      display: false,
                    },
                    scales: {
                      yAxes: [
                        {
                          ticks: {
                            suggestedMin: 0,
                            suggestedMax: 500000
                          }
                        }
                      ]
                    },
                    legend: {
                      display: true,
                      position: 'top'
                    }
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm="6">
            <label style={{ color: "white" }}>Choose Seller: </label>
            <select className="form-control" value={nameSelected} onChange={this.handleChangeTarget}>
              <option value="" disabled>Choose Seller</option>
              {listMarketer != null || listMarketer.length > 0 ?
                listMarketer.map((item, index) => (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                )) : null}
              {listRestaurant != null || listRestaurant.length > 0 ?
                listRestaurant.map((item, index) => (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                )) : null}
            </select>

            <CCard className="l-chart">
              <CCardHeader >
                Revenue Growth Chart
          </CCardHeader>
              <CCardBody>
                <ChartLineSimple
                  pointed
                  className="c-chart-wrapper mt-3 mx-3"
                  dataPoints={yearsTotal}
                  pointHoverBackgroundColor="#1b91bf"
                  borderColor="#f23a5f"
                  labels={ListYears}
                  label="Revenue"
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    )
  }
}
export default Charts
