"use client";

import { useSession } from "next-auth/react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CameraIcon } from "./_components/icons";
import { SocialAccounts } from "./_components/social-accounts";

export default function Page() {
  const { data: session, status } = useSession();
  const [data, setData] = useState({
    name: "",
    bio: "",
    coverPhoto: "/images/cover/cover-01.png",
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setData((prev) => ({
        ...prev,
        name: session.user.name ?? "User",
        bio: session.user.bio,
        profilePhoto: session.user.image
      }));
    }
  }, [status, session]);

  const handleChange = (e: any) => {
    if (e.target.name === "profilePhoto") {
      const file = e.target?.files[0];
      setData({
        ...data,
        profilePhoto: file && URL.createObjectURL(file),
      });
    } else if (e.target.name === "coverPhoto") {
      const file = e.target?.files[0];
      setData({
        ...data,
        coverPhoto: file && URL.createObjectURL(file),
      });
    } else {
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>You must be signed in.</p>;

  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Profile" />

      {/* ... your layout stays same ... */}
      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={data.coverPhoto}
            alt="profile cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={970}
            height={260}
            style={{ width: "auto", height: "auto" }}
          />
          <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
            <label
              htmlFor="cover"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-opacity-90"
            >
              <input
                type="file"
                name="coverPhoto"
                id="coverPhoto"
                className="sr-only"
                onChange={handleChange}
                accept="image/png, image/jpg, image/jpeg"
              />
              <CameraIcon />
              <span>Edit</span>
            </label>
          </div>
        </div>

        {/* Profile image and name */}
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2">
              {data.profilePhoto && (
                <>
                  <Image
                    src={data.profilePhoto}
                    width={160}
                    height={160}
                    className="overflow-hidden rounded-full"
                    alt="profile"
                  />
                  <label
                    htmlFor="profilePhoto"
                    className="absolute bottom-0 right-0 flex size-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                  >
                    <CameraIcon />
                    <input
                      type="file"
                      name="profilePhoto"
                      id="profilePhoto"
                      className="sr-only"
                      onChange={handleChange}
                      accept="image/png, image/jpg, image/jpeg"
                    />
                  </label>
                </>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
              {data.name}
            </h3>
            <p className="font-medium">Ui/Ux Designer</p>
          </div>

          <div className="mx-auto max-w-[720px]">
              <h4 className="font-medium text-dark dark:text-white">About Me</h4>
              <p className="mt-4">
              {data.bio}
              </p>
            </div>

          {/* ... rest of the UI ... */}
          <SocialAccounts />
        </div>
      </div>
    </div>
  );
}
