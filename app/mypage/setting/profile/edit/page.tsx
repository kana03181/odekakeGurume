'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm, useFieldArray  } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UpdateProfileRequestBody } from "@/app/api/profile/route";
import { SelectBox } from "@/app/_components/SelectBox";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSettion";
import { profileSchema, type ProfileForm } from "@/app/_libs/schemas/profile.schema";
import { TextInput } from "@/app/_components/TextInput";
import Label from "@/app/_components/Label";
import { Button } from "@/app/_components/Button";

export default function Page() {
  const { token } = useSupabaseSession()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: {
      errors,
      isSubmitting,
    }
  } = useForm<ProfileForm>({
    mode: "onChange",
    defaultValues: {
      name: "",
      username: "",
      children: [{
        birthYear: undefined,
        birthMonth: undefined,
      }],
    },
    resolver: zodResolver(profileSchema),
  });
  const{
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name:"children"
  })

  const profileSubmit = async (data: ProfileForm) => {

    try {
      const { data: authData, error } = await supabase.auth.getSession();
      console.log(authData);

      if (!token) return;

      // const token = authData.session.access_token;
      // const authHeader = `Bearer ${token}`;
      if ( error || !authData.session ) {
        setError("root", {
          message: "ユーザー情報が見つかりませんでした"
        });
        return;
      }

      const body: UpdateProfileRequestBody = {
        name: data.name,
        userName: data.username,
        thumbnailUrl: data.thumbnailUrl,
        gender: data.gender,
        yearOfBirth: Number(data.yearOfBirth),
        children: data.children?.map((item) => ({
          birthYear: Number(item.birthYear),
          birthMonth: Number(item.birthMonth),
        }))
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body)
      })
      console.log(res);


      if (!res.ok) {
        console.error("エラーが発生しました")
        return
      }
      alert("プロフィールを設定しました")
      // router.replace("/mypage/setting")

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("エラーが発生しました");
      }
    }
  }

  useEffect(() => {
    const fetcher = async () => {
      try {
        const { data: authData, error } = await supabase.auth.getSession();
        console.log(authData);

        if (!token) return;

        if (error || !authData.session) {
          setError("root", {
            message: "ユーザー情報が見つかりませんでした"
          });
          return;
        }

        const res = await fetch("/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
        console.log(res);

        if (!res.ok) {
          console.error("エラーが発生しました")
          return;
        }

        const data:UpdateProfileRequestBody = await res.json();

        reset({
          name: data.name,
          username: data.userName,
          thumbnailUrl: data.thumbnailUrl,
          gender: data.gender,
          yearOfBirth: Number(data.yearOfBirth),

          children: data.children?.map((item) => ({
            birthYear: Number(item.birthYear),
            birthMonth: Number(item.birthMonth),
          }))
        })


      } catch (error) {
        console.error("エラーが発生しました")
      }
    }
    fetcher();

  }, [reset, token]);

  return (
    <div className='flex items-center justify-center flex-col pt-60'>
      {errors.root && (
        <p className="text-caution text-md pb-4">
          {errors.root.message}</p>
      )}
      <form onSubmit={handleSubmit(profileSubmit)} className='space-y-8 w-full max-w-100'>
        <div className='space-y-2'>
          <Label htmlFor='name'>
              お名前
          </Label>
          <TextInput
            {...register("name")}
            type='name'
            id='name'
            className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
          />
          {errors.name && (
            <p className="text-caution text-sm">
              {errors.name.message}</p>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='username'>
              ユーザー名 ＊投稿した口コミに表示されます
          </Label>
          <TextInput
            {...register("username")}
            type='username'
            id='username'
            className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
          />
          {errors.username && (
            <p className="text-caution text-sm font-bold">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='gender'>
              性別
          </Label>
          <SelectBox
            {...register("gender")}
            name='gender'
            id='gender'
            options={[
              {value: "MALE", label:"男性"},
              {value: "FEMALE", label:"女性"},
              {value: "NOT_TO_SAY", label:"回答しない"}
            ]}
            className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='year'>
              生まれた年
          </Label>
          <SelectBox
            {...register("yearOfBirth")}
            generator={{
              type: "year",
              reverse: true,
              end: 2011
            }}
            placeholder="--"
            className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='children'>
              子供の年月日
          </Label>
          <div className='flex flex-col gap-4'>
            {fields.map((field, index) => (
              <div className='flex gap-2'>
                <SelectBox
                  {...register(
                    `children.${index}.birthYear`)}
                  generator={{
                    type: "year",
                    reverse: true,
                  }}
                  placeholder="--"
                  className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
                />
                <SelectBox
                  {...register(
                    `children.${index}.birthMonth`)}
                  generator={{
                    type: "month",
                  }}
                  placeholder="--"
                  className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
                />
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className='px-2 py-[calc(5/16*1rem)] text-sm'
                >
                  削除
                </Button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => append({
              birthYear: undefined,
              birthMonth: undefined,
            })}>＋追加する</button>
        </div>
        <div>
          <Button type="submit" disabled={isSubmitting}>保存</Button>
        </div>
      </form>
    </div>
  )
}
