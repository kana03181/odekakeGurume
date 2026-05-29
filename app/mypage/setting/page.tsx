"use client";

import { supabase } from '@/app/_libs/supabase'
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/Button";
import { MenuItem } from "@/app/_components/MenuItem";


export default function Page() {
  const router = useRouter();

  const handleLogout = async() => {
    await supabase.auth.signOut();
    await router.replace("/sign_in");
  }

  const {session, isLoading} = useSupabaseSession();


  return (
    <div>
      {!isLoading && (
        <div className='flex items-center justify-center flex-col pt-60 space-y-4'>
          {/* ログイン時のみ表示 */}
          {session && (
            <div className='space-y-4 w-full max-w-100'>
              <h2 className='text-sm font-medium text-(--txt-secondary-color)'>ACCOUNT & PREFERENCES</h2>
              <ul className='space-y-4'>
                <li>
                  <MenuItem href='/mypage/setting/profile/edit'>プロフィール編集</MenuItem>
                </li>
                <li>
                  <MenuItem href='/mypage/setting/account'>アカウント管理</MenuItem>
                </li>
              </ul>
            </div>
          )}

          {/* 常時表示 */}
          <div className='space-y-4 w-full max-w-100'>
            <h2 className='text-sm font-medium text-(--txt-secondary-color)'>SUPPORT & INFO</h2>
            <ul className='space-y-4'>
              <li>
                <MenuItem href='/terms'>利用規約</MenuItem>
              </li>
              <li>
                <MenuItem href='/privacy_policy'>プライバシーポリシー</MenuItem>
              </li>
              <li>
                <MenuItem href='/mypage/setting/contact'>お問い合わせ</MenuItem>
              </li>
            </ul>
          </div>

          {/* ログイン時のみ表示 */}
          {session && (
            <div className='space-y-4 w-full max-w-100'>
            <Button type="submit" variant="delete" onClick={handleLogout}>ログアウト</Button>
            </div>
          )}
        </div>
      )}
    </div>

  )
}
