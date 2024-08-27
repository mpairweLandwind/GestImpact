import { useEffect, useState } from 'react';

const usePayPalScript = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const scriptId = 'paypal-js-sdk';
    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      setLoaded(true);
      return;
    }

    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    if (!clientId) {
      console.error('PayPal Client ID is not set');
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.async = true;
    script.onload = () => {
      setTimeout(() => {
        setLoaded(true);
        console.log('PayPal SDK loaded successfully');
      }, 3000); // 3 seconds delay to ensure script readiness
    };
    script.onerror = () => {
      console.error('PayPal SDK could not be loaded.');
      setLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      setLoaded(false);
      console.log('PayPal SDK script removed');
    };
  }, []);

  return loaded;
};

export default usePayPalScript;
