import supabase from './supabase';

const TABLE = 'CarbonIQ';

export const carbonService = {
  async getActivities(userId, { limit = 50, offset = 0 } = {}) {
    console.log(`[carbonService] Fetching activities for user: ${userId}`);
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('[carbonService] getActivities error:', error.message, error.details, error.hint);
      throw error;
    }
    console.log(`[carbonService] Got ${data?.length ?? 0} activities`);
    return data || [];
  },

  async addActivity({ userId, category, activity, carbonEmission }) {
    console.log('[carbonService] Inserting:', { userId, category, activity, carbonEmission });
    const { data, error } = await supabase
      .from(TABLE)
      .insert([{
        user_id: userId,
        category,
        activity,
        carbon_emission: carbonEmission,
      }])
      .select()
      .single();

    if (error) {
      console.error('[carbonService] addActivity error:', error.message, error.details, error.hint);
      throw error;
    }
    console.log('[carbonService] Insert success:', data);
    return data;
  },

  async deleteActivity(id) {
    console.log('[carbonService] Deleting activity:', id);
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[carbonService] deleteActivity error:', error.message, error.details, error.hint);
      throw error;
    }
    console.log('[carbonService] Delete success');
  },

  async getStats(userId, period = 'month') {
    const now = new Date();
    let startDate;

    if (period === 'week') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (period === 'month') {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    } else if (period === 'year') {
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }

    console.log(`[carbonService] getStats for user: ${userId}, period: ${period}, from: ${startDate?.toISOString()}`);
    const { data, error } = await supabase
      .from(TABLE)
      .select('category, carbon_emission, created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (error) {
      console.error('[carbonService] getStats error:', error.message, error.details, error.hint);
      throw error;
    }

    console.log(`[carbonService] getStats got ${data?.length ?? 0} rows`);

    const stats = {
      totalEmissions: 0,
      categoryStats: {},
      dailyStats: {},
    };

    (data || []).forEach(entry => {
      stats.totalEmissions += entry.carbon_emission;

      if (!stats.categoryStats[entry.category]) {
        stats.categoryStats[entry.category] = 0;
      }
      stats.categoryStats[entry.category] += entry.carbon_emission;

      const day = entry.created_at.split('T')[0];
      if (!stats.dailyStats[day]) {
        stats.dailyStats[day] = { date: day, totalCarbon: 0 };
      }
      stats.dailyStats[day].totalCarbon += entry.carbon_emission;
    });

    return stats;
  },

  async getTotalSaved(userId) {
    console.log('[carbonService] getTotalSaved for user:', userId);
    const { data, error } = await supabase
      .from(TABLE)
      .select('carbon_emission')
      .eq('user_id', userId);

    if (error) {
      console.error('[carbonService] getTotalSaved error:', error.message, error.details, error.hint);
      throw error;
    }
    const total = (data || []).reduce((sum, entry) => sum + entry.carbon_emission, 0);
    console.log('[carbonService] Total saved:', total);
    return total;
  },
};

export default carbonService;
