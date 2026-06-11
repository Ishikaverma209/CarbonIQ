import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
  FiTrendingUp,
  FiTrendingDown,
  FiZap,
  FiInfo,
  FiSave,
  FiTarget,
  FiActivity,
} from 'react-icons/fi';
import carbonService from '../lib/carbonService';

const CATEGORIES = [
  {
    id: 'transport',
    name: 'Transport',
    icon: '🚗',
    description: 'Cars, buses, trains, flights',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    activities: [
      { id: 'car', name: 'Car', unit: 'km', factor: 0.21, icon: '🚙', tip: 'Average car emits 0.21 kg CO₂/km' },
      { id: 'bus', name: 'Bus', unit: 'km', factor: 0.089, icon: '🚌', tip: 'Bus emits 60% less than a car per km' },
      { id: 'train', name: 'Train', unit: 'km', factor: 0.041, icon: '🚆', tip: 'Trains are 5x more efficient than cars' },
      { id: 'flight', name: 'Flight', unit: 'km', factor: 0.255, icon: '✈️', tip: 'Flights have the highest transport emissions' },
      { id: 'bike', name: 'Bicycle', unit: 'km', factor: 0, icon: '🚲', tip: 'Zero emissions - great choice!' },
    ],
  },
  {
    id: 'energy',
    name: 'Energy',
    icon: '⚡',
    description: 'Electricity, gas, heating',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    activities: [
      { id: 'electricity', name: 'Electricity', unit: 'kWh', factor: 0.5, icon: '💡', tip: 'Grid average is 0.5 kg CO₂/kWh' },
      { id: 'naturalGas', name: 'Natural Gas', unit: 'm³', factor: 2.0, icon: '🔥', tip: 'Gas emits 2.0 kg CO₂ per cubic meter' },
      { id: 'heating', name: 'Heating', unit: 'kWh', factor: 0.18, icon: '🌡️', tip: 'Heating is 40% of home energy use' },
    ],
  },
  {
    id: 'food',
    name: 'Food',
    icon: '🍽️',
    description: 'Meat, dairy, vegetables, grains',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    activities: [
      { id: 'meat', name: 'Meat', unit: 'kg', factor: 27.0, icon: '🥩', tip: 'Beef produces 27 kg CO₂ per kg' },
      { id: 'dairy', name: 'Dairy', unit: 'kg', factor: 3.2, icon: '🧀', tip: 'Dairy produces 3.2 kg CO₂ per kg' },
      { id: 'vegetables', name: 'Vegetables', unit: 'kg', factor: 0.4, icon: '🥦', tip: 'Vegetables are low at 0.4 kg CO₂/kg' },
      { id: 'grains', name: 'Grains', unit: 'kg', factor: 0.8, icon: '🌾', tip: 'Grains produce 0.8 kg CO₂ per kg' },
    ],
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    description: 'Clothing, electronics, goods',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    activities: [
      { id: 'clothing', name: 'Clothing', unit: 'item', factor: 10.0, icon: '👕', tip: 'Average clothing item = 10 kg CO₂' },
      { id: 'electronics', name: 'Electronics', unit: 'item', factor: 50.0, icon: '📱', tip: 'Electronics have high embedded carbon' },
    ],
  },
  {
    id: 'waste',
    name: 'Waste',
    icon: '♻️',
    description: 'Landfill, recycling, compost',
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    activities: [
      { id: 'landfill', name: 'Landfill', unit: 'kg', factor: 2.5, icon: '🗑️', tip: 'Landfill produces methane (28x worse)' },
      { id: 'recycled', name: 'Recycled', unit: 'kg', factor: 0.5, icon: '♻️', tip: 'Recycling saves 80% vs landfill' },
    ],
  },
];

const IMPACT_LEVELS = [
  { max: 1, label: 'Minimal', color: '#10B981', icon: '🌱' },
  { max: 5, label: 'Low', color: '#22C55E', icon: '🌿' },
  { max: 15, label: 'Moderate', color: '#F59E0B', icon: '⚡' },
  { max: 50, label: 'High', color: '#F97316', icon: '🔥' },
  { max: Infinity, label: 'Very High', color: '#EF4444', icon: '🌋' },
];

const EQUIVALENTS = [
  { factor: 0.06, unit: 'km driven', icon: '🚗' },
  { factor: 0.27, unit: 'days of phone charging', icon: '📱' },
  { factor: 0.023, unit: 'trees needed to absorb (per day)', icon: '🌳' },
  { factor: 0.001, unit: 'flights from NY to LA', icon: '✈️' },
];

