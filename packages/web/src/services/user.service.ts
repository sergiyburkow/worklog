import { api } from '../lib/api';
import { User } from '../types/user';

interface UpdateProfileData {
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  callSign?: string;
  currentPassword?: string;
  newPassword?: string;
}

class UserService {
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.patch<User>('/users/profile', data);
    return response.data;
  }
}

export const userService = new UserService(); 