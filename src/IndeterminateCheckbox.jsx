import React, { useRef, useEffect } from 'react';

export const CHECKED = 1;
export const UNCHECKED = 2;
export const INDETERMINATE = -1;

const IndeterminateCheckbox = ({ value, ...otherProps }) => {
  const checkRef = useRef();

  useEffect(() => {
    if(value  === CHECKED){
      checkRef.current.checked = true ;
    } else{
      checkRef.current.checked = false ;
    }
    if(value  === INDETERMINATE){
      checkRef.current.indeterminate = true ;
    } else{
      checkRef.current.indeterminate = false ;
    }
  }, [value]);

  return (
    <input
      type="checkbox"
      ref={checkRef}
      {...otherProps}
    />
  );
};

export default IndeterminateCheckbox;