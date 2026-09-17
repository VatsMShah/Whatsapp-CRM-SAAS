import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  UserCheck,
  Bot,
  Search,
  CheckCircle2,
  CheckCheck,
  Building2,
  Phone,
} from 'lucide-react';
import { ConversationThread } from '../../types';

interface LiveInboxProps {
  conversations: ConversationThread[];
  onSendMessage: (phone: string, text: string) => Promise<void>;
  onToggleBotMode: (phone: string, mode: 'bot' | 'human') => Promise<void>;
}

export const LiveInbox: React.FC<LiveInboxProps> = ({
  conversations,
  onSendMessage,
  onToggleBotMode,
}) => {
  const [selectedPhone, setSelectedPhone] = useState<string>(
    conversations.length > 0 ? conversations[0].phone : ''
  );
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSending, setIsSending] = useState(false);

  const filteredConversations = conversations.filter(
    (c) =>
      c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.company || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeThread = conversations.find((c) => c.phone === selectedPhone) || conversations[0];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(activeThread.phone, inputText.trim());
      setInputText('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex rounded-2xl bg-slate-900/80 border border-slate-800/80 overflow-hidden shadow-sm">
      {/* Left Pane: Conversations List */}
      <div className="w-80 border-r border-slate-800/80 flex flex-col bg-[#0b101d]">
        <div className="p-3.5 border-b border-slate-800/80">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p>No active WhatsApp chats yet.</p>
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isSelected = c.phone === (activeThread ? activeThread.phone : '');
              return (
                <div
                  key={c.phone}
                  onClick={() => setSelectedPhone(c.phone)}
                  className={`p-3.5 cursor-pointer transition flex items-start space-x-3 ${
                    isSelected ? 'bg-emerald-500/10 border-l-2 border-emerald-400' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                    {c.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{c.userName}</span>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">{c.lastTimestamp}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">{c.lastMessage}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[10px] font-mono text-emerald-400">{c.phone}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                          c.mode === 'human'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {c.mode === 'human' ? 'Agent' : 'Bot'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Active Chat Room */}
      {activeThread ? (
        <div className="flex-1 flex flex-col bg-slate-950/40">
          {/* Thread Header */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center">
                {activeThread.userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-2">
                  <span>{activeThread.userName}</span>
                  {activeThread.company && (
                    <span className="text-[10px] font-normal text-slate-400">({activeThread.company})</span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-emerald-400 mt-0.5">{activeThread.phone}</div>
              </div>
            </div>

            {/* Human Takeover Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Mode:</span>
              <button
                onClick={() =>
                  onToggleBotMode(activeThread.phone, activeThread.mode === 'bot' ? 'human' : 'bot')
                }
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  activeThread.mode === 'human'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {activeThread.mode === 'human' ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Human Takeover Active</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5" />
                    <span>Automated Bot Active</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeThread.messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl text-xs whitespace-pre-line shadow-sm ${
                      isUser
                        ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/60'
                        : m.sender === 'agent'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                    }`}
                  >
                    <div className="text-[10px] font-bold opacity-75 mb-1">
                      {isUser ? 'Customer' : m.sender === 'agent' ? 'Human Agent' : 'WhatsApp Bot'}
                    </div>
                    {m.text}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1 px-1">
                    <span>{m.timestamp}</span>
                    {!isUser && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Send Input Bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-800/80 bg-slate-900/60 flex items-center space-x-2">
            <input
              type="text"
              placeholder={`Send WhatsApp reply to ${activeThread.userName}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
          Select a chat to begin live 2-way messaging.
        </div>
      )}
    </div>
  );
};
