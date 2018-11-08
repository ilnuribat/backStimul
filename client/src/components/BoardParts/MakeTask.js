import React, { Component } from 'react';
import { graphql, compose, Mutation } from "react-apollo";
import PropTypes from 'prop-types';
import 'animate.css';
import { getObjectId, createTask } from '../../graph/querys';
// import axios from 'axios';
// import { SvgClose2 } from '../Svg';
// import { qauf } from '../../constants';
// import gql from 'graphql-tag';




class MakeTask extends Component {

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

    const { getObjectId } = this.props

    if (!getObjectId.currentObjectId) {
      return null
    }

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
          <Mutation mutation={createTask} variables={{name: `"${input}"`, id: `"${getObjectId.currentObjectId}"` }}>
            {(addTask, { data }) => (
              <div>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    addTask({ variables: { name: input.value, id: getObjectId.currentObjectId  } });
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



MakeTask.propTypes = {
  getObjectId: PropTypes.object.isRequired
};



export default compose(
  graphql(getObjectId, { name: 'getObjectId' }),
  graphql(createTask, { name: 'createTask' }),
)(MakeTask);
