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
    delete formData.id
    
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

export const getJobListing = async (id) => {
    if(!id) {
        console.log(`ID is required`)
        return
    }

    const { data, error } = await supabase.from(table).select().eq("id", id).limit(1).single()
    
    if (error) {
        console.error(error);
        throw error;
    }

    console.log(data)
    return data
}

export const updateJobListing = async (formData) => {
    if(!formData) {
        console.error(`[ERROR] Form data is required`)
        return
    }

    // removes the column that are empty
    for(let key in formData) {
        if(!formData[key]) {
            delete formData[key]
        }
    }

    console.log(formData)

    const { data, error } = await supabase.from(table).update(formData).eq('id', formData.id).select()
    
    if (error) {
        console.error(error);
        throw error;
    }

    console.log(data)
    return data
}