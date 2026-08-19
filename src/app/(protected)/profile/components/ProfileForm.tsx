"use client";

import {
  forwardRef,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import type { Profile } from "../page";
import CustomSelect from "@/components/ui/CustomSelect";
import { createNotification } from "@/lib/notifications";

type ProfileFormProps = {
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile | null>>;
  highlight?: boolean;
};

const ProfileForm = forwardRef<
  HTMLDivElement,
  ProfileFormProps
>(
  (
    {
      profile,
      setProfile,
      highlight,
    },
    ref
  ) => {
    const { session } = useAuth();

    const [name, setName] = useState("");
    const [strategy, setStrategy] =
      useState("");
    const [tradingStyle, setTradingStyle] =
      useState("Intraday");
    const [accountType, setAccountType] =
      useState("Demo");
    const [experience, setExperience] =
      useState("Beginner");

    const [saving, setSaving] =
      useState(false);

    useEffect(() => {
      setName(profile.name || "");
      setStrategy(profile.strategy || "");
      setTradingStyle(
        profile.trading_style || "Intraday"
      );
      setAccountType(
        profile.account_type || "Demo"
      );
      setExperience(
        profile.experience || "Beginner"
      );
    }, [profile]);

    async function saveProfile() {
      if (!session?.user) return;

      setSaving(true);

      const { error } = await supabase
        .from("users")
        .update({
          name,
          strategy,
          trading_style: tradingStyle,
          account_type: accountType,
          experience,
        })
        .eq("id", session.user.id);

      setSaving(false);

      if (error) {
        console.error(error);
        toast.error(error.message);
      } else {
        setProfile({
          ...profile,
          name,
          strategy,
          trading_style: tradingStyle,
          account_type: accountType,
          experience,
        });

        await createNotification(
          session.user.id,
          "Profile Updated",
          "Your trading profile has been updated successfully.",
          "success"
        );

        toast.success(
          "Profile updated successfully!"
        );
      }
    }

    return (
      <div
        ref={ref}
        className={`
          space-y-6
          rounded-3xl
          border
          bg-white/70
          p-5
          backdrop-blur-xl
          transition-shadow
          duration-300
          dark:bg-white/5
          sm:space-y-8
          sm:p-8
          ${
            highlight
              ? "border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.35)]"
              : "border-gray-200 dark:border-white/10"
          }
        `}
      >
        {/* Heading */}
        <div className="space-y-2">
          <h2
            className="
              text-xl
              font-bold
              text-black
              dark:text-white
              sm:text-2xl
            "
          >
            Personal Information
          </h2>

          <p
            className="
              text-sm
              leading-6
              text-gray-500
              dark:text-gray-400
            "
          >
            Manage how your trading profile
            appears across Pipsoul.
          </p>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <label
            className="
              text-sm
              font-medium
              text-gray-700
              dark:text-gray-300
            "
          >
            Full Name
          </label>

          <input
            className="
              min-h-[48px]
              w-full
              rounded-xl
              border
              border-gray-300
              bg-white
              p-3
              text-sm
              text-black
              outline-none
              transition-none
              placeholder:text-gray-400
              focus:ring-2
              focus:ring-cyan-500
              dark:border-white/10
              dark:bg-[#111827]
              dark:text-white
              dark:placeholder:text-gray-500
            "
            placeholder="Enter your full name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />
        </div>

        {/* Selects */}
        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-3
          "
        >
          <div className="space-y-2">
            <label
              className="
                text-sm
                font-medium
                text-gray-700
                dark:text-gray-300
              "
            >
              Trading Style
            </label>

            <CustomSelect
              value={tradingStyle}
              onChange={setTradingStyle}
              options={[
                "Scalping",
                "Intraday",
                "Swing",
                "Position",
              ]}
            />
          </div>

          <div className="space-y-2">
            <label
              className="
                text-sm
                font-medium
                text-gray-700
                dark:text-gray-300
              "
            >
              Account Type
            </label>

            <CustomSelect
              value={accountType}
              onChange={setAccountType}
              options={[
                "Demo",
                "Live",
                "Prop Firm",
              ]}
            />
          </div>

          <div className="space-y-2">
            <label
              className="
                text-sm
                font-medium
                text-gray-700
                dark:text-gray-300
              "
            >
              Trading Experience
            </label>

            <CustomSelect
              value={experience}
              onChange={setExperience}
              options={[
                "Beginner",
                "Intermediate",
                "Advanced",
              ]}
            />
          </div>
        </div>

        {/* Strategy */}
        <div className="space-y-2">
          <label
            className="
              text-sm
              font-medium
              text-gray-700
              dark:text-gray-300
            "
          >
            Strategy
          </label>

          <textarea
            rows={5}
            className="
              min-h-[130px]
              w-full
              resize-none
              rounded-xl
              border
              border-gray-300
              bg-white
              p-3
              text-sm
              text-black
              outline-none
              transition-none
              placeholder:text-gray-400
              focus:ring-2
              focus:ring-cyan-500
              dark:border-white/10
              dark:bg-[#111827]
              dark:text-white
              dark:placeholder:text-gray-500
            "
            placeholder="Tell us about your trading strategy..."
            value={strategy}
            onChange={(e) =>
              setStrategy(e.target.value)
            }
          />
        </div>

        {/* Save */}
        <div className="pt-1">
          <button
            onClick={saveProfile}
            disabled={saving}
            className="
              flex
              min-h-[48px]
              w-full
              items-center
              justify-center
              rounded-xl
              bg-cyan-500
              px-8
              py-3
              text-sm
              font-semibold
              text-white
              transition-all
              duration-300
              hover:bg-cyan-600
              hover:shadow-lg
              hover:shadow-cyan-500/20
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:w-auto
              sm:justify-center
            "
          >
            {saving
              ? "Saving Changes..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    );
  }
);

export default ProfileForm;