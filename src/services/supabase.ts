import { createClient } from '@supabase/supabase-js';
import {
  BookingLead,
  Transporter,
  SessionRecord,
  SupportTicket,
  ConversationThread,
  ChatMessage,
  ClientCompanyProfile,
} from '../types';
import { resolvePinCode, estimateDistanceKm, calculateLeadScore } from '../utils/pinResolver';

export const SUPABASE_URL = '';
export const SUPABASE_KEY = '';

export const WHATSAPP_CONFIG = {
  phoneNumberId: '1240163099173755',
  displayPhoneNumber: '+91 99309 95959',
  token: 'EAAM8c7oE44kBO8fM1YwNl1wM5J9z0c2x1q7r4s3t5u8v0w1x2y3z4a5b6c7d8e9f0',
};

export const ACTIVE_CLIENT_PROFILE: ClientCompanyProfile = {
  name: 'Traket Transport',
  phoneNumber: '+91 99309 95959',
  phoneNumberId: '1240163099173755',
  whatsappStatus: 'connected',
  supabaseUrl: SUPABASE_URL,
};

class SupabaseDataService {
  private client: any;

  constructor() {
    this.client = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  // --- REAL BOOKINGS API (FROM book_vehicle TABLE) ---
  async getBookings(): Promise<BookingLead[]> {
    try {
      const { data, error } = await this.client
        .from('book_vehicle')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error || !data) {
        return [];
      }

      return data.map((d: any) => this.enhanceBooking(d));
    } catch (err) {
      console.error('Error fetching bookings from Supabase:', err);
      return [];
    }
  }

  private enhanceBooking(b: any): BookingLead {
    const loadingPin = b.loadingPin || b.loading_pin || '';
    const unloadingPin = b.unloadingPin || b.unloading_pin || '';
    const loadingInfo = resolvePinCode(loadingPin);
    const unloadingInfo = resolvePinCode(unloadingPin);
    const distance = estimateDistanceKm(loadingPin, unloadingPin);
    const score = calculateLeadScore(
      b.material || '',
      b.loadingDate || b.loading_date || '',
      b.cargoType || b.cargo_type || ''
    );

    return {
      user_id: b.user_id,
      state: b.state || 'cta_menu',
      updated_at: b.updated_at || new Date().toISOString(),
      loadingPin,
      unloadingPin,
      cargoType: b.cargoType || b.cargo_type || '',
      vehicleType: b.vehicleType || b.vehicle_type || '',
      vehicleSubType: b.vehicleSubType || b.vehicle_sub_type || '',
      material: b.material || '',
      loadingDate: b.loadingDate || b.loading_date || '',
      company: b.company || '',
      contactName: b.contactName || b.contact_name || '',
      phone: b.phone || '',
      email: b.email || '',
      website: b.website || '',
      status: b.status || 'new',
      loadingCity: loadingInfo.city,
      unloadingCity: unloadingInfo.city,
      estimatedDistanceKm: distance,
      leadScore: score,
    };
  }

  async updateBookingStatus(userId: string, newStatus: BookingLead['status']): Promise<boolean> {
    try {
      const { error } = await this.client
        .from('book_vehicle')
        .update({ status: newStatus })
        .eq('user_id', userId);

      return !error;
    } catch (e) {
      console.error('Failed to update booking status:', e);
      return false;
    }
  }

