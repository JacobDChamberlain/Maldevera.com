import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as boothAudio from './boothAudio';

// Everything the guy at the back of the room says. Edit freely — one string per
// box; the player advances with E / Enter / click.
export const NPC_NAME = 'spencer';
export const NPC_LINES = [
    'you walked all the way back here.',
    'nobody walks all the way back here.',
    "i've been standing like this since the last set. arms are killing me.",
    "i'm not going to hit you. i'm just ready. in case.",
    'go buy a shirt. i\'ll still be here.',
];

const CHAR_MS = 28;  // typing speed

// Bottom-of-screen dialogue box: types a line out one character at a time with a
// garbled voice blip per character. First advance completes the line instantly,
// the next one moves on, and the last one closes.
export default function BoothDialogue({ lines = NPC_LINES, name = NPC_NAME, onClose }) {
    const [index, setIndex] = useState(0);
    const [shown, setShown] = useState('');
    const line = lines[index] || '';
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
        if (index < lines.length - 1) setIndex(index + 1);
        else onClose();
    }, [index, line, lines.length, onClose]);

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
                    ? (index < lines.length - 1 ? 'E / click to continue' : 'E / click to leave')
                    : 'E / click to skip'}
            </div>
        </div>
    );
}
