import React, { useState, useEffect } from "react";

const RevealWithTimeout = ({ children, seconds }) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true);
    }, seconds * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return revealed ? children : null;
};

export default RevealWithTimeout;
