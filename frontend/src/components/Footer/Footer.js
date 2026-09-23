import React, { useState, useEffect } from 'react';
import Player from '../Player/Player';
import './Footer.css';

// MP3 (~6 MB each), not the WAV masters (~70 MB each) that used to ship here:
// the player pulled one on every page load. Masters are still in audio/*.wav.
import Guts from './audio/1Guts.mp3';
import SusDigoCity from './audio/2SusDigoCity.mp3';
import MouthfulOfConcrete from './audio/3MouthfulOfConcrete.mp3';
import HydraulicInjectionInjury from './audio/4HydraulicInjectionInjury.mp3';
import Jukai from './audio/5Jukai.mp3';
import IconOfSin from './audio/6IconOfSin.mp3';
import WinterPalace from './audio/7WinterPalace.mp3';
import MoMurda from './audio/8gangstapat-momurda.mp3';
import ChristmasInHollis from './audio/ChristmasInHollis.mp3';
import IAmSantaClaus from './audio/IAmSantaClaus.mp3';
import RudolphTheRedNosedReindeer from './audio/RudolphTheRedNosedReindeer.mp3';

const albumTracks = [
    { title: 'Guts', path: Guts, },
    { title: 'Sus Digo City', path: SusDigoCity, },
    { title: 'Mouthful Of Concrete', path: MouthfulOfConcrete, },
    { title: 'Hydraulic Injection Injury', path: HydraulicInjectionInjury, },
    { title: 'Jukai', path: Jukai, },
    { title: 'Icon Of Sin', path: IconOfSin, },
    { title: 'Winter Palace', path: WinterPalace },
    { title: 'Gangsta Pat - Mo Murda', path: MoMurda },
    // { title: 'Christmas In Hollis', path: ChristmasInHollis },
    // { title: 'I Am Santa Clas', path: IAmSantaClaus },
    // { title: 'Rudolph The Red Nosed Reindeer', path: RudolphTheRedNosedReindeer }
]


export default function Footer() {
    const [selectedTrack, setSelectedTrack] = useState(null); // Initialize with null
    const [isMinimized, setIsMinimized] = useState(true);

    useEffect(() => {
        const randomTrackIndex = Math.floor(Math.random() * albumTracks.length);
        setSelectedTrack(albumTracks[randomTrackIndex].path);
    }, []); // better randomness than above? (ask the robot why idk)

    const handleTrackSelection = (e) => {
        setSelectedTrack(e.target.value);
    };

    const toggleFooter = () => {
        setIsMinimized(!isMinimized);
    }

    return (
        <div className={`footer-wrapper ${isMinimized ? 'minimized' : ''}`}>
            <button className='footer-toggle' onClick={toggleFooter}>
                {isMinimized ? '▲' : '▼'}
            </button>
            {!isMinimized && (
                <>
                    <select className='song-select' onChange={handleTrackSelection} value={selectedTrack}>
                        {albumTracks.map((track, idx) => (
                            <option key={idx} value={track.path}>{track.title}</option>
                        ))}
                    </select>
                    {selectedTrack && <Player track={selectedTrack} />}
                </>
            )}
        </div>
    );
}
