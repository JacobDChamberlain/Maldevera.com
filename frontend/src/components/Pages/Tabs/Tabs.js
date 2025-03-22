import React from 'react';
import './Tabs.css';
import AlphaTab from './AlphaTab/AlphaTab';

export default function Tabs() {
    return (
        <div className="tabs-wrapper">
            <h2 className='tabs-page-header'>Tabs:</h2>
            <div className='tabs-body'>
                Tabs displayed here...
                <AlphaTab />
            </div>
        </div>
    )
}