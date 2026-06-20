import { useState } from 'react';

function useMessage() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const showMessage = (
    text,
    type = 'success'
  ) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage('');
    }, 1500);
  };

  return {
    message,
    messageType,
    showMessage
  };
}

export default useMessage;