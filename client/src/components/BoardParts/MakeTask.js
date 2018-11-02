import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from "react-apollo";
import { SvgClose2 } from '../Svg';
import 'animate.css';
import { qauf } from '../../constants';
import { createDirect } from '../../graph/querys';
import axios from 'axios';



const MAKE_TASK = gql`
  mutation MakeTask($name: String) {
    createTask(task: { name: $name }) {
      id
      name
    }
  }
`;


export default class MakeTask extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      open: false,
      input: '',
    }

    this.open = this.open.bind(this)
  }
  
  static propTypes = {
  }

  open(){
    this.setState({open: !this.state.open, value: '',})
  }

  render() {
    let {open,value} = this.state;

    if(!open){
      return (
        <div className="makeTask animated flipInX" onClick={()=>{this.open()}}>
          <div className="inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
          </div>
        </div>
      )
    }else{
      let input;
      
      return (
        <div className="makeTaskForm animated flipInY faster">
          <Mutation mutation={MAKE_TASK} variables={{name: `"${input}"`, objectId: `"${this.props.objectId}"` }}>
            {(addTask, { data }) => (
              <div>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    addTask({ variables: { name: input.value } });
                    input.value = "";
                  }}
                >
                  <div>
                    <input
                      ref={node => {
                        input = node;
                      }}
                      placeholder="Название"
                    />
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
      );
    }
  }
}
