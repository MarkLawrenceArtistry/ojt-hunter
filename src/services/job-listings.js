import { supabase } from "./supabase";
const table = 'job_listings'

// ADMIN
export const getAllJobListingsAdmin = async () => {
    const { data, error } = await supabase.from(table).select()
    
    if (error) {
        console.error(error);
        throw error;
    }

    console.log(data)
    return data
}

export const createJobListing = async (formData) => {
     const { data, error } = await supabase.from(table).insert(formData).select()
    
    if (error) {
        console.error(error);
        throw error;
    }

    console.log(data)
    return data
}

export const deleteJobListing = async (id) => {
    if(!id) return

    const { data, error } = await supabase.from(table).delete().eq("id", id).select()
    
    if (error) {
        console.error(error);
        throw error;
    }

    console.log(data)
    return data
}