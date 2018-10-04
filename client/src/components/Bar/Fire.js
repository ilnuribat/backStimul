import React from 'react';

const Fire = () => (
  <div className="left-bar">
    <div className="left-bar-inner fire">
      <div className="scroller">
        <div className="message firetes">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="19" r="2" />
            <path d="M10 3h4v12h-4z" />
            <path fill="none" d="M0 0h24v24H0z" />
          </svg>
          <span className="body">
            <div className="user">от: <span className="name">А.Ю. Лакшери</span> кому: <span className="to">С.И. Иванову</span>
              <div className="date">12 сен'18</div>
              <div className="content">content</div>
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
)

export default Fire;
