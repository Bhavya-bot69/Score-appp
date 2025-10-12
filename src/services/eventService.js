import { supabase } from '../supabaseClient';

export const eventService = {
  // Events
  async getEvent(eventId) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getAllEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createEvent(eventData) {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateEvent(eventId, eventData) {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', eventId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteEvent(eventId) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
  },

  // Judges
  async getJudgesByEvent(eventId) {
    const { data, error } = await supabase
      .from('judges')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getJudgeByToken(token) {
    const { data, error } = await supabase
      .from('judges')
      .select('*')
      .eq('token', token)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createJudge(judgeData) {
    const { data, error } = await supabase
      .from('judges')
      .insert([judgeData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateJudge(judgeId, judgeData) {
    const { data, error } = await supabase
      .from('judges')
      .update(judgeData)
      .eq('id', judgeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteJudge(judgeId) {
    const { error } = await supabase
      .from('judges')
      .delete()
      .eq('id', judgeId);

    if (error) throw error;
  },

  // Teams
  async getTeamsByEvent(eventId) {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createTeam(teamData) {
    const { data, error } = await supabase
      .from('teams')
      .insert([teamData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTeam(teamId, teamData) {
    const { data, error } = await supabase
      .from('teams')
      .update(teamData)
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTeam(teamId) {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);

    if (error) throw error;
  },

  // Criteria
  async getCriteriaByEvent(eventId) {
    const { data, error } = await supabase
      .from('criteria')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createCriterion(criterionData) {
    const { data, error } = await supabase
      .from('criteria')
      .insert([criterionData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCriterion(criterionId, criterionData) {
    const { data, error } = await supabase
      .from('criteria')
      .update(criterionData)
      .eq('id', criterionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCriterion(criterionId) {
    const { error } = await supabase
      .from('criteria')
      .delete()
      .eq('id', criterionId);

    if (error) throw error;
  },

  // Judge Team Assignments
  async getJudgeAssignments(judgeId) {
    const { data, error } = await supabase
      .from('judge_team_assignments')
      .select('team_id')
      .eq('judge_id', judgeId);

    if (error) throw error;
    return (data || []).map(a => a.team_id);
  },

  async setJudgeAssignments(judgeId, teamIds) {
    await supabase
      .from('judge_team_assignments')
      .delete()
      .eq('judge_id', judgeId);

    if (teamIds && teamIds.length > 0) {
      const assignments = teamIds.map(teamId => ({
        judge_id: judgeId,
        team_id: teamId
      }));

      const { error } = await supabase
        .from('judge_team_assignments')
        .insert(assignments);

      if (error) throw error;
    }
  },

  // Scores
  async getScoresByJudge(judgeId) {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('judge_id', judgeId);

    if (error) throw error;
    return data || [];
  },

  async getScoresByTeam(teamId) {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('team_id', teamId);

    if (error) throw error;
    return data || [];
  },

  async getScoresByEvent(eventId) {
    const { data, error } = await supabase
      .from('scores')
      .select(`
        *,
        judge:judges(*),
        team:teams(*)
      `)
      .eq('team.event_id', eventId);

    if (error) throw error;
    return data || [];
  },

  async upsertScore(scoreData) {
    const { data, error } = await supabase
      .from('scores')
      .upsert([scoreData], {
        onConflict: 'judge_id,team_id,criterion_key,round'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createScore(scoreData) {
    const { data, error } = await supabase
      .from('scores')
      .insert([scoreData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTeamsWithAssignments(eventId, judgeId) {
    const assignedTeamIds = await this.getJudgeAssignments(judgeId);
    const teams = await this.getTeamsByEvent(eventId);

    return teams.map(team => ({
      ...team,
      isAssigned: assignedTeamIds.includes(team.id)
    }));
  }
};
