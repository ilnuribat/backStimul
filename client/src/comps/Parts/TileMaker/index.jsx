import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo';
import axios from 'axios';
import 'animate.css';

import { SvgPlusBox } from '../SVG';
import Tiled from '../Tiled/index';
import { createObject, changeObject } from '../../../GraphQL/Qur/Mutation/index';
import Modal from '../../Lays/Modal/Modal';
import { ButtonRow } from '../Rows/Rows';



/** TileMaker */

class TileMaker extends Component {

  constructor(props) {
    super(props)

    this.state = {
      open:false,
      edit:false,
      create:false,
      input: '',
      addressList:'',
      value: '',
      stateName:'',
    }

    this.open = this.open.bind(this)
    this.edit = this.edit.bind(this)
    this.create = this.create.bind(this)
    this.daDataReqName = this.daDataReqName.bind(this)
    this.newAddress = this.newAddress.bind(this);
    this.newName = this.newName.bind(this);
  }


  componentDidMount(){
    let {edit} = this.props;
    if(edit){
      this.setState({edit: true,create: true,})
    }
  }

  newAddress(e){
    this.setState({
      value: e.target.value,
    })
    this.daDataReqName(e.target.value)
  }
  newName(e){
    this.setState({
      stateName: e.target.value,
    })
  }
  handleChange(event) {

    this.daDataReqName(event.target.value)
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
  edit(){
    let { edit } = this.state;
    this.setState({edit: !edit})
  }
  open(){
    let { create } = this.state;
    this.setState({create: !create})
  }
  create(){
    let { create } = this.state;
    this.setState({create: !create})
  }

  render() {
    let { edit, children, id, name, addr } = this.props;
    let { create, value, addressList, stateName } = this.state;
    if(create){
      let input;

      let address;
      let _id;
      let mutation = createObject
      let variables = {name: `"${input}"`, address: `"${address}"` }

      if (edit) {
        mutation = changeObject
        variables = {id: `"${_id}"`, name: `"${input}"`, address: `"${address}"` }
      }

      return (
        <Modal close={(e)=>{this.open();edit ? this.props.setEdit() : null}}>
          <div className="animated flipInY" style={{"width":"90%","margin":"0 auto"}}>
            <Mutation mutation={mutation} variables={variables}>
              {(MakeTile, { data }) => (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      if (edit) {
                        let addr = value || address.value;
                        console.log(addr);

                        MakeTile({ variables: { id: id, name: input.value, address: address.value } });
                        // this.props.setEdit();
                      } else {
                        MakeTile({ variables: { name: input.value, address: address.value } });
                      }
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
                        value={stateName}
                        placeholder="Название"
                        onChange={this.newName}
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
              )}
            </Mutation>
            {/* <ButtonRow сlick={(e)=>{e.preventDefault();this.open();edit ? this.props.setEdit() : null}}>отмена</ButtonRow> */}
            {/* <button className="mini" onClick={(e)=>{e.preventDefault();this.open();edit ? this.props.setEdit() : null}}>Отмена</button> */}
          </div>
        </Modal>
      );
    }
    return(
      <div className="pull animated flipInY" onClick={()=>{this.setState({create: !this.state.create})}}>
        {
          children
        }
      </div>
    );

  }
}
export default TileMaker
