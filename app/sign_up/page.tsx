'use client'

import { supabase } from '@/app/_libs/supabase'
import { useState } from 'react'
import { TextInput } from "@/app/_components/TextInput";
import  Label from "@/app/_components/Label";

export default function Page() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userName, setUserName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsSubmitting(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        data: {
          user_name: userName,
        },
      },
    })
    if (error) {
      alert("登録に失敗しました")
    } else {
      setEmail("")
      setPassword("")
      setUserName("")
      alert("確認メールを送信しました")
    }

    setIsSubmitting(false)
  }

  return (
    <div className='flex justify-center pt-60'>
      <form onSubmit={handleSubmit} className='space-y-4 w-full max-w-100'>
        <div>
          <Label htmlFor='email'
            className='block mb-2 text-sm font-medium text-[#544437]'>
              メールアドレス
          </Label>
          <TextInput
            type='email'
            name='email'
            id='email'
            placeholder="メールアドレスを入力"
            className='bg-[#F8F7F5] text-[#544437] placeholder-[#B4A89F] block w-full p-2.5'
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor='password'
            className='block mb-2 text-sm font-medium text-[#544437]'>
              パスワード（半角英数字6文字以上）
          </label>
          <TextInput
            type='password'
            name='password'
            id='password'
            className='bg-[#F8F7F5] text-[#544437] placeholder-[#B4A89F] block w-full p-2.5'
            placeholder='パスワードを入力'
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor='username'
            className='block mb-2 text-sm font-medium text-[#544437]'>
              ユーザー名（4文字以上）
          </label>
          <TextInput
            type='text'
            name='username'
            id='username'
            className='bg-[#F8F7F5] text-[#544437] placeholder-[#B4A89F] block w-full p-2.5'
            placeholder='ユーザー名を入力'
            required
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <button
            type='submit'
            className='w-full text-white bg-[#FF9F43] hover:bg-[#FBB97B] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[calc(48/16*1rem)] text-[calc(18/16*1rem)] leading-normal px-5 py-[calc(16/16*1rem)] text-center'
            disabled={isSubmitting}
          >
            登録
          </button>
        </div>
      </form>
    </div>
  )
}
