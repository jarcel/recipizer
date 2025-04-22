import { AuthError, AuthResponse, Provider, User } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';

export interface Profile {
  id: string;
  name: string | null;
  account_type: string;
  recipe_count: number;
}

export class AuthService {
  /**
   * Register a new user with email and password
   */
  static async register(email: string, password: string, name: string): Promise<AuthResponse> {
    // Register the user with Supabase auth
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });

    if (response.error) {
      throw response.error;
    }

    // If registration is successful, create a profile for the user
    if (response.data.user) {
      await this.createProfile(response.data.user.id, name);
    }

    return response;
  }

  /**
   * Create a user profile in the profiles table
   */
  private static async createProfile(userId: string, name: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        name,
        account_type: 'free',
        recipe_count: 0,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  /**
   * Log in with email and password
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  }

  /**
   * Log in with a third-party provider (Google, GitHub, etc.)
   */
  static async loginWithProvider(provider: Provider): Promise<void> {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  }

  /**
   * Sign out the current user
   */
  static async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }

  /**
   * Get the currently logged-in user
   */
  static async getCurrentUser(): Promise<User | null> {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  /**
   * Get the current user's profile
   */
  static async getCurrentUserProfile(): Promise<Profile | null> {
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data as Profile;
  }

  /**
   * Update the current user's profile
   */
  static async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) {
      throw new Error('No authenticated user');
    }

    // Update user metadata if name is included
    if (profile.name) {
      const { error } = await supabase.auth.updateUser({
        data: { name: profile.name }
      });

      if (error) {
        throw error;
      }
    }

    // Update profile in the database
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Profile;
  }

  /**
   * Send a password reset email
   */
  static async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password/update`
    });

    if (error) {
      throw error;
    }
  }

  /**
   * Update user's password (after reset or from profile)
   */
  static async updatePassword(password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      throw error;
    }
  }

  /**
   * Update user's email
   */
  static async updateEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      email
    });

    if (error) {
      throw error;
    }
  }

  /**
   * Upgrade account to premium
   */
  static async upgradeToPremium(): Promise<Profile> {
    return await this.updateProfile({ account_type: 'premium' });
  }

  /**
   * Increment the recipe count for the user
   */
  static async incrementRecipeCount(): Promise<void> {
    const profile = await this.getCurrentUserProfile();

    if (!profile) {
      throw new Error('No profile found');
    }

    await this.updateProfile({
      recipe_count: profile.recipe_count + 1
    });
  }

  /**
   * Decrement the recipe count for the user
   */
  static async decrementRecipeCount(): Promise<void> {
    const profile = await this.getCurrentUserProfile();

    if (!profile) {
      throw new Error('No profile found');
    }

    if (profile.recipe_count > 0) {
      await this.updateProfile({
        recipe_count: profile.recipe_count - 1
      });
    }
  }
}

export default AuthService;