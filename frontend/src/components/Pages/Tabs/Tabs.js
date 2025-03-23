import React from 'react';
import './Tabs.css';

export default function Tabs() {
    return (
        <div className="tabs-wrapper">
            <h2 className='tabs-page-header'>⚠️ Under Construction ⚠️</h2>
            <h5 className='tabs-page-header'>Mobile view coming soon!</h5>
            <h6 className='tabs-page-header'>Also don't steal our shit</h6>
            <div className='tabs-body'>
                <iframe
                    src="https://maldetabviewer.onrender.com/"
                    title="Malde Tab Viewer"
                    width="100%"
                    height="800"
                    style={{ border: 'none' }}
                />
            </div>
        </div>
    )
}