import { supabase } from "./supabase";



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
        return;
    }

    console.log(data)
    return data

}