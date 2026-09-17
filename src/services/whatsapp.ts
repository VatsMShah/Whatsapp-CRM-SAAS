import { BroadcastTemplate, BroadcastType } from '../types';

export const DEFAULT_TEMPLATES: BroadcastTemplate[] = [
  {
    id: 'tpl_followup_1',
    name: 'Booking Follow-Up & Availability Check',
    type: 'follow_up',
    text: 'Hi {{name}} 🙏, following up from Traket Transport regarding your requirement for {{vehicle}} on route {{from}} ➔ {{to}}. Are you still looking to dispatch on {{date}}? Reply *Yes* to get our lowest guaranteed quote!',
    variables: ['name', 'vehicle', 'from', 'to', 'date'],
  },
  {
    id: 'tpl_reminder_1',
    name: 'Dispatch & Loading Reminder',
    type: 'reminder',
    text: 'Important Reminder ⏰: Hi {{name}}, your vehicle assignment for loading {{material}} on {{date}} is confirmed. Please ensure the loading supervisor is available at {{from}}.',
    variables: ['name', 'material', 'date', 'from'],
  },
  {
    id: 'tpl_transporter_urgent_load',
    name: 'Urgent Load Available (For Transporters)',
    type: 'publicity',
    text: '🚛 *URGENT LOAD AVAILABLE* 🚛\nRoute: *{{from}} ➔ {{to}}*\nVehicle Needed: *{{vehicle}}*\nCargo: *{{material}}*\nLoading Date: *{{date}}*\n\nReply with your best rate per ton to lock this load immediately! ⚡',
    variables: ['from', 'to', 'vehicle', 'material', 'date'],
  },
  {
    id: 'tpl_promotional_discount',
    name: 'Festive / Special Route Discount Offer',
    type: 'publicity',
    text: '🎉 *Special Transport Freight Rates from Traket!* 🎉\nGet exclusive 10% cash discount on all full truck loads from *{{from}} to {{to}}* this week. Reply *Quote* to calculate your savings.',
    variables: ['from', 'to'],
  },
];

export interface SendBroadcastResult {
  total: number;
  successful: number;
  failed: number;
  recipients: Array<{
    phone: string;
    name: string;
    personalizedText: string;
    status: 'delivered' | 'failed';
  }>;
}

export async function sendBulkBroadcast(
  recipients: Array<{ phone: string; name: string; [key: string]: any }>,
  templateText: string,
  _type: BroadcastType
): Promise<SendBroadcastResult> {
  const results: SendBroadcastResult['recipients'] = [];

  for (const r of recipients) {
    let text = templateText;
    text = text.replace(/{{name}}/g, r.name || r.contactName || 'Customer');
    text = text.replace(/{{from}}/g, r.loadingCity || r.loadingPin || 'Mumbai');
    text = text.replace(/{{to}}/g, r.unloadingCity || r.unloadingPin || 'Delhi');
    text = text.replace(/{{vehicle}}/g, r.vehicleType || 'Truck');
    text = text.replace(/{{date}}/g, r.loadingDate || 'this week');
    text = text.replace(/{{material}}/g, r.material || 'Goods');

    results.push({
      phone: r.phone || r.driverPhone || '',
      name: r.name || r.contactName || r.driverName || 'Recipient',
      personalizedText: text,
      status: 'delivered',
    });
  }

  // Artificial realistic network dispatch delay
  await new Promise((res) => setTimeout(res, 800));

  return {
    total: recipients.length,
    successful: recipients.length,
    failed: 0,
    recipients: results,
  };
}
