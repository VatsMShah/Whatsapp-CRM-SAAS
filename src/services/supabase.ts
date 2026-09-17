import { createClient } from '@supabase/supabase-js';
import { BookingLead, Transporter, SessionRecord, SupportTicket, ConversationThread, WorkspaceTenant, ChatMessage } from '../types';
import { resolvePinCode, estimateDistanceKm, calculateLeadScore } from '../utils/pinResolver';

// Default Supabase config (fallback to active environment)
const DEFAULT_SUPABASE_URL = '';
const DEFAULT_SUPABASE_KEY = '';

// Available Workspaces (Multi-Tenant)
export const INITIAL_TENANTS: WorkspaceTenant[] = [
  {
    id: 'tenant-traket',
    name: 'Traket Transport',
    slug: 'traket',
    phoneNumber: '+91 99309 95959',
    phoneNumberId: '1240163099173755',
    whatsappStatus: 'connected',
    supabaseUrl: DEFAULT_SUPABASE_URL,
    createdAt: '2026-09-01',
  },
  {
    id: 'tenant-fastmove',
    name: 'FastMove Freight & Logistics',
    slug: 'fastmove',
    phoneNumber: '+91 98200 12345',
    phoneNumberId: '1030974210092739',
    whatsappStatus: 'connected',
    supabaseUrl: DEFAULT_SUPABASE_URL,
    createdAt: '2026-09-10',
  },
  {
    id: 'tenant-apex',
    name: 'Apex ODC & Trailer Lines',
    slug: 'apex',
    phoneNumber: '+91 97654 88899',
    phoneNumberId: '1099887766554433',
    whatsappStatus: 'disconnected',
    supabaseUrl: DEFAULT_SUPABASE_URL,
    createdAt: '2026-09-15',
  }
];

// Rich initial sample dataset for immediate visual excellence and testing
const SAMPLE_BOOKINGS: BookingLead[] = [
  {
    user_id: 'book_101',
    state: 'cta_menu',
    updated_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    loadingPin: '400001',
    unloadingPin: '110001',
    cargoType: 'Domestic',
    vehicleType: 'Truck',
    vehicleSubType: '22 Ft Open',
    material: 'Industrial Precision Machinery & Motors',
    loadingDate: '25/09/2026',
    company: 'Reliance Logistics Allied',
    contactName: 'Rahul Verma',
    phone: '+91 98205 00159',
    email: 'rahul.verma@reliancelogistics.com',
    status: 'new',
    leadScore: 'HOT',
  },
  {
    user_id: 'book_102',
    state: 'cta_menu',
    updated_at: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    loadingPin: '380001',
    unloadingPin: '560001',
    cargoType: 'Export',
    vehicleType: 'Container',
    vehicleSubType: '32 Ft MXL Close Body',
    material: 'Pharmaceutical Formulations & Active APIs',
    loadingDate: '28/09/2026',
    company: 'Zydus Lifesciences Ltd',
    contactName: 'Anil Desai',
    phone: '+91 99789 44321',
    email: 'anil.desai@zyduslife.com',
    status: 'quoted',
    leadScore: 'HOT',
  },
  {
    user_id: 'book_103',
    state: 'cta_menu',
    updated_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    loadingPin: '411001',
    unloadingPin: '400001',
    cargoType: 'Domestic',
    vehicleType: 'Tempo',
    vehicleSubType: '14 Ft',
    material: 'Automotive Spare Parts & Fasteners',
    loadingDate: '22/09/2026',
    company: 'Bharat Forge Component Div',
    contactName: 'Priya Kulkarni',
    phone: '+91 94220 88712',
    email: 'priya.kulkarni@bharatforge.com',
    status: 'assigned',
    leadScore: 'WARM',
  },
  {
    user_id: 'book_104',
    state: 'cta_menu',
    updated_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    loadingPin: '600001',
    unloadingPin: '500001',
    cargoType: 'Domestic',
    vehicleType: 'Trailer / ODC',
    vehicleSubType: 'Trailer',
    material: 'Wind Turbine Heavy Hub Components',
    loadingDate: '02/10/2026',
    company: 'Vestas Wind Technology India',
    contactName: 'Senthil Nathan',
    phone: '+91 98401 23456',
    email: 'senthil@vestasindia.com',
    status: 'in_transit',
    leadScore: 'HOT',
  },
  {
    user_id: 'book_105',
    state: 'material',
    updated_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    loadingPin: '395001',
    unloadingPin: '302001',
    cargoType: 'Domestic',
    vehicleType: 'Tempo',
    vehicleSubType: '9 Ft',
    material: 'Cotton Fabrics & Garment Rolls',
    loadingDate: '30/09/2026',
    company: 'Surat Textile Export Hub',
    contactName: 'Mahesh Singhal',
    phone: '+91 98251 77654',
    email: 'mahesh@suratfabrics.in',
    status: 'completed',
    leadScore: 'WARM',
  }
];

