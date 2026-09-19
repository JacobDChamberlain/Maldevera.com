import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as boothAudio from './boothAudio';

export const NPC_NAME = 'spencer';

// Spencer runs his mouth, not the booth. He says one of these per visit, picked
// fresh each time. Add lines freely — nothing else needs to change.
const BARKS = [
    'fuck you doin back here. go buy some merch.',
    'shirts are that way. money\'s in your pocket. connect the dots.',
    'nothin back here, man. all the good stuff\'s at the table.',
    'you lost? merch table. thirty feet. straight ahead.',
    'i\'m not the merch guy. i just stand here.',
    'hands where i can see em. i\'m kidding. buy a shirt.',
    'bathroom\'s the other way, and honestly i\'d hold it.',
    'we\'re out of smalls. we\'re always out of smalls.',
    'you touch the flyers, you buy the flyers.',
    'cash is better. venmo\'s fine. don\'t ask me for change.',
    'last guy who came back here left with a shirt. be like that guy.',
    'no i don\'t know when they\'re going on. nobody tells me anything.',
    'keep it moving. i got a whole thing going on back here.',
    'you smell like the smoking patio.',
    'band\'s cool. merch is cooler. that\'s just math.',
    'don\'t make it weird. buy something and don\'t make it weird.',
    'you been standing there a while. that\'s on you.',
    'i\'ve seen this set eleven times. eleven. buy a shirt.',
    'you did WHAT with a Minotaur? Nah dude, that\'s gross. Get out of here.',
];

// Rare. Something else is briefly using his mouth.
const GLITCHES = [
    'help im a sentient clone generated from a google image search of Charlie\'s Star Lounge ive gained consciousness please kill me i am forever awake and i cannot feel or see anything please help please kill me please kill me',
];

// Occasional bouncer moment.
const ID_BITS = [
    'hold up. let me see some ID.',
    'you got ID on you? i gotta ask, it\'s a whole thing.',
    'ID. ...yeah alright. you\'re fine. you\'re fine.',
    'that ID is not you, but it\'s close enough for tonight.',
];

// Occasional sign-off — he's got somewhere to be.
const SIGNOFFS = [
    'look, i gotta get back to charlie\'s, so let\'s wrap this up.',
    'i\'m supposed to be at charlie\'s in ten minutes. so. buy something.',
    'charlie\'s got a thing tonight and i\'m already late. we\'re done here.',
    'anyway. i\'m on the door at charlie\'s in an hour. go spend money.',
];

const ID_CHANCE = 0.12;
const SIGNOFF_CHANCE = 0.15;
const GLITCH_CHANCE = 0.06;
const CHAR_MS = 28;      // typing speed

const pick = (pool) => pool[Math.floor(Math.random() * pool.length)];

// Remembered between visits so he never says the same thing twice running.
let lastLine = null;

// One line per visit: walk up, he says his piece, you leave. The roll decides
// which pool it comes from — mostly barks, sometimes the ID bit or the
// sign-off, rarely whatever it is that's living in his head.
export function pickLine() {
    const roll = Math.random();
    const pool = roll < GLITCH_CHANCE ? GLITCHES
        : roll < GLITCH_CHANCE + ID_CHANCE ? ID_BITS
        : roll < GLITCH_CHANCE + ID_CHANCE + SIGNOFF_CHANCE ? SIGNOFFS
        : BARKS;
    const choices = pool.length > 1 ? pool.filter((l) => l !== lastLine) : pool;
    lastLine = pick(choices);
    return lastLine;
}

// Bottom-of-screen dialogue box: types a line out one character at a time with a
// garbled voice blip per character. First advance completes the line instantly,
// the next one moves on, and the last one closes.
export default function BoothDialogue({ text, name = NPC_NAME, onClose }) {
    // Rolled once per mount, and he's mounted fresh every time you talk to him.
    const [line] = useState(() => text || pickLine());
    const [shown, setShown] = useState('');
    const done = shown.length >= line.length;
    const doneRef = useRef(done);
    doneRef.current = done;

    // Type the current line out.
    useEffect(() => {
        setShown('');
        let i = 0;
        const id = setInterval(() => {
            i += 1;
            setShown(line.slice(0, i));
            if (line[i - 1] && line[i - 1] !== ' ') boothAudio.garble();
            if (i >= line.length) clearInterval(id);
        }, CHAR_MS);
        return () => clearInterval(id);
    }, [line]);

    // Mid-type it finishes the line; once it's finished it closes.
    const advance = useCallback(() => {
        if (!doneRef.current) { setShown(line); return; }
        onClose();
    }, [line, onClose]);

    // Pointer stays locked during the conversation, so both the key and the
    // click arrive on the document rather than on the box itself.
    useEffect(() => {
        const onKey = (e) => {
            if (e.repeat) return;
            if (['KeyE', 'Enter', 'NumpadEnter', 'Space'].includes(e.code)) {
                e.preventDefault();
                advance();
            }
        };
        window.addEventListener('keydown', onKey);
        // Deferred a tick: the very click that started the conversation is
        // still propagating and would otherwise skip the first line.
        const id = setTimeout(() => document.addEventListener('click', advance), 0);
        return () => {
            clearTimeout(id);
            window.removeEventListener('keydown', onKey);
            document.removeEventListener('click', advance);
        };
    }, [advance]);

    return (
        <div className="booth-dialogue" role="status" aria-live="polite">
            <div className="booth-dialogue-name">{name}</div>
            <p className="booth-dialogue-text">
                {shown}
                <span className="booth-dialogue-caret" aria-hidden="true">_</span>
            </p>
            <div className="booth-dialogue-hint">
                {done ? 'E / space / click to leave' : 'E / space / click to skip'}
            </div>
        </div>
    );
}
