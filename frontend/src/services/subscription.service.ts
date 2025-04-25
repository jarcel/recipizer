// frontend/src/services/subscription.service.ts
import { supabase } from '../supabase/client';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_annual: number;
  features: string[];
}

export type BillingCycle = 'monthly' | 'annual';

export interface SubscriptionDetails {
  plan_id: string;
  status: 'active' | 'canceled' | 'expired';
  current_period_start: string;
  current_period_end: string;
  billing_cycle: BillingCycle;
  cancel_at_period_end: boolean;
}

export class SubscriptionService {
  /**
   * Get all available subscription plans
   */
  static async getPlans(): Promise<SubscriptionPlan[]> {
    // In a real implementation, this would fetch from Supabase or your payment provider
    // For now, we'll return mock data
    return [
      {
        id: 'free',
        name: 'Free',
        description: 'Basic features for personal use',
        price_monthly: 0,
        price_annual: 0,
        features: [
          'Save up to 25 recipes',
          'Basic recipe organization',
          'Web scraping from any recipe site',
          'Access on web'
        ]
      },
      {
        id: 'premium',
        name: 'Premium',
        description: 'Advanced features for the serious home cook',
        price_monthly: 7.99,
        price_annual: 76.70, // $6.39/month billed annually
        features: [
          'Unlimited recipes',
          'Advanced recipe organization',
          'Web scraping from any recipe site',
          'Access on web',
          'Advanced categorization and tags',
          'Recipe scaling',
          'Shopping list generation',
          'Priority customer support'
        ]
      },
      // Family plan removed
    ];
  }

  /**
   * Get user's current subscription details
   */
  static async getUserSubscription(userId: string): Promise<SubscriptionDetails | null> {
    // In a real implementation, this would fetch from Supabase or your payment provider API
    // For now, we'll fetch from the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    // Mock subscription details based on account type
    if (data.account_type === 'premium') {
      return {
        plan_id: 'premium',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        billing_cycle: 'monthly',
        cancel_at_period_end: false
      };
    }

    // For free users, return null (no subscription)
    return null;
  }

  /**
   * Create a new subscription
   * In a real implementation, this would integrate with a payment provider like Stripe
   */
  static async createSubscription(
    userId: string,
    planId: string,
    billingCycle: BillingCycle
  ): Promise<boolean> {
    try {
      // Update the user's account type in the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          account_type: planId,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error creating subscription:', error);
      return false;
    }
  }

  /**
   * Cancel a subscription
   */
  static async cancelSubscription(userId: string): Promise<boolean> {
    try {
      // In a real implementation, this would call your payment provider's API
      // For now, we'll just downgrade the user to a free account
      const { error } = await supabase
        .from('profiles')
        .update({
          account_type: 'free',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return false;
    }
  }

  /**
   * Change a subscription plan
   */
  static async changePlan(
    userId: string,
    newPlanId: string,
    billingCycle?: BillingCycle
  ): Promise<boolean> {
    try {
      // In a real implementation, this would call your payment provider's API
      // For now, we'll just update the user's account type
      const { error } = await supabase
        .from('profiles')
        .update({
          account_type: newPlanId,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error changing subscription plan:', error);
      return false;
    }
  }

  /**
   * Check if a user has exceeded their recipe limit
   */
  static async hasExceededRecipeLimit(userId: string): Promise<boolean> {
    try {
      // Get the user's profile to check their account type
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('account_type, recipe_count')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        throw profileError || new Error('Profile not found');
      }

      // If they're a premium user, they have no limit
      if (profile.account_type === 'premium') {
        return false;
      }

      // Free users are limited to 25 recipes
      return (profile.recipe_count || 0) >= 25;
    } catch (error) {
      console.error('Error checking recipe limit:', error);
      return true; // Default to true to prevent adding more recipes if there's an error
    }
  }
}

export default SubscriptionService;