const SAMPLE_TRANSPORTERS: Transporter[] = [
  {
    user_id: 'trans_201',
    state: 'cta_menu',
    updated_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    vehicleType: 'Truck',
    vehicleNumber: 'MH 04 GP 8842',
    driverName: 'Gurpreet Singh',
    capacity: '16 Tons',
    routePreference: 'Mumbai - Ahmedabad - Delhi - Jaipur',
    availability: 'Available Immediately (Bhiwandi Hub)',
    driverPhone: '+91 98190 22345',
    notes: '22 Ft Open Body Truck with GPS and Tarpaulin',
    verified: true,
  },
  {
    user_id: 'trans_202',
    state: 'cta_menu',
    updated_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    vehicleType: 'Container',
    vehicleNumber: 'GJ 01 CX 4590',
    driverName: 'Kishore Patel',
    capacity: '24 Tons',
    routePreference: 'Ahmedabad - Mumbai - Bengaluru - Chennai',
    availability: 'Available in 24 Hours',
    driverPhone: '+91 97234 11223',
    notes: '32 Ft MXL High-Cube Container for Pharma & FMCG',
    verified: true,
  },
  {
    user_id: 'trans_203',
    state: 'cta_menu',
    updated_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    vehicleType: 'Tempo',
    vehicleNumber: 'MH 12 QW 9901',
    driverName: 'Sanjay Shinde',
    capacity: '4.5 Tons',
    routePreference: 'Pune - Mumbai - Nashik - Aurangabad',
    availability: 'Available Today',
    driverPhone: '+91 98811 55667',
    notes: '14 Ft Closed Tempo with hydraulic tailgate',
    verified: true,
  },
  {
    user_id: 'trans_204',
    state: 'cta_menu',
    updated_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    vehicleType: 'Trailer / ODC',
    vehicleNumber: 'TN 02 BB 7711',
    driverName: 'Ramanathan K.',
    capacity: '40 Tons',
    routePreference: 'Chennai - Hyderabad - Nagpur - Delhi',
    availability: 'On Trip (Available from 26th Sep)',
    driverPhone: '+91 94440 99887',
    notes: '40 Ft Low-Bed Multi-Axle Heavy Trailer',
    verified: true,
  }
];

const SAMPLE_SESSIONS: SessionRecord[] = [
  {
    user_id: 'sess_901',
    phone: '+91 98205 00159',
    state: 'cta_menu',
    updated_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    flow_type: 'book',
    data: { loadingPin: '400001', unloadingPin: '110001', vehicleType: 'Truck', material: 'Machinery' }
  },
  {
    user_id: 'sess_902',
    phone: '+91 98190 22345',
    state: 'cta_menu',
    updated_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    flow_type: 'provider',
    data: { provider_vehicleType: 'Truck', provider_capacity: '16 Tons', provider_routes: 'Mumbai-Delhi' }
  },
  {
    user_id: 'sess_903',
    phone: '+91 99789 44321',
    state: 'main_menu',
    updated_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    flow_type: '',
    data: {}
  }
];

