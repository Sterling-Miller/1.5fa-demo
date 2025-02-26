import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRGenerator: React.FC = () => {
    return (
        <div>
            <QRCodeSVG value="https://example.com" />
        </div>
    );
};

export default QRGenerator;