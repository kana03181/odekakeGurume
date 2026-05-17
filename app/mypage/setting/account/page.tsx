"use client";

import { supabase } from '@/app/_libs/supabase'
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSettion";
import { MenuItem } from "@/app/_components/MenuItem";


export default function Page() {

  const {session, isLoading} = useSupabaseSession();


  return (
    <div>
      {!isLoading && (
        <div className='flex items-center justify-center flex-col pt-60 space-y-4'>
          {/* ログイン時のみ表示 */}
          {session && (
            <div>
              <div className='space-y-4 w-full max-w-100 mb-10'>
                <ul className='space-y-4'>
                  <li>
                    <MenuItem href='/mypage/setting/account/email/edit' className='rounded-[calc(48/16*1rem)]'>
                      メールアドレスの変更
                    </MenuItem>
                  </li>
                  <li>
                    <MenuItem href='/mypage/setting/account/password/edit' className='rounded-[calc(48/16*1rem)]'>
                      パスワードの変更
                    </MenuItem>
                  </li>
                </ul>
              </div>
              <div className='space-y-4 w-full max-w-100'>
                <div>
                  <MenuItem href="/mypage/setting/account/delete" className='bg-[#BA1A1A]/5 hover:bg-[#BA1A1A]/10 hover:border-[#BA1A1A] text-[#BA1A1A] border-2 border-[#BA1A1A]/10 rounded-[calc(48/16*1rem)]'>
                    アカウントの削除
                  </MenuItem>
                </div>
                  <p className='mypage-text-caution text-xs font-medium'>アカウントを削除すると、保存したお店や口コミが全て削除されます。ご注意ください。</p>
              </div>
            </div>
          )}

        </div>
      )}
    </div>

  )
}
