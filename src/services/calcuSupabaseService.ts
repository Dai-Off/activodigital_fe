
import { calcuSupabaseClient } from '../lib/calcuSupabaseClient';
import type { FinancialProjectState } from './mockFinancialData';

export interface CalcuSnapshot {
    id: string;
    created_at: string;
    name: string;
    project_state: FinancialProjectState;
}

const TABLE_NAME = 'calcu_snapshots';

export const calcuSupabaseService = {

    /**
     * Saves a new calculation session (snapshot).
     * Limit: The user requirement mentions "10 historiales". 
     * We can enforcing this by deleting oldest if count > 10, or just fetch last 10.
     * The requirement: "Usuario puede Guardar... con 10 historiales...".
     * Interpretation: Save this current one. If there are too many, maybe clean up?
     * Let's just save. The "Get" will limit to 10.
     */
    calcuSaveSession: async (name: string, state: FinancialProjectState): Promise<{ success: boolean; error?: string }> => {
        try {
            // First, optional: check count and delete oldest if > 9 to keep exactly 10? 
            // Or just allow many and only show 10. 
            // Usually "10 historiales" implies a rotating buffer. 
            // Let's implement a quick cleanup: fetch count, if >= 10, delete oldest.

            // 1. Check count (simplified)
            // Ideally this is a specific user's data, but currently no Auth context passed to this service.
            // We assume anonymous or public for now as per current codebase state (no visible auth hook usage in calculator).

            const { count, error: countError } = await calcuSupabaseClient
                .from(TABLE_NAME)
                .select('*', { count: 'exact', head: true });

            if (!countError && count !== null && count >= 10) {
                // Delete oldest
                const { data: oldest } = await calcuSupabaseClient
                    .from(TABLE_NAME)
                    .select('id')
                    .order('created_at', { ascending: true })
                    .limit(count - 9); // delete enough to make room

                if (oldest && oldest.length > 0) {
                    await calcuSupabaseClient
                        .from(TABLE_NAME)
                        .delete()
                        .in('id', oldest.map(o => o.id));
                }
            }

            // 2. Insert new
            const { error } = await calcuSupabaseClient
                .from(TABLE_NAME)
                .insert([
                    {
                        name,
                        project_state: state
                    }
                ]);

            if (error) throw error;
            return { success: true };
        } catch (err: any) {
            console.error('Error saving session:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Retrieves the last 10 sessions.
     */
    calcuGetSessions: async (): Promise<{ data: CalcuSnapshot[], error?: string }> => {
        const { data, error } = await calcuSupabaseClient
            .from(TABLE_NAME)
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error fetching sessions:', error);
            return { data: [], error: error.message };
        }
        return { data: data as CalcuSnapshot[] };
    },

    /**
     * Deletes a specific session.
     */
    calcuDeleteSession: async (id: string): Promise<boolean> => {
        const { error } = await calcuSupabaseClient
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting session:', error);
            return false;
        }
        return true;
    }
};
