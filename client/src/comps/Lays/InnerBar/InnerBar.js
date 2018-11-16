import React from 'react'
import PropTypes from 'prop-types'

const InnerBar = props => {
  return (
    <div className={"InnerBar"+" "+props.view}>
      { props.children }
    </div>
  )
}

InnerBar.propTypes = {

}

export default InnerBar
