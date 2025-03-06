import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRGeneratorProps {
  token: string;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ token }) => {
  return (
    <div>
      <QRCodeSVG value={token} />
    </div>
  );
};

export default QRGenerator;
