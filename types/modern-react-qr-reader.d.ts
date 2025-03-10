declare module 'modern-react-qr-reader' {
  import { ComponentType } from 'react';

  interface QrReaderProps {
    delay?: number | false;
    onError?: (error: any) => void;
    onScan?: (data: string | null) => void;
    style?: React.CSSProperties;
    facingMode?: 'user' | 'environment';
  }

  const QrReader: ComponentType<QrReaderProps>;

  export default QrReader;
}