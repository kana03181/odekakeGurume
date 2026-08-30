'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm, useFieldArray  } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect} from "react";
import { UpdateProfileRequestBody } from "@/app/api/profile/route";
import { GetProfileResponse } from "@/app/api/profile/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useFetch } from "@/app/_hooks/useFetch";
import { uploadImage } from "@/app/_libs/uploadImage";
import { useStorageImageUrls } from "@/app/_utils/getStorageImageUrls";
import { profileSchema, type ProfileForm } from "@/app/_libs/schemas/profile.schema";
import { TextInput } from "@/app/_components/TextInput";
import { ImageInput } from "@/app/_components/ImageInput";
import Label from "@/app/_components/Label";
import { Button } from "@/app/_components/Button";
import { BaseSelect } from "@/app/_components/BaseSelect";
import { BirthYearSelect } from "@/app/_components/BirthYearSelect";
import { BirthMonthSelect } from "@/app/_components/BirthMonthSelect";
import { createNumberOptions } from "@/app/_libs/selectOptions";
import Image from "next/image";


export default function Page() {
  const { token, isLoading: isSessionLoading } = useSupabaseSession()
  // const router = useRouter()

  //RFHの設定
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
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
      thumbnailUrl:"",
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


  // 画像URL取得
  const profileThumbnailKey = watch("thumbnailUrl");

  const profileThumbnailUrl = useStorageImageUrls({
    bucket: "profile_thumbnail",
    imageKeys: profileThumbnailKey ? [profileThumbnailKey] : [],
  });


  // 画像アップロード
  const handleImageChange = async (
    event:ChangeEvent<HTMLInputElement>
  ):Promise<void> => {
    if (!event.target.files?.length) {
      return
    }

    try {
      const file = event.target.files[0];

      const imagePath = await uploadImage({
        file,
        bucket:"profile_thumbnail"
      })

    // RHFに値をセット
    setValue("thumbnailUrl", imagePath, {
      shouldDirty: true,
      shouldValidate: true,
    })

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("エラーが発生しました");
      }
    }
  }


  //データの送信
  const profileSubmit = async (data: ProfileForm) => {

    try {
      const { data: authData, error } = await supabase.auth.getSession();
      // console.log(authData);

      if (!token) return;

      if ( error || !authData.session ) {
        setError("root", {
          message: "ユーザー情報が見つかりませんでした"
        });
        return;
      }

      const body: UpdateProfileRequestBody = {
        name: data.name,
        userName: data.username,
        thumbnailUrl: data.thumbnailUrl ?? null,
        gender: data.gender ?? null,
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
      // console.log(res);

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

  //プロフィールを取得
  const { data, error, isLoading:isUserLoading } = useFetch<GetProfileResponse>("/api/profile")

  useEffect(() => {
    if (!error) return;

    setError("root", {
      message:
        error instanceof Error
          ? error.message
          : "プロフィール取得に失敗しました"
    })

  }, [error, setError])

  useEffect(() => {

    if (!data) return;

    reset({
      name: data.name ?? undefined,
      username: data.userName ?? undefined,
      thumbnailUrl: data.thumbnailUrl ?? undefined,
      gender: data.gender ?? undefined,
      yearOfBirth: data.yearOfBirth ?? undefined,

      children:
        data.children?.length
          ? data.children.map((item) => ({
            birthYear:
              item.birthYear
                ? item.birthYear
                : null,
            birthMonth:
              item.birthMonth
                ? item.birthMonth
                : null,
          }))
          : [{
            birthYear: "",
            birthMonth: "",
          }]
    })
  }, [data, reset])

  if ( isSessionLoading || isUserLoading || !data) {
    return <div className='grid place-content-center'><p className='text-sm'>読み込み中...</p></div>
  }


  return (
    <div className='flex items-center justify-center flex-col pt-60'>
      {errors.root && (
        <p className="text-caution text-md pb-4">
          {errors.root.message}</p>
      )}
      <form onSubmit={handleSubmit(profileSubmit)} className='space-y-8 w-full max-w-100'>
        <div className='space-y-2'>
          <Label htmlFor='profileThumbnailKey'>
            <ImageInput
              id="profileThumbnailKey"
              onChange={handleImageChange}
            />
            <div className='relative w-[clamp(44px,calc(88/768*100vw),88px)] mx-auto'>
              <div className='w-fit rounded-full border-5 border-white overflow-hidden bg-profileThumbnail'>
                <Image
                  src={profileThumbnailUrl[0] || "/profile/default_avatar.svg"}
                  alt="プロフィール画像"
                  width={88}
                  height={110}
                  loading='eager'
                  className='aspect-square object-cover'
                />
              </div>
              <div className='w-fit rounded-full border-5 border-white bg-accent-primary p-2 absolute bottom-0 right-0'>
                <Image
                  src={"/profile/camera.svg"}
                  alt="カメラアイコン"
                  width={15}
                  height={15}
                  loading='eager'
                />
              </div>
            </div>
          </Label>
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
          <BaseSelect
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
          <BirthYearSelect
            {...register("yearOfBirth")}
            className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='children'>
              子供の年月日
          </Label>
          <div className='flex flex-col gap-4'>
            {fields.map((field, index) => (
              <div className='flex gap-2' key={field.id}>
                <BirthYearSelect
                  reverse
                  {...register(
                    `children.${index}.birthYear`
                  )}
                  className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
                />
                <BirthMonthSelect
                  {...register(
                    `children.${index}.birthMonth`)}
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
