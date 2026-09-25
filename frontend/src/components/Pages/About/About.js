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
            <div className='band-photo-description'>Est 2011<br />DTX<br />"Taste the corners of your mind."</div>
            <div className='band-bio'>
                <p>
                    Maldevera is a four-piece death-thrash metal band based out of Dallas, Texas.
                    Playing since 2011, we've developed a groove-heavy sound, laced with technical prowess.
                    Pulling influence from all over, the undulating rhythms, intricate but catchy riffs, demonic vocal harmonies, and memorable solos all come together to create the sonic gestalt that is Maldevera.
                </p>
                <p>
                    FFO: Atheist, Death, Decapitated, Lamb of God, Exodus, Testament, Vovoid, Old Metallica, Demolition Hammer, Pantera, Necrophagist, Morbid Angel, Frozen Soul, 200 Stab Wounds, Distain, Steel Bearing Hand, Void
                </p>
                <p>
                    In 2026, we released <em>From Man To Mist: Remisted</em>, our first album
                    remixed and remastered by Jack Control at Enormous Door Mastering.
                    You can find music videos for &ldquo;Jukai&rdquo; and &ldquo;Icon of Sin&rdquo; on our home page.
                </p>
                <p>
                    The band has played hundreds of shows across
                    Texas and the South, sharing bills with Oxygen Destroyer, Kontusion,
                    Gammacide, Void, Deceptor, Myth Carver, Lord Humongous, Panpsychism, Ramtha, Nocturnal Spawn,
                    Saintbreaker, Kombat, Evil Army, Ascended Dead, Volcandra, Sadistic Force.
                </p>
                <div className='tour-columns'>
                    <section className='tour-column'>
                        <h3 className='tour-heading'>East Coast</h3>
                        <p className='tour-year'>June 2026</p>
                        <ul className='tour-cities'>
                            <li>Houston</li>
                            <li>New Orleans</li>
                            <li>Birmingham</li>
                            <li>Atlanta</li>
                            <li>Richmond</li>
                            <li>Lexington</li>
                            <li>Baltimore</li>
                            <li>Cincinnati</li>
                            <li>New York</li>
                        </ul>
                    </section>
                    <section className='tour-column'>
                        <h3 className='tour-heading'>West Coast</h3>
                        <p className='tour-year'>2023</p>
                        <ul className='tour-cities'>
                            <li>Wichita</li>
                            <li>Denver</li>
                            <li>Salt Lake City</li>
                            <li>Las Vegas</li>
                            <li>Los Angeles</li>
                            <li>Tempe</li>
                            <li>Albuquerque</li>
                            <li>El Paso</li>
                            <li>Austin</li>
                        </ul>
                    </section>
                </div>
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