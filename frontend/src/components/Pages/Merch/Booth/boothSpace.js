// Shared room dimensions. The booth sits at the origin facing +z; the player
// spawns just in front of it and the venue now runs a long way BACK (+z) into
// the dark, with the stranger waiting at the far end of it.

export const ROOM = {
    xHalf: 13,     // side walls
    zBooth: -3.4,  // wall behind the booth (the booth's own backdrop)
    zRear: 30,     // far wall, way behind the player's spawn
    height: 12,
};

// Walkable area, kept just inside the walls.
export const BOUNDS = {
    xHalf: ROOM.xHalf - 1.2,
    zMin: -6,
    zMax: ROOM.zRear - 1.2,
};

// The figure standing at the back of the room.
export const NPC = {
    x: 0,
    z: 24,
    height: 1.85,  // any dropped-in GLB is scaled to this
    radius: 0.55,  // you bump into him instead of walking through
    talkRange: 7,  // walk this far away and the conversation drops
};
