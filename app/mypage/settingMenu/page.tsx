"use client";

import { supabase } from '@/app/_libs/supabase'
import { useSupabaseSession } from "@/app/_hook/useSupabaseSettion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleLogout = async() =>{
    await supabase.auth.signOut();
    await router.replace("/");
  }

  const {session, isLoading} = useSupabaseSession();




  return (
    <div>
      {!isLoading && (
        session ?(
          <div className='flex items-center justify-center flex-col pt-60 space-y-4'>
            <div className='space-y-4 w-full max-w-100'>
              <h2 className='text-sm font-medium text-[#8F4E00]'>ACCOUNT & PREFERENCES</h2>
              <ul className='space-y-4'>
                <li>
                  <Link href="/mypage/profile/edit" className='text-sm font-medium text-[#1D1B19] bg-[#ffffff] py-5 px-5'>
                    プロフィール編集
                  </Link>
                </li>
                <li>
                  <Link href="/mypage/account/" className='text-sm font-medium text-[#1D1B19] bg-[#ffffff] px-5 py-5'>
                    アカウント管理
                  </Link>
                </li>
              </ul>
            </div>
            <div className='space-y-4 w-full max-w-100'>
              <h2 className='text-sm font-medium text-[#8F4E00]'>SUPPORT & INFO</h2>
              <ul className='space-y-4'>
                <li>
                  <Link href="/terms" className='text-sm font-medium text-[#1D1B19] bg-[#ffffff] px-5 py-5'>
                    利用規約
                  </Link>
                </li>
                <li>
                  <Link href="/privacy_policy" className='text-sm font-medium text-[#1D1B19] bg-[#ffffff] px-5 py-5'>
                    プライバシーポリシー
                  </Link>
                </li>
                <li>
                  <Link href="/mypage/contact" className='text-sm font-medium text-[#1D1B19] bg-[#ffffff] px-5 py-5'>
                    お問い合わせ
                  </Link>
                </li>
              </ul>
            </div>
            <div className='space-y-4 w-full max-w-100'>
              <button
                onClick={handleLogout}
                className= "w-full text-[#BA1A1A] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[calc(48/16*1rem)] text-[calc(18/16*1rem)] leading-normal px-5 py-[calc(16/16*1rem)] text-center bg-[rgba(186,26,26,0.1)] border-2 border-[rgba(186,26,26,0.1)]"
              >
                ログアウト
              </button>
            </div>
          </div>
        ) : (
          <p>ログインか新規登録をしてください</p>
        )
      )}
    </div>

  )
}
