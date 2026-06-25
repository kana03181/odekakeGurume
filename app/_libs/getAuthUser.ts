import { NextRequest } from 'next/server'
import { supabase } from "@/app/_libs/supabase";


export const getAuthUser = async (request: NextRequest) => {
    const token = request.headers.get("authorization") ?? '';
    const accessToken = token.replace("Bearer ", "");
    // console.log(accessToken);

    //誰のtokenかを確認
    const { data:{ user }, error } = await supabase.auth.getUser(accessToken);

  return { user, error };
}
