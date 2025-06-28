import React from 'react';
import { useSpring, animated } from 'react-spring';

interface Props {
  value: number;
  decimals?: number;
}

const AnimatedNumber: React.FC<Props> = ({ value, decimals = 1 }) => {
  const props = useSpring({ val: value, from: { val: 0 } });
  return (
    <animated.span>
      {props.val.to((v) => v.toFixed(decimals))}
    </animated.span>
  );
};

export default AnimatedNumber;
