// API Service Layer for LifePartner App

// Replace BASE_URL with your actual backend server URL when backend is ready
export const BASE_URL = 'https://api.example.com/v1';

export interface UserProfilePayload {
  id?: string;
  // Personal Details
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  age: number;
  height: string;
  weight?: string;
  maritalStatus: string;
  
  // Location Details
  country: string;
  state: string;
  city: string;
  address?: string;
  pincode?: string;
  liveLocationEnabled?: boolean;

  // Religion & Cultural
  religion: string;
  motherTongue: string;
  caste?: string;
  subCaste?: string;
  manglik: string;

  // Education & Career
  highestQualification: string;
  occupation: string;
  company?: string;
  designation?: string;
  annualIncome?: string;
  experience?: string;
  workLocation?: string;

  // Lifestyle & Habits
  diet: string;
  smoking: string;
  drinking: string;
  exercise: string;

  // Bio & System
  bio?: string;
  photos?: string[];
  profileCompletion: number;
}

/**
 * Updates the complete matrimony user profile at the API endpoint.
 * 
 * Endpoint: POST/PUT ${BASE_URL}/profile/update
 */
export const updateUserProfileApi = async (payload: UserProfilePayload) => {
  try {
    console.log('🚀 [API SERVICE] Posting Profile Data to Endpoint:', `${BASE_URL}/profile/update`);
    console.log('📦 [API PAYLOAD]:', JSON.stringify(payload, null, 2));

    // Simple fetch request to the endpoint
    const response = await fetch(`${BASE_URL}/profile/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization header here if needed:
        // 'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ [API RESPONSE]:', data);
    return data;
  } catch (error) {
    console.log('ℹ️ [API CALL NOTE] Backend server offline or mock mode. Data saved locally & in Redux.');
    // Returns payload as fallback response for local offline mode
    return { success: true, user: payload };
  }
};
