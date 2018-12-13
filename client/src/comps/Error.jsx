import React from 'react'
import PropTypes from 'prop-types'

const Error = props => {
  return (
    <div>
      Произошла ошибка:
        <div>{props.location.state.error ? props.location.state.error : "ХЗ что за ошибка" }</div>
    </div>
  )
}

Error.propTypes = {

}

export default Error
