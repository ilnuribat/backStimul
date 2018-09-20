import React, { Component, Fragment } from 'react';




export default class Task extends Component {
    constructor(props) {
      super(props);
      this.state = {
        priority: [],
      };
    }
  
    componentDidMount() {
  
    }
  
    render() {
  
      return (
        <Fragment>
              <div className="taskHeader">
                <div className="taskName">
                  <svg className="add-favorite" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                    <path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z" />
                    <path fill="none" d="M0 0h18v18H0z" />
                  </svg>
                </div>
              </div>
        </Fragment>
      );
    }
  }
  

// export default class Task extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//           priority: [],
//         };
//       }
// render(){
//     return(
//         <div className="task">
//             <div className="task-name">{this.props.name}</div>
//             <div className="task-description">{this.props.description}</div>
//             <div className="task-id">{this.props.id}</div>
//         </div>
//     )
// }
// };