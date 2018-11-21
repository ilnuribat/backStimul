import React from 'react'
import PropTypes from 'prop-types'

const InnerBar = ({children,view}) => {
  return (
    <div className={`InnerBar${view?" "+view:""}`}>
      { children }
    </div>
  )
}

InnerBar.propTypes = {

}

export default InnerBar
