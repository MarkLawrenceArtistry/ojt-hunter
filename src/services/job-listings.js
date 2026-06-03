import { supabase } from "./supabase";

// ADMIN
export const getAllJobListingsAdmin = async () => {
    const { data, error } = await supabase.from('job_listings').select()
    
    if (error) {
        console.error(error);
        throw error;
    }

    console.log(data)
    return data
} 