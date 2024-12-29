// components/Spinner.js

'use client'


import React from 'react'
import { InfinitySpin } from 'react-loader-spinner'

const Loader = () => (
  <div className="spinner-container">
    <InfinitySpin
      visible={true}
      width="200"
      color="#4fa94d"
      ariaLabel="infinity-spin-loading"
    />
  </div>
)

export default Loader;