const SAMPLE_CONVERSATIONS: ConversationThread[] = [
  {
    phone: '+91 98205 00159',
    userName: 'Rahul Verma',
    company: 'Reliance Logistics',
    lastMessage: '✅ Booking Request Submitted Successfully! Route: 400001 ➔ 110001',
    lastTimestamp: '10 mins ago',
    unreadCount: 0,
    mode: 'bot',
    state: 'cta_menu',
    flowType: 'book',
    messages: [
      { id: 'm1', sender: 'user', text: 'Hi', timestamp: '10:15 AM', status: 'read' },
      { id: 'm2', sender: 'bot', text: '🙏 *Welcome to Traket Transport* 🚛\n\n👉 Please select your requirement:\n1️⃣ Book a Vehicle\n2️⃣ Provide Vehicle\n3️⃣ Support', timestamp: '10:15 AM', status: 'read' },
      { id: 'm3', sender: 'user', text: '1', timestamp: '10:16 AM', status: 'read' },
      { id: 'm4', sender: 'bot', text: '📍 Enter *Loading Pincode* (6 digits):', timestamp: '10:16 AM', status: 'read' },
      { id: 'm5', sender: 'user', text: '400001', timestamp: '10:17 AM', status: 'read' },
      { id: 'm6', sender: 'bot', text: '📍 Enter *Unloading Pincode* (6 digits):', timestamp: '10:17 AM', status: 'read' },
      { id: 'm7', sender: 'user', text: '110001', timestamp: '10:18 AM', status: 'read' },
      { id: 'm8', sender: 'bot', text: '✅ *Booking Request Submitted Successfully!*\n📍 Route: 400001 ➔ 110001\n🚛 Vehicle: Truck (22 Ft Open)', timestamp: '10:20 AM', status: 'delivered' }
    ]
  },
  {
    phone: '+91 98190 22345',
    userName: 'Gurpreet Singh (Transporter)',
    company: 'Singh Roadlines Mumbai',
    lastMessage: '✅ Vehicle Registered Successfully! 🚛 Vehicle: Truck (MH 04 GP 8842)',
    lastTimestamp: '42 mins ago',
    unreadCount: 1,
    mode: 'human',
    state: 'cta_menu',
    flowType: 'provider',
    messages: [
      { id: 'm20', sender: 'user', text: 'Hello, I have 22ft truck in Bhiwandi', timestamp: '09:40 AM', status: 'read' },
      { id: 'm21', sender: 'bot', text: '🙏 Welcome to Traket! Select: 1️⃣ Book 2️⃣ Provide Vehicle', timestamp: '09:40 AM', status: 'read' },
      { id: 'm22', sender: 'user', text: '2', timestamp: '09:41 AM', status: 'read' },
      { id: 'm23', sender: 'agent', text: 'Hi Gurpreet ji, we have loads for Delhi ready to dispatch. What is your best freight rate?', timestamp: '09:45 AM', status: 'delivered' }
    ]
  },
  {
    phone: '+91 99789 44321',
    userName: 'Anil Desai',
    company: 'Zydus Lifesciences',
    lastMessage: '📦 Select Cargo Type: 1 Domestic 2 Import 3 Export',
    lastTimestamp: '1 hour ago',
    unreadCount: 0,
    mode: 'bot',
    state: 'cargo_type',
    flowType: 'book',
    messages: [
      { id: 'm30', sender: 'user', text: 'Hi', timestamp: '09:00 AM', status: 'read' },
      { id: 'm31', sender: 'bot', text: '🙏 Welcome to Traket Transport', timestamp: '09:00 AM', status: 'read' }
    ]
  }
];

class SupabaseDataService {
  private client: any = null;
  private bookings: BookingLead[] = [...SAMPLE_BOOKINGS];
  private transporters: Transporter[] = [...SAMPLE_TRANSPORTERS];
  private sessions: SessionRecord[] = [...SAMPLE_SESSIONS];
  private conversations: ConversationThread[] = [...SAMPLE_CONVERSATIONS];

