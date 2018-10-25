import React from 'react';
import PropTypes from 'prop-types';
import { groupMut } from '../../graph/querys';
import { qauf, _url } from '../../constants';
import axios from 'axios';


class ChangerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '', edit: false, options: [], addressList: [], addressValue:""};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.daDataReqName = this.daDataReqName.bind(this);
    this.newAddress = this.newAddress.bind(this);
  }

  componentDidMount(){
    let {defaults} = this.props;

    this.setState({
      value: defaults
    });

  }

  handleChange(event) {

    let {type} = this.props;
    this.setState({value: event.target.value});

    if(type === 'list'){
      this.daDataReqName(event.target.value)
    }
  }


  newAddress(e){
    this.setState({
      value: e.target.value,
    })
    this.daDataReqName(e.target.value)
  }

  setAddrValue(e){
    this.setState({
      addressValue: e,
    })
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

  handleSubmit(event) {

    event.preventDefault();
    let { change, id, string, defaults } = this.props;
    let { value, edit } = this.state;

    if( value === "no") return false;

    let cap = "";

    if(typeof defaults === "string" || string){
      cap = '"';
    }
    this.setState({edit: !edit})
    const A = groupMut(id, `${change}: ${cap}${value}${cap}`);


    if(!id){
      alert('Не передан наиважнейший параметр!');
      return false;
    }

    qauf(A, _url, localStorage.getItem('auth-token')).then(a=>{
      console.log(a)
    })
      .catch((e)=>{
        console.warn(e);
      });
  }
  setGeo(geo){
    this.setState({ geo: geo})
  }

  render() {
    let {type, name, defaults, options, select, defaultText} = this.props;
    let {edit, value, addressList,addressValue} = this.state;

    if(type === "date" && value){
      value = value.replace(/T.*$/gi, "");
      defaultText = defaultText.replace(/T.*$/gi, "");
    }

    if(edit){
      if(select){
        return (
          <div className="padded">
            <form onSubmit={this.handleSubmit}>
              <label>
                {name}:
                <div>
                  <select name="select" onChange={this.handleChange} value={value}>
                    {!value ? (<option value="no">Не выбрано</option>) : null }
                    {
                      options.map((e)=>{
                        let nameval;

                        nameval = e.name || e.username || "...";

                        return(
                          <option key={"option-"+e.id} value={e && e.id ? e.id : "no"}>
                            {nameval}
                          </option>
                        )
                      })
                    }
                  </select>

                  <input type="submit" value="Сохранить" />
                  <div className="btn" onClick={()=>{this.setState({edit: !edit})}}>Отмена</div>
                </div>
              </label>
            </form>
          </div>
        );
      }
      else if(type === "list"){
        return(
          <div className="padded">
            <div className="geo">{this.state.geo}</div>
            <input type="list" list="addresses" autoComplete="on" onChange={this.newAddress} placeholder="Введите новый адрес, город или улицу" />
            {
              value && value.length > 15 ? (
                <div className="button" onClick={()=>{this.props.addressAdd(value, addressList); this.setState({edit: !edit})}}>Добавить адрес</div>
              ): null
            }
            <div className="btn" onClick={()=>{this.setState({edit: !edit})}}>Отмена</div>
            <datalist id="addresses">
              {addressList && addressList.map((e,i)=>{

                return(
                  <div className="parentQ" key={e.value}>
                    
                    <option key={'addr' + i} value={e.value} onClick={()=>this.setAddrValue(e.value)}>
                      {e.value}
                      {e.data.geo_lat && e.data.geo_lon ? (" " + e.data.geo_lat +":"+ e.data.geo_lon) : ""}
                    </option>
                  </div>
                )})}
            </datalist>
            
          </div>
        )
      }
      else{

        return (
          <div className="padded">
            <form onSubmit={this.handleSubmit}>
              <label>
                {name}:
                <div>
                  <input type={type ? type : "text" } value={ value } placeholder={name} onChange={this.handleChange} />
                  <input type="submit" value="Сохранить" />
                  <div className="btn" onClick={()=>{this.setState({edit: !edit})}}>Отмена</div>
                </div>
              </label>
            </form>
          </div>
        );
      }

    }else{
      return(
        <div className="padded" onClick={()=>{this.setState({edit: !edit})}}><span className="spanName">{name}: </span><span className="spanValue">
          {defaultText ? (!defaultText.name && !defaultText.username ? defaultText : (defaultText.name ? defaultText.name : defaultText.username ))  : defaults}</span></div>
      )
    }
  }
};

export default ChangerForm;
