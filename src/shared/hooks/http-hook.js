import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequest.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });
        const responseData = await response.json();

        activeHttpRequest.current = activeHttpRequest.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        setSuccess(responseData.message);
        return responseData;
      } catch (err) {
        console.log(err);
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };
  const clearSuccess = () => {
    setSuccess(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);
  return {
    isLoading,
    error,
    clearError,
    setError,
    sendRequest,
    success,
    setSuccess,
    clearSuccess,
  };
};
