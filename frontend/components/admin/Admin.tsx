import { useState, useEffect } from "react";
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER);
const Admin: React.FC = () => {
    const [message, setMessage] = useState('Waiting...');

    useEffect(() => {
        socket.on('buttonClicked', () => {
            setMessage('Other browser clicked!');
        });

        return () => {
            socket.off('buttonClicked');
        };
    }, []);

    const handleClickNext = () => {
        socket.emit('nextQuestion');
        setMessage('You clicked the button');
    };

    const handleClickPrev = () => {
        socket.emit('prevQuestion');
        setMessage('You clicked the button');
    };
    return (
        <div style={{ padding: '2rem' }}>
            <button onClick={handleClickPrev}>prev me</button>
            <p>{message}</p>
            <button onClick={handleClickNext}>next me</button>
            <p>{message}</p>
        </div>
    );
}

export default Admin