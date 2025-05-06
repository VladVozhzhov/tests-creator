import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';

const TestHomeHeader = () => {
    const { selected, setSelected } = useContext(DataContext);

    const handleSelect = (item) => {
        setSelected(item);
    };

    return (
        <header className='flex flex-col items-center justify-center gap-6 py-8'>
            <h1 className='text-4xl font-bold text-gray-800'>Test Creator</h1>
            <label className='text-lg text-gray-700' htmlFor='sortby'>Sort by:</label>
            <ul className='flex flex-row gap-4' id='sortby'>
                {['Most Liked', 'Most Visited', 'Most Recent'].map((item) => (
                    <li
                        key={item}
                        className={`flex items-center text-sm text-gray-700 cursor-pointer px-4 py-2 bg-white rounded-md shadow-sm hover:bg-gray-100 transition ${selected === item ? 'font-bold text-blue-500' : ''}`}
                        onClick={() => handleSelect(item)}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </header>
    );
};

export default TestHomeHeader;
