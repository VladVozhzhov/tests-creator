import React from 'react'
import TestHomeHeader from './TestHomeHeader'; 
import TestHomeMain from './TestHomeMain';
import TestHomeFooter from './TestHomeFooter';

const TestHome = () => {
  return (
    <div className='bg-gradient-to-r from-gray-200 to-gray-300 shadow-md min-h-screen'>
      <TestHomeHeader />
      <TestHomeMain />
      <TestHomeFooter />
    </div>
  )
}

export default TestHome
