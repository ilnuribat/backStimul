import React from 'react';
import PropTypes from 'prop-types';
import { groupMut } from '../../graph/querys';
import { qauf, _url } from '../../constants';

class ChangerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '', edit: false, options: []};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    let {defaults} = this.props;

      this.setState({
        value: defaults
      });

  }

  handleChange(event) {
    
    this.setState({value: event.target.value});
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

  render() {
    let {type, name, defaults, options, select, defaultText} = this.props;
    let {edit, value} = this.state;

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
                    options.map((e,i)=>{
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
      }else{


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