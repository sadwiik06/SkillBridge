import { useState, useEffect, useRef } from "react";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export const useChat = (userId, recipientId) => {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const stompClient = useRef(null);

    useEffect(() => {
        const socket = new SockJS('https://localhost:8080/ws-skillbridge');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            setConnected(true);
            client.subscribe(`/user/${userId}/queue/messages`, (payload) => {
                const newMessage = JSON.parse(payload.body);
                setMessages((prev) => [...prev, newMessage]);
            });
        }, (error) => {
            console.error("Connection error: ", error);
            setConnected(false);
        });

        stompClient.current = client;

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
                setConnected(false);
            }
        };
    }, [userId]);

    const sendMessage = (content) => {
        if (stompClient.current && connected && content) {
            const chatMessage = {
                senderId: userId,
                recipientId: recipientId,
                content: content,
                timestamp: new Date().toISOString()
            };
            stompClient.current.send("/api/chat.sendMessage", {}, JSON.stringify(chatMessage));
            setMessages((prev) => [...prev, chatMessage]);
        }
    };

    return { messages, sendMessage, connected, setMessages };
};