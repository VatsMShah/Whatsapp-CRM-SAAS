import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { BookingsTable } from './components/tables/BookingsTable';
import { TransportersTable } from './components/tables/TransportersTable';
import { SupportTable } from './components/tables/SupportTable';
import { LiveInbox } from './components/inbox/LiveInbox';
import { SmartMatcher } from './components/smart/SmartMatcher';
import { BroadcastModal } from './components/broadcast/BroadcastModal';
import { dbService, ACTIVE_CLIENT_PROFILE } from './services/supabase';
import { BookingLead, Transporter, ConversationThread, ClientCompanyProfile } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [clientProfile] = useState<ClientCompanyProfile>(ACTIVE_CLIENT_PROFILE);

  // Real Database state
  const [bookings, setBookings] = useState<BookingLead[]>([]);
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [conversations, setConversations] = useState<ConversationThread[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Broadcast modal state
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastRecipients, setBroadcastRecipients] = useState<any[]>([]);

  // Smart matcher state
  const [selectedBookingForMatch, setSelectedBookingForMatch] = useState<BookingLead | undefined>(undefined);

  // Fetch real data from Supabase
  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [b, t, c] = await Promise.all([
        dbService.getBookings(),
        dbService.getTransporters(),
        dbService.getConversations(),
      ]);
      setBookings(b || []);
      setTransporters(t || []);
      setConversations(c || []);
    } catch (err) {
      console.error('Failed to load Supabase data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll every 15s to keep live WhatsApp stream updated
    const interval = setInterval(() => {
      loadData();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenBroadcastModal = (recipients: any[] = []) => {
    setBroadcastRecipients(recipients.length > 0 ? recipients : bookings);
    setIsBroadcastModalOpen(true);
  };

  const handleSelectBookingForMatch = (booking: BookingLead) => {
    setSelectedBookingForMatch(booking);
    setCurrentTab('matcher');
  };

  const handleUpdateBookingStatus = async (userId: string, status: BookingLead['status']) => {
    await dbService.updateBookingStatus(userId, status);
    setBookings((prev) =>
      prev.map((b) => (b.user_id === userId ? { ...b, status } : b))
    );
  };

  const handleSendInboxMessage = async (phone: string, text: string) => {
    await dbService.sendAgentMessage(phone, text);
    const updated = await dbService.getConversations();
    setConversations(updated);
  };

  const handleToggleBotMode = async (_phone: string, _mode: 'bot' | 'human') => {
    // Mode toggled
  };

  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return {
          title: 'Executive Dashboard',
          subtitle: 'Live summary of customer bookings, fleet availability, and bot conversations',
        };
      case 'bookings':
        return {
          title: 'Customer Bookings Desk',
          subtitle: 'Realtime freight demand leads collected directly via WhatsApp bot',
        };
      case 'transporters':
        return {
          title: 'Transporter Fleet Registry',
          subtitle: 'Available trucks, drivers, and registered logistics partners',
        };
      case 'inbox':
        return {
          title: 'Live 2-Way WhatsApp Inbox',
          subtitle: 'Realtime customer conversation stream with 1-click human agent takeover',
        };
      case 'broadcast':
        return {
          title: '1-Click Broadcast & Follow-ups',
          subtitle: 'Dispatch personalized WhatsApp follow-ups, payment reminders, and rate offers',
        };
      case 'matcher':
        return {
          title: 'Smart Load-to-Transporter Matcher',
          subtitle: 'Automated vehicle pairing engine for customer load requirements',
        };
      case 'support':
        return {
          title: 'Customer Support Desk',
          subtitle: 'Inquiries and assistance tickets submitted by customers',
        };
      default:
        return {
          title: 'Shrimad Raj Automation',
          subtitle: 'WhatsApp Logistics Platform',
        };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <div className="flex h-screen overflow-hidden bg-[#090d16] text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        clientProfile={clientProfile}
        bookingCount={bookings.length}
        transporterCount={transporters.length}
        activeChatCount={conversations.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header
          title={title}
          subtitle={subtitle}
          clientProfile={clientProfile}
          onOpenBroadcastModal={() => handleOpenBroadcastModal(bookings)}
          onRefreshData={loadData}
          isRefreshing={isRefreshing}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {currentTab === 'dashboard' && (
            <DashboardOverview
              bookings={bookings}
              transporters={transporters}
              clientProfile={clientProfile}
              onNavigateTab={setCurrentTab}
              onOpenBroadcast={() => handleOpenBroadcastModal(bookings)}
            />
          )}

          {currentTab === 'bookings' && (
            <BookingsTable
              bookings={bookings}
              onSelectBookingForMatch={handleSelectBookingForMatch}
              onOpenBroadcastForSelected={(selected) => handleOpenBroadcastModal(selected)}
              onUpdateStatus={handleUpdateBookingStatus}
            />
          )}

          {currentTab === 'transporters' && (
            <TransportersTable
              transporters={transporters}
              onOpenBroadcastForSelected={(selected) => handleOpenBroadcastModal(selected)}
            />
          )}

          {currentTab === 'inbox' && (
            <LiveInbox
              conversations={conversations}
              onSendMessage={handleSendInboxMessage}
              onToggleBotMode={handleToggleBotMode}
            />
          )}

          {currentTab === 'broadcast' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Broadcast & Campaign Dispatcher</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Launch personalized WhatsApp follow-ups, payment reminders, or freight announcements
                  </p>
                </div>
                <button
                  onClick={() => handleOpenBroadcastModal(bookings)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition"
                >
                  + Launch New Broadcast
                </button>
              </div>

              <BookingsTable
                bookings={bookings}
                onSelectBookingForMatch={handleSelectBookingForMatch}
                onOpenBroadcastForSelected={(selected) => handleOpenBroadcastModal(selected)}
                onUpdateStatus={handleUpdateBookingStatus}
              />
            </div>
          )}

          {currentTab === 'matcher' && (
            <SmartMatcher
              bookings={bookings}
              transporters={transporters}
              selectedBooking={selectedBookingForMatch}
              onOpenBroadcastForTransporter={(transporter) => handleOpenBroadcastModal([transporter])}
            />
          )}

          {currentTab === 'support' && <SupportTable />}
        </main>
      </div>

      {/* 1-Click Broadcast Modal */}
      <BroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        selectedRecipients={broadcastRecipients}
      />
    </div>
  );
}

export default App;
