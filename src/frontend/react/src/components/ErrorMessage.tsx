import React from 'react';
import { Alert } from 'antd';

interface ErrorMessageProps {
  message: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  description,
  onRetry 
}) => {
  return (
    <Alert
      message={message}
      description={description}
      type="error"
      showIcon
      action={
        onRetry && (
          <a onClick={onRetry} style={{ cursor: 'pointer' }}>
            重试
          </a>
        )
      }
      style={{ margin: '20px 0' }}
    />
  );
};
