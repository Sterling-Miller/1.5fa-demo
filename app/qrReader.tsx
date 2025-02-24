'use client'

import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

const QrCodeReader = () => {
    return <Scanner onScan={(result) => console.log(result)} />;
}

export default QrCodeReader;
