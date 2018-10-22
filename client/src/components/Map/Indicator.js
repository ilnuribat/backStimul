import React from "react";

const Indicator = ({tittle, stroke})  => (
  <svg width="16px" height="16px">
    <title>{tittle}</title>
    <defs></defs>
    <circle id="Status-Colour-Copy" cx="8" cy="8" r="6.5" stroke={stroke} strokeWidth="3" fill="transparent"></circle>
  </svg>
);

export default Indicator;
