import React from 'react'
import TestHomeHeader from './TestHomeHeader'; 
import TestHomeMain from './TestHomeMain';
import TestHomeFooter from './TestHomeFooter';

const TestHome = () => {
  return (
    <div className='min-h-screen'>
      <TestHomeHeader />
      <TestHomeMain />
      <TestHomeFooter />
    </div>
  )
}

export default TestHome
