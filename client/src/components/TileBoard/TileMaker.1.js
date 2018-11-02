import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SvgClose2 } from '../Svg';
import 'animate.css';
import { qauf } from '../../constants';

export default class TileMaker extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
       open: false,
       input: '',
    }

    this.open = this.open.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleCreate = this.handleCreate.bind(this)
  }
  
  static propTypes = {
  }

  open(){
    this.setState({open: !this.state.open, value: '',})
  }
  componentDidMount(){
    this.setState({
      value: '',
    })
  }  
  componentDidUpdate(){
  }

  handleCreate(){
    let {value, open, } = this.state;
    let {ref} = this.props;

    if(value && open){

      let url = "localhost:4000";

      let MutObject = (all) => `
      mutation{
          object(all:${all}){
              _id
              name
              tasks{
                _id
                name
              }
            }
          }
      `;
      let e = `{name: "${value}"}`;

      qauf(MutObject(e), url, localStorage.getItem('auth-token')).then(a=>{
        console.log("a")
        console.log(a)
        if(a && a.data && a.data){

          if(typeof ref === 'function'){
            ref();
          }
          this.setState({
            open: !open,
          });
          
        }else{
          console.log("Загрузка")
        }
      })
      .catch((e)=>{
          console.warn(e);
        });

     

    }else{
      return false;
    }

  }

  handleChange(event) {

    this.setState({value: event.target.value});
  }

  render() {
    let {open,value} = this.state;
    if(!open){
      return (
        <div className="makeTile animated flipInX" onClick={()=>{this.open()}}>
          <div className="inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
          </div>
        </div>
      )
    }else{
      return (
        <div className="tile makeTile animated flipInY faster">
          <div> <input type="text" value={value} onChange={this.handleChange} placeholder="Введите название" /> </div>

          <div className="butter" onClick={()=>this.handleCreate()}>Создать</div>
          <div className="butter mini" onClick={()=>{this.open()}}>Отменить</div>
        </div>
      )
    }

  }
}
