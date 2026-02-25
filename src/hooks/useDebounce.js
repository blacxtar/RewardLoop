/**
 * useDebounce — delays updating a value until the user stops changing it.
 * 
 * WHY: Used in product search to avoid firing an API call or filter
 * on every keystroke. Waits for the user to stop typing (default 300ms)
 * before returning the debounced value.
 * 
 * Usage:
 *   const debouncedSearch = useDebounce(searchQuery, 300);
 *   useEffect(() => { filterProducts(debouncedSearch); }, [debouncedSearch]);
 */

import { useState, useEffect } from 'react';

const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the timer if value changes before delay completes
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