  // --- REAL TRANSPORTERS API (FROM provide_vehicle TABLE) ---
  async getTransporters(): Promise<Transporter[]> {
    try {
      const { data, error } = await this.client
        .from('provide_vehicle')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error || !data) {
        return [];
      }

      return data.map((d: any) => ({
        user_id: d.user_id,
        state: d.state || 'cta_menu',
        updated_at: d.updated_at || new Date().toISOString(),
        vehicleType: d.vehicle_type || d.vehicleType || '',
        vehicleNumber: d.vehicle_number || d.vehicleNumber || '',
        driverName: d.driver_name || d.driverName || '',
        capacity: d.capacity || '',
        routePreference: d.route_preference || d.routePreference || '',
        driverPhone: d.driver_phone || d.driverPhone || '',
        availability: d.availability || 'Available',
        currentLocation: d.current_location || '',
        notes: d.notes || '',
        documents: d.documents || '',
        verified: true,
      }));
    } catch (err) {
      console.error('Error fetching transporters from Supabase:', err);
      return [];
    }
  }

  // --- REAL SESSIONS API (FROM users_master TABLE) ---
  async getSessions(): Promise<SessionRecord[]> {
    try {
      const { data, error } = await this.client
        .from('users_master')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error || !data) {
        return [];
      }

      return data.map((d: any) => ({
        user_id: d.user_id,
        phone: d.phone || '',
        state: d.state || '',
        updated_at: d.updated_at || new Date().toISOString(),
        flow_type: d.flow_type || '',
        data: typeof d.data === 'string' ? JSON.parse(d.data || '{}') : d.data || {},
      }));
    } catch (err) {
      console.error('Error fetching sessions from Supabase:', err);
      return [];
    }
  }

  // --- REAL SUPPORT TICKETS (FROM support TABLE) ---
  async getSupportTickets(): Promise<SupportTicket[]> {
    try {
      const { data, error } = await this.client
        .from('support')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error || !data) {
        return [];
      }

      return data.map((d: any) => ({
        user_id: d.user_id,
        phone: d.phone || '',
        contactName: d.contact_name || d.contactName || '',
        subject: d.subject || d.query || 'Customer Inquiry',
        message: d.message || d.query || '',
        status: d.status || 'open',
        priority: d.priority || 'medium',
        updated_at: d.updated_at || new Date().toISOString(),
      }));
    } catch (err) {
      console.error('Error fetching support tickets from Supabase:', err);
      return [];
    }
  }

  // --- SYNTHESIZE LIVE CONVERSATIONS FROM REAL USERS_MASTER SESSIONS ---
  async getConversations(): Promise<ConversationThread[]> {
    try {
      const sessions = await this.getSessions();
      if (!sessions || sessions.length === 0) {
        return [];
      }

      // Group sessions by phone number
      const phoneMap = new Map<string, SessionRecord>();
      for (const session of sessions) {
        const cleanPhone = (session.phone || '').replace(/\D/g, '');
        if (!cleanPhone) continue;
        if (!phoneMap.has(cleanPhone)) {
          phoneMap.set(cleanPhone, session);
        }
      }

      const threads: ConversationThread[] = [];

      for (const [phone, session] of phoneMap.entries()) {
        const data = session.data || {};
        const userName = data.contactName || data.name || data.contact_name || `WhatsApp User (${phone.slice(-4)})`;
        const company = data.company || '';
        const flowType = session.flow_type || (data.cargoType ? 'book' : 'general');
        
        let lastMsg = 'WhatsApp Session Started';
        if (session.state === 'cta_menu') {
          lastMsg = flowType === 'book' ? '✅ Booking request submitted' : '✅ Transporter registered';
        } else if (session.state) {
          lastMsg = `Step: ${session.state.replace(/_/g, ' ')}`;
        }

        const formattedPhone = phone.startsWith('91') ? `+91 ${phone.slice(2, 7)} ${phone.slice(7)}` : `+${phone}`;

        // Create reconstructed message thread for this live session
        const messages: ChatMessage[] = [
          {
            id: `msg_${session.user_id}_1`,
            sender: 'user',
            text: 'Hi, I would like to connect with Traket Transport.',
            timestamp: new Date(session.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read',
          },
          {
            id: `msg_${session.user_id}_2`,
            sender: 'bot',
            text: `🙏 Welcome to Traket Transport!\n\nFlow: ${flowType.toUpperCase()}\nCurrent Status: ${session.state}`,
            timestamp: new Date(session.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'delivered',
          },
        ];

        if (data.loadingPin || data.unloadingPin) {
          messages.push({
            id: `msg_${session.user_id}_3`,
            sender: 'bot',
            text: `📍 Route: ${data.loadingPin || 'N/A'} ➔ ${data.unloadingPin || 'N/A'}\n🚛 Vehicle: ${data.vehicleType || 'Any'}\n📦 Cargo: ${data.material || 'General'}`,
            timestamp: new Date(session.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'delivered',
          });
        }

        threads.push({
          phone: formattedPhone,
          userName,
          company,
          lastMessage: lastMsg,
          lastTimestamp: new Date(session.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unreadCount: 0,
          mode: 'bot',
          state: session.state,
          flowType,
          messages,
        });
      }

      return threads;
    } catch (err) {
      console.error('Error constructing conversations:', err);
      return [];
    }
  }

  // --- SEND AGENT MESSAGE VIA WHATSAPP CLOUD API ---
  async sendAgentMessage(recipientPhone: string, text: string): Promise<boolean> {
    try {
      const cleanPhone = recipientPhone.replace(/\D/g, '');
      const url = `https://graph.facebook.com/v20.0/${WHATSAPP_CONFIG.phoneNumberId}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanPhone,
        type: 'text',
        text: { body: text },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_CONFIG.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const resJson = await response.json();
      console.log('WhatsApp Agent message response:', resJson);
      return response.ok;
    } catch (err) {
      console.error('Failed to send agent WhatsApp message:', err);
      return false;
    }
  }
}

export const dbService = new SupabaseDataService();
