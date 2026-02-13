import React, { useState } from 'react';
import { Image } from 'antd';
import { PictureOutlined } from '@ant-design/icons';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  width = 200,
  height = 200,
  style,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          ...style,
        }}
      >
        <PictureOutlined style={{ fontSize: '24px', color: '#999' }}
/>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{ objectFit: 'cover', borderRadius: '4px', ...style }}
      preview={false}
      onError={() => setHasError(true)}
    />
  );
};