const STEPS = ['Category', 'Activity', 'Details', 'Results'];

const Calculator = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const currentCO2 = selectedActivity && amount
    ? (parseFloat(amount) * selectedActivity.factor).toFixed(2)
    : '0.00';

  const impactLevel = IMPACT_LEVELS.find(l => parseFloat(currentCO2) <= l.max) || IMPACT_LEVELS[4];

  const getEquivalents = (co2) => {
    const val = parseFloat(co2);
    return EQUIVALENTS.map(eq => ({
      ...eq,
      value: (val / eq.factor).toFixed(1),
    }));
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setSelectedActivity(null);
    setAmount('');
    setDescription('');
    setResult(null);
    setStep(1);
  };

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    setAmount('');
    setDescription('');
    setStep(2);
  };

  const handleAnalyze = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    const co2 = (parseFloat(amount) * selectedActivity.factor).toFixed(2);
    setResult({
      co2,
      activity: selectedActivity,
      category: selectedCategory,
      amount: parseFloat(amount),
      equivalents: getEquivalents(co2),
      impact: IMPACT_LEVELS.find(l => parseFloat(co2) <= l.max) || IMPACT_LEVELS[4],
    });
    setStep(3);
  };

  const handleSave = async () => {
    if (!result || !user?.id) return;
    setLoading(true);
    try {
      await carbonService.addActivity({
        userId: user.id,
        category: selectedCategory.id,
        activity: selectedActivity.name,
        carbonEmission: parseFloat(result.co2),
      });
      setMessage({ text: 'Activity logged successfully!', type: 'success' });
      setSaved(true);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ text: 'Failed to save. Please try again.', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setStep(0);
    setSelectedCategory(null);
    setSelectedActivity(null);
    setAmount('');
    setDescription('');
    setResult(null);
    setSaved(false);
  };

  const renderStepIndicator = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '40px',
    }}>
      {STEPS.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: i <= step ? 'var(--accent)' : 'var(--bg-tertiary)',
            border: `1px solid ${i <= step ? 'var(--accent)' : 'var(--border-default)'}`,
            color: i <= step ? 'white' : 'var(--text-muted)',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}>
            {i < step ? <FiCheck size={14} /> : i + 1}
          </div>
          <span style={{
            fontSize: '12px',
            fontWeight: '500',
            color: i <= step ? 'var(--text-primary)' : 'var(--text-muted)',
            display: i < STEPS.length - 1 ? 'none' : 'block',
          }}>
            {s}
          </span>
          {i < STEPS.length - 1 && (
            <div style={{
              width: '40px',
              height: '1px',
              background: i < step ? 'var(--accent)' : 'var(--border-default)',
              transition: 'background 0.3s ease',
            }} />
          )}
        </div>
      ))}
    </div>
  );

  const renderCategoryStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '8px',
        }}>
          What activity are you tracking?
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
          Select a category to get started
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.02, borderColor: cat.color }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCategorySelect(cat)}
            style={{
              padding: '24px 20px',
              borderRadius: '12px',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-secondary)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: `${cat.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}>
              {cat.icon}
            </div>
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '4px',
              }}>
                {cat.name}
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-tertiary)',
                lineHeight: '1.4',
              }}>
                {cat.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  const renderActivityStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setStep(0)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-secondary)',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
        >
          <FiArrowLeft size={16} />
        </button>
        <div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--text-primary)',
          }}>
            {selectedCategory.name}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
            Choose an activity
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
      }}>
        {selectedCategory.activities.map((activity) => (
          <motion.button
            key={activity.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleActivitySelect(activity)}
            style={{
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-secondary)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
            }}>
              {activity.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '2px',
              }}>
                {activity.name}
              </h4>
              <p style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
              }}>
                {activity.factor} kg CO₂/{activity.unit}
              </p>
            </div>
            <FiArrowRight size={14} color="var(--text-muted)" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  const renderDetailsStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <button
          onClick={() => setStep(1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-secondary)',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
        >
          <FiArrowLeft size={16} />
        </button>
        <div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--text-primary)',
          }}>
            Enter Details
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
            {selectedCategory.name} → {selectedActivity.name}
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '24px',
      }}>
        {/* Input form */}
        <div>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--text-secondary)',
                display: 'block',
                marginBottom: '8px',
              }}>
                Amount ({selectedActivity.unit})
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-default)',
                  background: 'var(--bg-tertiary)',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--text-secondary)',
                display: 'block',
                marginBottom: '8px',
              }}>
                Description (optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Commute to work"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-default)',
                  background: 'var(--bg-tertiary)',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
              />
            </div>

            {/* Tip */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '14px 16px',
              borderRadius: '10px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
            }}>
              <FiInfo size={16} color="var(--accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', margin: 0, lineHeight: '1.5' }}>
                {selectedActivity.tip}
              </p>
            </div>
          </div>
        </div>

        {/* Live preview panel */}
        <div>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
            borderRadius: '12px',
            padding: '24px',
            position: 'sticky',
            top: '100px',
          }}>
            <h3 style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '20px',
            }}>
              Live Impact Preview
            </h3>

            {/* CO2 value */}
            <div style={{
              textAlign: 'center',
              marginBottom: '24px',
              padding: '20px',
              borderRadius: '12px',
              background: 'var(--bg-tertiary)',
            }}>
              <motion.div
                key={currentCO2}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontSize: '40px',
                  fontWeight: '700',
                  color: impactLevel.color,
                  lineHeight: 1,
                  marginBottom: '4px',
                }}
              >
                {currentCO2}
              </motion.div>
              <div style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
              }}>
                kg CO₂
              </div>
            </div>

            {/* Impact level */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Impact Level</span>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '500',
                color: impactLevel.color,
              }}>
                {impactLevel.icon} {impactLevel.label}
              </span>
            </div>

            {/* Equivalents */}
            {parseFloat(currentCO2) > 0 && (
              <div style={{ marginTop: '16px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Equivalent to
                </span>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginTop: '12px',
                }}>
                  {result?.equivalents.slice(0, 3).map((eq, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                    }}>
                      <span>{eq.icon}</span>
                      <span>{eq.value} {eq.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA button */}
            <button
              onClick={handleAnalyze}
              disabled={!amount || parseFloat(amount) <= 0}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: 'none',
                background: amount && parseFloat(amount) > 0 ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: amount && parseFloat(amount) > 0 ? 'white' : 'var(--text-muted)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: amount && parseFloat(amount) > 0 ? 'pointer' : 'not-allowed',
                marginTop: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
            >
              <FiZap size={16} />
              Analyze Carbon Impact
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderResultsStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        {/* Header with gradient */}
        <div style={{
          padding: '32px',
          background: `linear-gradient(135deg, ${selectedCategory.color}15 0%, ${selectedCategory.color}05 100%)`,
          borderBottom: '1px solid var(--border-subtle)',
          textAlign: 'center',
        }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: selectedCategory.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              margin: '0 auto 16px',
              boxShadow: `0 8px 24px ${selectedCategory.color}40`,
            }}
          >
            {selectedActivity.icon}
          </motion.div>

          <h2 style={{
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--text-tertiary)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Carbon Impact Analysis
          </h2>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: '56px',
              fontWeight: '700',
              color: result.impact.color,
              lineHeight: 1,
              marginBottom: '8px',
            }}
          >
            {result.co2}
          </motion.div>

          <div style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
          }}>
            kg CO₂ from {result.amount} {result.activity.unit} of {result.activity.name}
          </div>
        </div>

        {/* Impact details */}
        <div style={{ padding: '32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '32px',
          }}>
            <div style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'var(--bg-tertiary)',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '24px',
                marginBottom: '8px',
              }}>
                {result.impact.icon}
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: result.impact.color,
                marginBottom: '4px',
              }}>
                {result.impact.label}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
              }}>
                Impact Level
              </div>
            </div>

            <div style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'var(--bg-tertiary)',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '24px',
                marginBottom: '8px',
              }}>
                🌳
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '4px',
              }}>
                {(parseFloat(result.co2) / 0.023).toFixed(1)}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
              }}>
                Trees needed (per day)
              </div>
            </div>

            <div style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'var(--bg-tertiary)',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '24px',
                marginBottom: '8px',
              }}>
                📊
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '4px',
              }}>
                {((parseFloat(result.co2) / 4000) * 100).toFixed(3)}%
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
              }}>
                Of annual average
              </div>
            </div>
          </div>

          {/* Equivalents */}
          <div style={{
            padding: '20px',
            borderRadius: '12px',
            background: 'var(--bg-tertiary)',
            marginBottom: '24px',
          }}>
            <h4 style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '16px',
            }}>
              Real-World Equivalents
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }}>
              {result.equivalents.map((eq, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                }}>
                  <span style={{ fontSize: '18px' }}>{eq.icon}</span>
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                    }}>
                      {eq.value}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                    }}>
                      {eq.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          <div style={{
            padding: '20px',
            borderRadius: '12px',
            background: 'var(--accent-muted)',
            border: '1px solid rgba(20, 184, 166, 0.15)',
            marginBottom: '24px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px',
            }}>
              <FiZap size={14} color="var(--accent)" />
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                AI Sustainability Insight
              </span>
            </div>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-primary)',
              lineHeight: '1.6',
              margin: 0,
            }}>
              {getAIInsight(result)}
            </p>
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '12px',
          }}>
            {!saved ? (
              <button
                onClick={handleSave}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'var(--accent)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                <FiSave size={16} />
                {loading ? 'Saving...' : 'Log Activity'}
              </button>
            ) : (
              <div style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                textAlign: 'center',
                color: '#10B981',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}>
                <FiCheck size={16} />
                Activity Saved Successfully
              </div>
            )}
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid var(--border-default)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              marginTop: '12px',
              transition: 'all 0.2s',
            }}
          >
            Track Another Activity
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '40px 32px',
      paddingTop: '100px',
      minHeight: '100vh',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '4px',
            letterSpacing: '-0.01em',
          }}>
            Carbon Calculator
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
            Track and understand your environmental impact
          </p>
        </div>

        {/* Message */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                padding: '14px 18px',
                borderRadius: '10px',
                background: message.type === 'success' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                color: message.type === 'success' ? '#10B981' : '#EF4444',
                fontSize: '14px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {message.type === 'success' ? <FiCheck size={16} /> : <FiInfo size={16} />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step indicator */}
        {renderStepIndicator()}

        {/* Steps */}
        <AnimatePresence mode="wait">
          {step === 0 && renderCategoryStep()}
          {step === 1 && renderActivityStep()}
          {step === 2 && renderDetailsStep()}
          {step === 3 && renderResultsStep()}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

function getAIInsight(result) {
  const co2 = parseFloat(result.co2);
  const cat = result.category.id;
  const act = result.activity.id;

  if (cat === 'transport') {
    if (act === 'bike') return 'Excellent choice! Bicycles produce zero emissions and are the most sustainable transport option. Keep pedaling!';
    if (act === 'flight') return `Flights have the highest transport emissions. Consider offsetting ${co2.toFixed(1)} kg CO₂ through verified carbon offset programs. For shorter trips, trains emit 80% less.`;
    if (act === 'car') return `Car travel produces significant emissions. Switching to public transport for this journey would have saved ${(co2 * 0.58).toFixed(1)} kg CO₂. Consider carpooling to split emissions.`;
    return `This ${act} journey produced ${co2.toFixed(1)} kg CO₂. ${co2 > 10 ? 'This is moderate-high impact. Consider alternatives for future trips.' : 'This is a relatively low-impact choice.'}`;
  }

  if (cat === 'food') {
    if (act === 'meat') return `Meat has the highest food carbon footprint. Replacing this with a plant-based meal would have saved ${(co2 * 0.93).toFixed(1)} kg CO₂. Try Meatless Mondays!`;
    if (act === 'vegetables') return 'Great choice! Vegetables have one of the lowest carbon footprints. Plant-based meals are 5-10x more sustainable than meat.';
    return `Your food choice produced ${co2.toFixed(1)} kg CO₂. ${co2 > 5 ? 'Consider reducing portion sizes or choosing lower-impact alternatives.' : 'This is a moderate food footprint choice.'}`;
  }

  if (cat === 'energy') {
    if (co2 > 5) return `This energy use is significant. Switching to LED bulbs, improving insulation, or using a smart thermostat could reduce this by 30-50%.`;
    return `Energy use of ${co2.toFixed(1)} kg CO₂. Consider unplugging devices when not in use and using natural light when possible.`;
  }

  return `This activity produced ${co2.toFixed(1)} kg CO₂. ${co2 > 20 ? 'This is a high-impact activity. Consider ways to reduce or offset this footprint.' : 'Every small action counts towards reducing your overall carbon footprint.'}`;
}

export default Calculator;
