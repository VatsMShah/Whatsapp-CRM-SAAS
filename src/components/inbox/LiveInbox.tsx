import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  User,
  Bot,
  UserCheck,
  CheckCheck,
  Phone,
  Building,
  Paperclip,
  Sparkles,
  Zap,
  Clock,
} from 'lucide-react';
import { ConversationThread } from '../../types';

interface LiveInboxProps {
  conversations: ConversationThread[];
  onSendMessage: (phone: string, text: string) => Promise<void>;
  onToggleBotMode: (phone: string, mode: 'bot' | 'human') => void;
}

export const LiveInbox: React.FC<LiveInboxProps> = ({
  conversations,
  onSendMessage,
  onToggleBotMode,
}) => {
  const [activePhone, setActivePhone] = useState<string>(conversations[0]?.phone || '');
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const activeThread = conversations.find((c) => c.phone === activePhone) || conversations[0];

  const handleSend = async () => {
    if (!inputText.trim() || !activeThread) return;
    setIsSending(true);
    const text = inputText;
    setInputText('');
    try {
      await onSendMessage(activeThread.phone, text);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickSnippet = (snippet: string) => {
    setInputText(snippet);
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800 h-[calc(100vh-140px)] flex overflow-hidden">
      {/* Left Column: Conversation Thread List */}
      <div className="w-80 border-r border-slate-800 flex flex-col bg-[#0b1220]">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Live Conversations
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
            {conversations.length} Active
          </span>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {conversations.map((thread) => {
            const isSelected = thread.phone === activeThread?.phone;
            return (
              <button
                key={thread.phone}
                onClick={() => setActivePhone(thread.phone)}
                className={`w-full p-3.5 text-left transition flex items-start space-x-3 ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-950/40 to-slate-900 border-l-4 border-emerald-500'
                    : 'hover:bg-slate-900/60'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs flex-shrink-0 relative">
                  <User className="w-4 h-4" />
                  {thread.mode === 'human' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-slate-900 absolute -bottom-0.5 -right-0.5" title="Human Takeover Active" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white truncate">
                      {thread.userName}
                    </span>
                    <span className="text-[10px] text-slate-500 flex-shrink-0">
                      {thread.lastTimestamp}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {thread.lastMessage}
                  </div>

                  <div className="flex items-center space-x-2 mt-1.5">
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                      {thread.phone}
                    </span>
                    {thread.mode === 'human' ? (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-medium">
                        Human Agent
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                        Bot Active
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Active Chat Thread Window */}
      {activeThread ? (
        <div className="flex-1 flex flex-col bg-[#0a101d]">
          {/* Chat Header */}
          <div className="p-3.5 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {activeThread.userName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white">{activeThread.userName}</h3>
                  <span className="text-[11px] text-emerald-400 font-mono">({activeThread.phone})</span>
                </div>
                <div className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                  {activeThread.company && (
                    <span className="flex items-center space-x-1">
                      <Building className="w-3 h-3 text-slate-500" />
                      <span>{activeThread.company}</span>
                    </span>
                  )}
                  <span>•</span>
                  <span>State: <span className="font-mono text-slate-300">{activeThread.state}</span></span>
                </div>
              </div>
            </div>

            {/* Mode Switcher: Bot vs Human Agent Takeover */}
            <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => onToggleBotMode(activeThread.phone, 'bot')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeThread.mode === 'bot'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Bot Mode</span>
              </button>
              <button
                onClick={() => onToggleBotMode(activeThread.phone, 'human')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeThread.mode === 'human'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Agent Takeover</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3.5 bg-[#070b14] bg-opacity-95">
            {activeThread.messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isBot = msg.sender === 'bot';
              const isAgent = msg.sender === 'agent';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isUser ? 'items-start' : 'items-end'
                  }`}
                >
                  <div
                    className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap shadow-md ${
                      isUser
                        ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/60'
                        : isAgent
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-tr-none shadow-amber-900/30'
                        : 'bg-[#005c4b] text-white rounded-tr-none'
                    }`}
                  >
                    {/* Header tag */}
                    <div className="text-[10px] font-bold tracking-wider uppercase mb-1 opacity-75">
                      {isUser ? activeThread.userName : isAgent ? '👤 Live Agent' : '🤖 WhatsApp Bot'}
                    </div>

                    {msg.text}

                    <div className="text-[9px] text-right mt-1.5 opacity-70 flex items-center justify-end space-x-1">
                      <span>{msg.timestamp}</span>
                      {!isUser && <CheckCheck className="w-3 h-3 inline" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Reply Snippets */}
          <div className="p-2.5 px-6 border-t border-slate-800/80 bg-slate-900/60 flex items-center space-x-2 overflow-x-auto">
            <span className="text-[11px] text-slate-400 flex items-center space-x-1 font-semibold flex-shrink-0">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Quick Quotes:</span>
            </span>
            <button
              onClick={() => handleQuickSnippet("Here is our guaranteed freight quote: ₹42,000 all-inclusive with door pickup and delivery. Reply 'Confirm' to lock this rate.")}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 whitespace-nowrap transition"
            >
              💰 Send ₹42,000 Quote
            </button>
            <button
              onClick={() => handleQuickSnippet("Please share your GST number and vehicle RC copy for loading slip generation.")}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 whitespace-nowrap transition"
            >
              📄 Request Documents
            </button>
            <button
              onClick={() => handleQuickSnippet("Our assigned vehicle will report at your loading point by 10:00 AM tomorrow. Driver details: MH 04 GP 8842 (Gurpreet Singh - 9819022345).")}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 whitespace-nowrap transition"
            >
              🚛 Driver Dispatch Alert
            </button>
          </div>

          {/* Message Input Box */}
          <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center space-x-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                activeThread.mode === 'human'
                  ? 'Type reply as Human Agent (Bot auto-reply paused)...'
                  : 'Type a manual reply (Switches to Agent mode)...'
              }
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSend}
              disabled={isSending || !inputText.trim()}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
          Select a conversation from the left to start live messaging
        </div>
      )}
    </div>
  );
};
