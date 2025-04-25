import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Pricing.scss';

type PlanType = 'monthly' | 'annual';

const Pricing: React.FC = () => {
  const [planType, setPlanType] = useState<PlanType>('annual');
  const [loading, setLoading] = useState(false);
  const { user, profile, isAuthenticated, isPremium, upgradeToPremium } = useAuth();
  const navigate = useNavigate();
  
  // Mock function for handling subscription - in a real app, this would integrate with a payment provider
  const handleSubscribe = async (plan: string) => {
    if (!isAuthenticated) {
      // Redirect to login with a return URL
      navigate('/login', { state: { from: { pathname: '/pricing' } } });
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real app, this would handle payment processing
      console.log(`Processing ${plan} subscription...`);
      
      // For now, just upgrade the user's account type
      await upgradeToPremium();
      
      // Show success message or redirect
      navigate('/dashboard');
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1 className="pricing-title">Choose Your Plan</h1>
        <p className="pricing-subtitle">
          Unlock premium features and save unlimited recipes
        </p>
        
        <div className="pricing-toggle">
          <span 
            className={planType === 'monthly' ? 'active' : ''}
            onClick={() => setPlanType('monthly')}
          >
            Monthly
          </span>
          <label className="switch">
            <input
              type="checkbox"
              checked={planType === 'annual'}
              onChange={() => setPlanType(planType === 'monthly' ? 'annual' : 'monthly')}
            />
            <span className="slider"></span>
          </label>
          <span 
            className={planType === 'annual' ? 'active' : ''}
            onClick={() => setPlanType('annual')}
          >
            Annual
          </span>
          <div className="discount-badge">Save 20%</div>
        </div>
      </div>
      
      <div className="pricing-plans">
        <div className="pricing-plan free">
          <div className="plan-header">
            <h2 className="plan-name">Free</h2>
            <div className="plan-price">
              <span className="amount">$0</span>
              <span className="period">forever</span>
            </div>
          </div>
          
          <div className="plan-features">
            <ul>
              <li>
                <span className="material-icons">check_circle</span>
                Save up to 25 recipes
              </li>
              <li>
                <span className="material-icons">check_circle</span>
                Basic recipe organization
              </li>
              <li>
                <span className="material-icons">check_circle</span>
                Web scraping from any recipe site
              </li>
              <li>
                <span className="material-icons">check_circle</span>
                Access on web
              </li>
              <li className="unavailable">
                <span className="material-icons">cancel</span>
                Unlimited recipes
              </li>
              <li className="unavailable">
                <span className="material-icons">cancel</span>
                Advanced categorization
              </li>
              <li className="unavailable">
                <span className="material-icons">cancel</span>
                Recipe scaling
              </li>
              <li className="unavailable">
                <span className="material-icons">cancel</span>
                Shopping list generation
              </li>
            </ul>
          </div>
          
          {isAuthenticated && !isPremium ? (
            <div className="plan-action">
              <button className="current-plan">Current Plan</button>
            </div>
          ) : !isAuthenticated ? (
            <div className="plan-action">
              <Link to="/register" className="plan-button secondary">
                Create Account
              </Link>
            </div>
          ) : null}
        </div>
        
        <div className="pricing-plan premium">
          <div className="plan-badge">Popular</div>
          
          <div className="plan-header">
            <h2 className="plan-name">Premium</h2>
            <div className="plan-price">
              <span className="amount">
                ${planType === 'monthly' ? '7.99' : '6.39'}
              </span>
              <span className="period">
                {planType === 'monthly' ? '/month' : '/month, billed annually'}
              </span>
            </div>
          </div>
          
          <div className="plan-features">
            <ul>
              <li>
                <span className="material-icons">check_circle</span>
                <strong>Unlimited</strong> recipes
              </li>
              <li>
                <span className="material-icons">check_circle</span>
                Advanced recipe organization
              </li>
              <li>
                <span className="material-icons">check_circle</span>
                Web scraping from any recipe site
              </li>
              <li>
                <span className="material-icons">check_circle</span>
                Access on web
              </li>
              <li>
                <span className="material-icons">check_circle</span>
                Advanced categorization and tags
              </li>
              <li>
                <span className="material-icons">check_circle</span>
                Recipe scaling
              </li>
              <li>
                <span className="material-icons">check_circle</span>
                Shopping list generation
              </li>
              <li>
                <span className="material-icons">check_circle</span>
                Priority customer support
              </li>
            </ul>
          </div>
          
          <div className="plan-action">
            {isAuthenticated && isPremium ? (
              <button className="current-plan">Current Plan</button>
            ) : (
              <button
                className="plan-button"
                onClick={() => handleSubscribe(planType)}
                disabled={loading}
              >
                {loading ? (
                  <span className="button-spinner"></span>
                ) : (
                  `Get Premium ${planType === 'annual' ? 'Yearly' : 'Monthly'}`
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Family plan removed */}
      </div>
      
      <div className="pricing-faq">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        
        <div className="faq-questions">
          <div className="faq-item">
            <h3>Can I change plans later?</h3>
            <p>
              Yes, you can upgrade, downgrade, or cancel your subscription at any time.
              If you downgrade from Premium to Free, you'll still have access to all your
              recipes, but you won't be able to add new ones beyond the 25 recipe limit.
            </p>
          </div>
          
          <div className="faq-item">
            <h3>What happens to my recipes if I cancel Premium?</h3>
            <p>
              All your recipes will remain in your account, but you won't be able to add
              new ones beyond the Free plan limit of 25 recipes. You can still view, edit,
              and delete existing recipes.
            </p>
          </div>
          
          {/* Family plan FAQ removed */}
          
          <div className="faq-item">
            <h3>Is there a mobile app?</h3>
            <p>
              We're currently working on mobile apps for iOS and Android. They will be available
              soon, and all your recipes will automatically sync between web and mobile.
            </p>
          </div>
        </div>
      </div>
      
      <div className="pricing-cta">
        <h2>Ready to save unlimited recipes?</h2>
        <p>
          Join thousands of home cooks who organize their recipes with Recipizer.
        </p>
        
        {!isAuthenticated ? (
          <div className="cta-buttons">
            <Link to="/register" className="cta-button primary">
              Get Started
            </Link>
            <Link to="/login" className="cta-button secondary">
              Log In
            </Link>
          </div>
        ) : !isPremium ? (
          <div className="cta-buttons">
            <button 
              className="cta-button primary"
              onClick={() => handleSubscribe(planType)}
              disabled={loading}
            >
              {loading ? (
                <span className="button-spinner"></span>
              ) : (
                'Upgrade Now'
              )}
            </button>
          </div>
        ) : (
          <div className="cta-message">
            <span className="material-icons">star</span>
            <p>You're already enjoying Premium benefits!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;