  constructor() {
    this.initClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY);
  }

  public initClient(url: string, key: string) {
    if (url && key) {
      try {
        this.client = createClient(url, key);
      } catch (e) {
        console.warn('Could not initialize Supabase client:', e);
      }
    }
  }

  // --- BOOKINGS API ---
  async getBookings(): Promise<BookingLead[]> {
    if (this.client) {
      try {
        const { data, error } = await this.client.from('book_vehicle').select('*').order('updated_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => this.enhanceBooking(d));
        }
      } catch (err) {
        console.warn('Supabase fetch bookings failed, returning state data:', err);
      }
    }
    return this.bookings.map((b) => this.enhanceBooking(b));
  }

  private enhanceBooking(b: any): BookingLead {
    const loadingInfo = resolvePinCode(b.loadingPin || b.loading_pin);
    const unloadingInfo = resolvePinCode(b.unloadingPin || b.unloading_pin);
    const distance = estimateDistanceKm(b.loadingPin || b.loading_pin, b.unloadingPin || b.unloading_pin);
    const score = calculateLeadScore(b.material, b.loadingDate || b.loading_date, b.cargoType || b.cargo_type);

    return {
      user_id: b.user_id,
      state: b.state || 'cta_menu',
      updated_at: b.updated_at || new Date().toISOString(),
      loadingPin: b.loadingPin || b.loading_pin || '',
      unloadingPin: b.unloadingPin || b.unloading_pin || '',
      cargoType: b.cargoType || b.cargo_type || '',
      vehicleType: b.vehicleType || b.vehicle_type || '',
      vehicleSubType: b.vehicleSubType || b.vehicle_sub_type || '',
      material: b.material || '',
      loadingDate: b.loadingDate || b.loading_date || '',
      company: b.company || '',
      contactName: b.contactName || b.contact_name || '',
      phone: b.phone || '',
      email: b.email || '',
      status: b.status || 'new',
      loadingCity: loadingInfo.city,
      unloadingCity: unloadingInfo.city,
      estimatedDistanceKm: distance,
      leadScore: score,
    };
  }

  async updateBookingStatus(userId: string, newStatus: BookingLead['status']): Promise<void> {
    const idx = this.bookings.findIndex((b) => b.user_id === userId);
    if (idx !== -1) {
      this.bookings[idx].status = newStatus;
    }
    if (this.client) {
      try {
        await this.client.from('book_vehicle').update({ status: newStatus }).eq('user_id', userId);
      } catch (e) {
        console.warn('DB update status fallback');
      }
    }
  }

  // --- TRANSPORTERS API ---
  async getTransporters(): Promise<Transporter[]> {
    if (this.client) {
      try {
        const { data, error } = await this.client.from('provide_vehicle').select('*').order('updated_at', { ascending: false });
        if (!error && data && data.length > 0) {
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
            notes: d.notes || '',
            verified: true,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch transporters failed:', err);
      }
    }
    return this.transporters;
  }

  // --- SESSIONS API ---
  async getSessions(): Promise<SessionRecord[]> {
    if (this.client) {
      try {
        const { data, error } = await this.client.from('users_master').select('*').order('updated_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            user_id: d.user_id,
            phone: d.phone,
            state: d.state,
            updated_at: d.updated_at,
            flow_type: d.flow_type || '',
            data: typeof d.data === 'string' ? JSON.parse(d.data || '{}') : d.data || {},
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch sessions failed:', err);
      }
    }
    return this.sessions;
  }

  // --- CONVERSATIONS & INBOX API ---
  async getConversations(): Promise<ConversationThread[]> {
    return this.conversations;
  }

  async sendAgentMessage(phone: string, text: string): Promise<ChatMessage> {
    const thread = this.conversations.find((c) => c.phone === phone);
    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      sender: 'agent',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    if (thread) {
      thread.messages.push(newMsg);
      thread.lastMessage = text;
      thread.lastTimestamp = 'Just now';
      thread.mode = 'human';
    }

    return newMsg;
  }

  async toggleBotMode(phone: string, mode: 'bot' | 'human'): Promise<void> {
    const thread = this.conversations.find((c) => c.phone === phone);
    if (thread) {
      thread.mode = mode;
    }
  }
}

export const dbService = new SupabaseDataService();
