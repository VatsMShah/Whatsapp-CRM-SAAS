import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { BookingsTable } from './components/tables/BookingsTable';
import { TransportersTable } from './components/tables/TransportersTable';
import { SessionsTable } from './components/tables/SessionsTable';
import { SupportTable } from './components/tables/SupportTable';
import { LiveInbox } from './components/inbox/LiveInbox';
import { SmartMatcher } from './components/smart/SmartMatcher';
import { BroadcastModal } from './components/broadcast/BroadcastModal';
import { SettingsPage } from './components/settings/SettingsPage';
import { dbService, INITIAL_TENANTS } from './services/supabase';
import { BookingLead, Transporter, SessionRecord, ConversationThread, WorkspaceTenant } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [tenants, setTenants] = useState<WorkspaceTenant[]>(INITIAL_TENANTS);
  const [activeTenant, setActiveTenant] = useState<WorkspaceTenant>(INITIAL_TENANTS[0]);

  // Data states
  const [bookings, setBookings] = useState<BookingLead[]>([]);
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [conversations, setConversations] = useState<ConversationThread[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Broadcast modal states
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastRecipients, setBroadcastRecipients] = useState<any[]>([]);

  // Smart matcher state
  const [selectedBookingForMatch, setSelectedBookingForMatch] = useState<BookingLead | undefined>(undefined);

  // Initial load
  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [b, t, s, c] = await Promise.all([
        dbService.getBookings(),
        dbService.getTransporters(),
        dbService.getSessions(),
        dbService.getConversations(),
      ]);
      setBookings(b);
      setTransporters(t);
      setSessions(s);
      setConversations(c);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTenant]);

  const handleOpenBroadcastModal = (recipients: any[] = []) => {
    setBroadcastRecipients(recipients);
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
    setConversations([...updated]);
  };

  const handleToggleBotMode = async (phone: string, mode: 'bot' | 'human') => {
    await dbService.toggleBotMode(phone, mode);
    const updated = await dbService.getConversations();
    setConversations([...updated]);
  };

  const handleUpdateTenant = (updated: WorkspaceTenant) => {
    setActiveTenant(updated);
    setTenants((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return { title: 'Executive Operations Hub', subtitle: 'Overview of inbound demands, fleet availability, and bot metrics' };
      case 'inbox':
        return { title: 'Live 2-Way WhatsApp Inbox', subtitle: 'Realtime chat stream with 1-click Human Agent takeover' };
      case 'bookings':
        return { title: 'Customer Freight Demands', subtitle: 'Live mirror of Supabase table `book_vehicle`' };
      case 'transporters':
        return { title: 'Transporter Fleet Registry', subtitle: 'Live mirror of Supabase table `provide_vehicle`' };
      case 'sessions':
        return { title: 'Master Bot Sessions', subtitle: 'Live mirror of Supabase table `users_master`' };
      case 'support':
        return { title: 'Customer Support Desk', subtitle: 'Live mirror of Supabase table `support`' };
      case 'broadcast':
        return { title: '1-Click Broadcast & Follow-ups', subtitle: 'Send personalized WhatsApp reminders and publicity campaigns' };
      case 'matcher':
        return { title: 'Smart Load-to-Transporter Matcher', subtitle: 'AI corridor matching engine for instant load allocation' };
      case 'settings':
        return { title: 'Workspace & API Integrations', subtitle: 'WhatsApp Cloud API tokens and Supabase connection settings' };
      default:
        return { title: 'FlowSync CRM', subtitle: 'Smart WhatsApp Logistics Platform' };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <div className="flex h-screen overflow-hidden bg-[#090d16] text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeTenant={activeTenant}
        tenants={tenants}
        onSelectTenant={setActiveTenant}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header
          title={title}
          subtitle={subtitle}
          activeTenant={activeTenant}
          onOpenBroadcastModal={() => handleOpenBroadcastModal(bookings)}
          onRefreshData={loadData}
          isRefreshing={isRefreshing}
        />

        {/* Dynamic Page View */}
        <main className="flex-1 overflow-y-auto p-8">
          {currentTab === 'dashboard' && (
            <DashboardOverview
              bookings={bookings}
              transporters={transporters}
              activeTenant={activeTenant}
              onNavigateTab={setCurrentTab}
              onOpenBroadcast={() => handleOpenBroadcastModal(bookings)}
            />
          )}

          {currentTab === 'inbox' && (
            <LiveInbox
              conversations={conversations}
              onSendMessage={handleSendInboxMessage}
              onToggleBotMode={handleToggleBotMode}
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

          {currentTab === 'sessions' && <SessionsTable sessions={sessions} />}

          {currentTab === 'support' && <SupportTable />}

          {currentTab === 'broadcast' && (
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Broadcast & Campaign Dispatcher</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Launch personalized WhatsApp follow-ups, payment reminders, or urgent load alerts
                  </p>
                </div>
                <button
                  onClick={() => handleOpenBroadcastModal(bookings)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition"
                >
                  + Launch New Campaign
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

          {currentTab === 'settings' && (
            <SettingsPage
              activeTenant={activeTenant}
              onUpdateTenant={handleUpdateTenant}
            />
          )}
        </main>
      </div>

      {/* 1-Click Broadcast & Follow-Up Modal */}
      <BroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        selectedRecipients={broadcastRecipients}
      />
    </div>
  );
}

export default App;
