
import { supabase } from '@/lib/supabase';
import { fromTable, isDataResponse } from '@/utils/supabaseServiceHelper';

export interface SetupStatus {
  isComplete: boolean;
  businessExists: boolean;
}

export const checkSetupStatus = async (): Promise<SetupStatus> => {
  try {
    // First, check if the system_setup setting exists
    const settingsResponse = await fromTable('settings')
      .select('*')
      .eq('key', 'system_setup')
      .maybeSingle();
    
    // If the setting exists and is complete, return it
    if (isDataResponse(settingsResponse) && settingsResponse.data) {
      const dataValue = settingsResponse.data;
      
      // Safely access nested value property with proper null/undefined checks
      if (dataValue && 
          typeof dataValue === 'object' && 
          'value' in dataValue && 
          dataValue.value !== null && 
          typeof dataValue.value === 'object') {
        
        // Type assertion to help TypeScript understand the structure
        const valueObject = dataValue.value as Record<string, unknown>;
        
        // Check if completed exists in the value object
        const setupCompleted = valueObject.completed === true;
        
        return { 
          isComplete: setupCompleted, 
          businessExists: true 
        };
      }
    }
    
    // If the setting doesn't exist, check if any businesses exist
    const businessResponse = await fromTable('businesses')
      .select('id')
      .limit(1);
      
    const businessExists = isDataResponse(businessResponse) && 
                          Array.isArray(businessResponse.data) && 
                          businessResponse.data.length > 0;
    
    return {
      isComplete: businessExists, // If business exists but no setting, assume setup is complete
      businessExists
    };
  } catch (error) {
    console.error('Error checking setup status:', error);
    // Default to incomplete if there's an error
    return { isComplete: false, businessExists: false };
  }
};

export const saveSetupStatus = async (completed: boolean): Promise<void> => {
  try {
    await fromTable('settings')
      .upsert({
        key: 'system_setup',
        value: { completed, completed_at: new Date().toISOString() },
        description: 'System setup status'
      });
  } catch (error) {
    console.error('Error saving setup status:', error);
    throw error;
  }
};
