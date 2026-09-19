import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as boothAudio from './boothAudio';

export const NPC_NAME = 'spencer';

// Spencer runs his mouth, not the booth. Every conversation is assembled fresh
// from these pools, so walking back to him twice never plays the same script.
// Add lines freely — nothing else needs to change.
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
];

// Occasional bouncer moment, slotted in right after the opener.
const ID_BITS = [
    'hold up. let me see some ID.',
    'you got ID on you? i gotta ask, it\'s a whole thing.',
    'ID. ...yeah alright. you\'re fine. you\'re fine.',
    'that ID is not you, but it\'s close enough for tonight.',
];

// Occasional sign-off — always the last thing he says.
const SIGNOFFS = [
    'look, i gotta get back to charlie\'s, so let\'s wrap this up.',
    'i\'m supposed to be at charlie\'s in ten minutes. so. buy something.',
    'charlie\'s got a thing tonight and i\'m already late. we\'re done here.',
    'anyway. charlie\'s waiting on me. go spend money.',
];

const ID_CHANCE = 0.25;
const SIGNOFF_CHANCE = 0.35;
const CHAR_MS = 28;      // typing speed

const pick = (pool) => pool[Math.floor(Math.random() * pool.length)];

// Remembered across conversations so he never opens with the same line twice
// in a row — the one repeat you'd actually notice.
let lastOpener = null;

export function pickConversation() {
    const pool = BARKS.filter((l) => l !== lastOpener);
    const barks = [];
    const want = Math.min(2 + Math.floor(Math.random() * 2), pool.length);
    while (barks.length < want) {
        const line = pick(pool);
        if (!barks.includes(line)) barks.push(line);
    }
    lastOpener = barks[0];

    const lines = [...barks];
    if (Math.random() < ID_CHANCE) lines.splice(1, 0, pick(ID_BITS));
    if (Math.random() < SIGNOFF_CHANCE) lines.push(pick(SIGNOFFS));
    return lines;
}

// Bottom-of-screen dialogue box: types a line out one character at a time with a
// garbled voice blip per character. First advance completes the line instantly,
// the next one moves on, and the last one closes.
export default function BoothDialogue({ lines, name = NPC_NAME, onClose }) {
    // Rolled once per mount, and he's mounted fresh every conversation.
    const [script] = useState(() => lines || pickConversation());
    const [index, setIndex] = useState(0);
    const [shown, setShown] = useState('');
    const line = script[index] || '';
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
        // index is a dep too, so two identical lines in a row still retype.
    }, [line, index]);

    const advance = useCallback(() => {
        if (!doneRef.current) { setShown(line); return; }
        if (index < script.length - 1) setIndex(index + 1);
        else onClose();
    }, [index, line, script.length, onClose]);

    // Pointer stays locked during the conversation, so both the key and the
    // click arrive on the document rather than on the box itself.
    useEffect(() => {
        const onKey = (e) => {
            if (e.repeat) return;
            if (e.code === 'KeyE' || e.code === 'Enter' || e.code === 'NumpadEnter') {
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
                {done
                    ? (index < script.length - 1 ? 'E / click to continue' : 'E / click to leave')
                    : 'E / click to skip'}
            </div>
        </div>
    );
}
