import { useState, useEffect } from "react";
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER);
const Admin: React.FC = () => {
    const [message, setMessage] = useState('Waiting...');

    useEffect(() => {
        return () => {
            socket.off('nextQuestion');
            socket.off('prevQuestion');
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
        <div className="h-screen w-full flex flex-col items-center justify-center gap-6">
            <div className="text-3xl flex gap-5">
                <button
                    onClick={handleClickPrev}
                    className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95"
                >
                    Vorige vraag
                </button>
                <button
                    onClick={handleClickNext}
                    className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95"
                >
                    Volgende vraag
                </button>
            </div>
        </div>
    );
}

export default Admin