import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

const Modal = ({...props})=>{

  return(
    <div className="modal modal-container">
      <div className="modal-wrapper">
        <div className="close" onClick={props.close}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        </div>
        <div className="modal-content">
          <div className="modal-header">
            {props.header}
          </div>
          <div className="modal-body">
            {/* {props.body} */}
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
};

export default Modal;