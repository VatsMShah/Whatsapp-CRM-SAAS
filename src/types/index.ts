export interface BookingLead {
  user_id: string;
  state: string;
  updated_at: string;
  loadingPin: string;
  unloadingPin: string;
  cargoType: string;
  vehicleType: string;
  vehicleSubType: string;
  material: string;
  loadingDate: string;
  company: string;
  contactName: string;
  phone: string;
  email: string;
  website?: string;
  status?: 'new' | 'quoted' | 'assigned' | 'in_transit' | 'completed' | 'cancelled';
  estimatedDistanceKm?: number;
  loadingCity?: string;
  unloadingCity?: string;
  leadScore?: 'HOT' | 'WARM' | 'COLD';
}

export interface Transporter {
  user_id: string;
  state: string;
  updated_at: string;
  vehicleType: string;
  vehicleNumber: string;
  driverName: string;
  capacity: string;
  routePreference: string;
  availability?: string;
  driverPhone: string;
  currentLocation?: string;
  notes?: string;
  documents?: string;
  verified?: boolean;
}

export interface SessionRecord {
  user_id: string;
  phone: string;
  state: string;
  updated_at: string;
  flow_type: string;
  data: Record<string, any>;
}

export interface SupportTicket {
  user_id: string;
  phone?: string;
  contactName?: string;
  subject?: string;
  message?: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority?: 'high' | 'medium' | 'low';
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface ConversationThread {
  phone: string;
  userName: string;
  company?: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  mode: 'bot' | 'human';
  state: string;
  flowType: string;
  messages: ChatMessage[];
}

export interface ClientCompanyProfile {
  name: string;
  phoneNumber: string;
  phoneNumberId: string;
  whatsappStatus: 'connected' | 'disconnected';
  supabaseUrl: string;
}

export type BroadcastType = 'follow_up' | 'reminder' | 'publicity' | 'custom';

export interface BroadcastTemplate {
  id: string;
  name: string;
  type: BroadcastType;
  title?: string;
  text: string;
  variables: string[];
}
