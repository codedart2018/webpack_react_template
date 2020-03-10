import React, {useState} from 'react';

const Button = props => {
  const [count, setCount] = useState(0);

  return (
    <div onClick={() => setCount(count + 1)}>点击我增加: {count}</div>
  );
};

export default Button;