import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {SvgClose} from './Svg/index'

export default class Info extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
        _close: false,
       _message:'',
       _type:'',
       _class:'',
       _color:'',
    }
  }
  static propTypes = {

  }

  componentDidMount(){
    let {classAppend, message, type} = this.props;

    this.setState({
      _type: type,
      _class: classAppend,
      _message: message,
    })
  }

  componentDidUpdate(){
    let {classAppend, message, type} = this.props;

    if(this.props.message !== this.state._message){
      this.setState({
        _type: type,
        _class: classAppend,
        _message: message,
      })
    }
  }


  render() {
    
    let { _class, _message, _type,_close } = this.state;

    if(_close){return false}

    if(_message){
      return (
        <div className={'info'+' '+_type}>
            <div className="close" onClick={()=>this.setState({_close: true})}>
              <SvgClose />
            </div>
          <p>{_message}</p>
        </div>
      )
    }else{
      return (
        <div className={'info'}>
          <p>Ничего не найдено</p>
        </div>
      )
    }
  }
}
