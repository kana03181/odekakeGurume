"use client";

import { supabase } from '@/app/_libs/supabase'
import { useSupabaseSession } from "@/app/_hook/useSupabaseSettion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/button";
import { useEffect } from 'react';


export default function Page() {
  const router = useRouter();

  const handleLogout = async() => {
    await supabase.auth.signOut();
    await router.replace("/sign_in");
  }

  const {session, isLoading} = useSupabaseSession();


  return (
    <div>
      {!isLoading && session &&(
        <div className='flex items-center justify-center flex-col pt-60 space-y-4'>
          <div className='space-y-4 w-full max-w-100'>
            <h2 className='text-sm font-medium text-(--txt-secondary-color)'>ACCOUNT & PREFERENCES</h2>
            <ul className='space-y-4'>
              <li>
                <Link href="/mypage/profile/edit" className='text-sm font-medium rounded-menu py-5 px-5'>
                  プロフィール編集
                </Link>
              </li>
              <li>
                <Link href="/mypage/account/" className='text-sm font-medium rounded-menu px-5 py-5'>
                  アカウント管理
                </Link>
              </li>
            </ul>
          </div>
          <div className='space-y-4 w-full max-w-100'>
            <h2 className='text-sm font-medium text-(--txt-secondary-color)'>SUPPORT & INFO</h2>
            <ul className='space-y-4'>
              <li>
                <Link href="/terms" className='text-sm font-medium rounded-menu px-5 py-5'>
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy_policy" className='text-sm font-medium rounded-menu px-5 py-5'>
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/mypage/contact" className='text-sm font-medium rounded-menu px-5 py-5'>
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>
          <div className='space-y-4 w-full max-w-100'>
          <Button type="submit" variant="delete" onClick={handleLogout}>ログアウト</Button>
          </div>
        </div>
      )}
    </div>

  )
}
