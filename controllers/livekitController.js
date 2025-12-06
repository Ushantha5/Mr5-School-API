import { AccessToken } from 'livekit-server-sdk';

export const createToken = async (req, res) => {
    try {
        const { roomName, participantName } = req.body;

        if (!roomName || !participantName) {
            return res.status(400).json({ error: 'roomName and participantName are required' });
        }

        const at = new AccessToken(
            process.env.LIVEKIT_API_KEY,
            process.env.LIVEKIT_API_SECRET,
            {
                identity: participantName,
            }
        );

        at.addGrant({ roomJoin: true, room: roomName });

        const token = await at.toJwt();

        res.json({ token });
    } catch (error) {
        console.error('Error creating LiveKit token:', error);
        res.status(500).json({ error: 'Failed to create token' });
    }
};
