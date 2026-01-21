import { useEffect, useRef } from 'react';

// Custom hook to debounce values
const useDebounce = (value, delay) => {
  const debouncedValue = useRef(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      debouncedValue.current = value;
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue.current;
};

export default useDebounce;
