import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import axios from 'axios';
import gql from 'graphql-tag'
import { Mutation } from "react-apollo"
import 'animate.css';
import { createObject, changeObject } from '../../graph/querys';
// import { SvgClose2 } from '../Svg';
// import { qauf } from '../../constants';



export default class TileMaker extends Component {

  constructor(props) {
    super(props)

    this.state = {
      open: false,
      input: '',
      addressList:'',
      value: ''
    }

    this.open = this.open.bind(this)
    this.daDataReqName = this.daDataReqName.bind(this)
    this.newAddress = this.newAddress.bind(this);
  }

  static propTypes = {
  }

  async daDataReqId (id) {
    const res = await axios(
      'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/address',

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Token a9a4c39341d2f4072db135bd25b751336b1abb83"
        },
        data: {
          "query": id
        }
      })

    return res.data.suggestions[0].data;
  }

  handleChange(event) {

    this.daDataReqName(event.target.value)
  }

  newAddress(e){
    this.setState({
      value: e.target.value,
    })
    this.daDataReqName(e.target.value)
  }

  daDataReqName (name) {
    axios(
      'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Token a9a4c39341d2f4072db135bd25b751336b1abb83"
        },
        data: {
          "query": name,
          "count": 5
        }
      })
      .then(response => {
        this.setState({
          addressList: response.data.suggestions,
        })
      })
    // .then(response => response.json())
    // .then(data => console.warn(data));
  }

  open(){
    this.setState({open: !this.state.open, value: '',})
  }

  render() {
    const { open,value,addressList } = this.state;
    const { editObject } = this.props


    if(!open){
      return (
        <div className="makeTile animated flipInX" onClick={()=>{this.open()}}>
          <div className="inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
          </div>
        </div>
      )
    }else{
      let input;
      let address;

      return (
        <div className="makeTileWrap">
          <div className="makeTileForm animated flipInY faster">
            <Mutation mutation={createObject} variables={{name: `"${input}"`, address: `"${address}"` }}>
              {(MakeTile, { data }) => (
                <div>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      MakeTile({ variables: { name: input.value, address: address.value } });
                      input.value = "";
                      address.value = "";
                    }}
                  >
                    <div>
                      <input
                        type="text"
                        ref={node => {
                          input = node;
                        }}
                        placeholder="Название"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="list" list="addresses" autoComplete="on"
                        ref={node => {
                          address = node;
                        }}
                        placeholder="Адрес"
                        required
                        value={value} onChange={this.newAddress}
                      />
                      <datalist id="addresses" >

                        {addressList && addressList.map((e,i)=>{

                          return(
                            <div className="parentQ" key={e.value}>
                              <option key={'addr' + i} value={e.value}>
                                {value}
                                {e.data.geo_lat && e.data.geo_lon ? (" " + e.data.geo_lat +":"+ e.data.geo_lon) : ""}
                              </option>
                            </div>
                          )})}
                      </datalist>
                    </div>
                    <div>
                      <button className="butter" type="submit">Добавить</button>
                    </div>
                  </form>
                </div>
              )}
            </Mutation>
            <div className="butter mini" onClick={()=>{this.open()}}>Отмена</div>
          </div>
        </div>
      );
    }
  }
}
