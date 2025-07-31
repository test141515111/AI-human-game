import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { socketService } from '../services/socket';

export function ChatBox() {
  const { messages, gameState, currentPlayer } = useGameStore();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !currentPlayer || currentPlayer.status !== 'alive') {
      return;
    }

    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('sendMessage', inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const canSendMessage = gameState?.phase === 'day_discussion' && 
                         currentPlayer?.status === 'alive';

  return (
    <div className="bg-gray-800 rounded-lg flex flex-col h-96">
      <div className="p-3 border-b border-gray-700">
        <h3 className="font-semibold">チャット</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => {
          const player = gameState?.players.find(p => p.id === message.playerId);
          return (
            <div key={message.id} className="text-sm">
              <span className="font-medium text-blue-400">{player?.name || '不明'}: </span>
              <span className="text-gray-300">{message.content}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!canSendMessage}
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white disabled:opacity-50"
            placeholder={canSendMessage ? 'メッセージを入力...' : '議論フェーズのみ発言可能'}
          />
          <button
            onClick={sendMessage}
            disabled={!canSendMessage}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-md font-medium transition"
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}