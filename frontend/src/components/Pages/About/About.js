import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import bandPhoto from './BandPhotos/bandphoto.jpg';
import jPhoto from './BandPhotos/jacob.jpg';
import pPhoto from './BandPhotos/parker.jpg';
import sPhoto from './BandPhotos/shan.jpg';
import stephanPhoto from './BandPhotos/stephan.jpg';
import kPhoto from './BandPhotos/keith.jpg';


// Previous bio, retired 2026-09-22 in favor of one a promoter can actually use:
// "Maldevera, born Shawn Corey Carter, is a renowned American rapper..."
// Still in git history if we ever want it back.
export default function About() {
    return (
        <div className="about-wrapper">
            <img className='band-photo' src={ bandPhoto } alt='Maldevera - the four members shot from below against a white building' />
            {/* <div className='band-photo-description'>TEXT ABOUT BAND ORIGIN, DATES WHEN WE STARTED, MUSIC INFLUENCES, JEFF MYTHOS EXPLAINED, ETC.</div> */}
            <div className='band-photo-description'>Est 2011<br />DTX / NOLA<br />"Taste the corners of your mind."</div>
            <div className='band-bio'>
                <p>
                    Maldevera is a four-piece death-thrash band out of Dallas&ndash;Fort Worth
                    and New Orleans, playing since 2011. The songs run on groove and blunt
                    force &mdash; riffs that move, tempos that refuse to sit still, and titles
                    like &ldquo;Mouthful of Concrete&rdquo; that tell you most of what you need
                    to know going in.
                </p>
                <p>
                    The current record is <em>Guts / Winter Palace</em>, with music videos for
                    &ldquo;Jukai,&rdquo; &ldquo;Icon of Sin,&rdquo; and &ldquo;From Man to
                    Mist.&rdquo; Since 2024 the band has played more than forty shows across
                    Texas and the South &mdash; sharing bills with Terminal Nation, Evil Army,
                    Ascended Dead, Oxygen Destroyer, Volcandra and Sadistic Force &mdash; and
                    ran the East Coast in June 2026 through Houston, Birmingham, Atlanta,
                    Richmond, Baltimore and New York.
                </p>
            </div>
            <div className='band-photo-description'>
                <Link to='https://maldevera.bandcamp.com/' className='bandcamp-link'>&#9758; Discography &#9756;</Link>
                <br />
                <a className="bandcamp-link" href="mailto:MaldeveraTX@gmail.com">&#9758; Booking: MaldeveraTX@gmail.com &#9756;</a>
                <br />
                <Link to='/press' className='bandcamp-link'>&#9758; Press Kit &#9756;</Link>
            </div>
            <ul className='individual-photos-ul'>
                <li className='individual-photo-li'>
                    <img className='individual-photo' src={ pPhoto } alt='Parker Turney'></img>
                    <div className='indivitual-photo-description'>Parker Turney</div>
                </li>
                <li className='individual-photo-li'>
                    <img className='individual-photo' src={ jPhoto } alt='Jacob Chamberlain'></img>
                    <div className='indivitual-photo-description'>Jacob Chamberlain</div>
                </li>
                <li className='individual-photo-li'>
                    <div className='photo-flip-container'>
                        <img className='individual-photo photo-front' src={ sPhoto } alt='Shannon Paine-Jesam'></img>
                        <img className='individual-photo photo-back' src={ stephanPhoto } alt='Stephan'></img>
                    </div>
                    <div className='indivitual-photo-description'>Shannon Paine-Jesam</div>
                </li>
                <li className='individual-photo-li'>
                    <img className='individual-photo' src={ kPhoto } alt='Keith Brown'></img>
                    <div className='indivitual-photo-description'>Keith Brown</div>
                </li>
            </ul>
        </div>
    )
}