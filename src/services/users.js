import { supabase } from "./supabase";
const table = "users"


// AUTH
export const register = async (credentials) => {

    // campus_id: 1 - CALOOCAN, 2 - VALENZUELA
    const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
            data: {
                name: credentials.name,
                campus_id: credentials.campus_id,
                program_course: credentials.program_course
            }
        }
    })

    if (error) {
        console.error(error);
        throw error;
    }

    console.log(data)
    return data

}

export const login = async (credentials) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials)

    if (error) {
        console.error(error);
        throw error;
    }

    console.log(data)
    return data
}



// STUDENTS CRUD
export const getAllStudents = async () => {
    const { data, error } = await supabase.from(table).select().eq('role', 'student')
        
    if (error) {
        console.error(error);
        throw error;
    }

    console.log(data)
    return data
}