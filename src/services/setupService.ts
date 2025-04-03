
import { supabase } from '@/lib/supabase';
import { fromTable, isDataResponse } from '@/utils/supabaseServiceHelper';

export interface SetupStatus {
  isComplete: boolean;
  businessExists: boolean;
}

export const checkSetupStatus = async (): Promise<SetupStatus> => {
  try {
    console.log('Checking if system setup is complete');
    
    // First, check if the system_setup setting exists
    const settingsResponse = await fromTable('settings')
      .select('*')
      .eq('key', 'system_setup')
      .maybeSingle();
    
    console.log('Settings response:', settingsResponse);
    
    // If the setting exists and is complete, return it
    if (isDataResponse(settingsResponse) && settingsResponse.data) {
      const data = settingsResponse.data;
      console.log('System setup data:', data);

      if (data && 'value' in data && data.value !== null) {
        try {
          // Handle both string and object value formats
          const valueObject = typeof data.value === 'string' 
            ? JSON.parse(data.value) 
            : data.value;
          
          if (
            valueObject && 
            typeof valueObject === 'object' && 
            'completed' in valueObject && 
            valueObject.completed === true
          ) {
            console.log('Setup is complete according to settings');
            return { 
              isComplete: true, 
              businessExists: true 
            };
          }
        } catch (parseError) {
          console.error('Error parsing setup value:', parseError);
        }
      }
    }
    
    // If the setting doesn't exist, check if any businesses exist
    console.log('Checking if any businesses exist');
    
    const businessResponse = await fromTable('businesses')
      .select('id, name')
      .limit(1);
    
    console.log('Business response:', businessResponse);
    
    const businessExists = isDataResponse(businessResponse) && 
                        Array.isArray(businessResponse.data) && 
                        businessResponse.data.length > 0;
    
    console.log('Business exists:', businessExists);
    
    // If businesses exist but no setting, save the setup status
    if (businessExists) {
      try {
        await saveSetupStatus(true);
        console.log('Setup status saved since businesses exist');
      } catch (error) {
        console.error('Failed to save setup status:', error);
      }
    }
    
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
    console.log('Saving setup status:', completed);
    
    // Make sure the value is properly formatted as an object for jsonb column
    const setupValue = {
      completed,
      completed_at: new Date().toISOString()
    };
    
    // Use upsert with the correct structure
    const response = await fromTable('settings')
      .upsert({
        key: 'system_setup',
        value: setupValue,
        description: 'System setup status'
      });
    
    if (!isDataResponse(response)) {
      console.error('Error saving setup status:', response.error);
      throw new Error(`Failed to save setup status: ${response.error?.message || 'Unknown error'}`);
    }
    
    console.log('Setup status saved successfully');
  } catch (error) {
    console.error('Error saving setup status:', error);
    throw error;
  }
};
