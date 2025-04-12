import SupabaseService from './SupabaseService';
import { User } from './UserService';

class ContactsService {
  private static instance: ContactsService;
  private supabase = SupabaseService.getClient();

  private constructor() {}

  static getInstance(): ContactsService {
    if (!ContactsService.instance) {
      ContactsService.instance = new ContactsService();
    }
    return ContactsService.instance;
  }

  async getContacts(userId: string): Promise<User[]> {
    try {
      const { data, error } = await this.supabase
        .from('contacts')
        .select(`
          contact:contact_id(
            id,
            name,
            avatar,
            status,
            phone,
            region
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data.map(item => item.contact) || [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  async addContact(userId: string, contactId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('contacts')
        .insert([
          { user_id: userId, contact_id: contactId }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  }

  async removeContact(userId: string, contactId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('contacts')
        .delete()
        .eq('user_id', userId)
        .eq('contact_id', contactId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing contact:', error);
      throw error;
    }
  }

  async searchUsersByPhone(phoneNumber: string): Promise<User[]> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .ilike('phone', `%${phoneNumber}%`)
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
}

export default ContactsService.getInstance();