import { useUser } from "@supabase/auth-helpers-react";
import type { NextPage } from "next";
import Link from "next/link";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/ui";
import Loading from "../components/Loading";
import Header from "../components/Header";

const Home: NextPage = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <>
        <h1 className="text-5xl font-bold text-center pt-10 pb-14">
          Pepper Poll 🌶
        </h1>
        <Auth
          className="max-w-xs md:max-w-md m-auto"
          supabaseClient={supabaseClient}
        />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="hero mt-36">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Pepper Poll 🌶</h1>
            <p className="py-6">
              Create a poll and share it with others for live results.
            </p>
            <Link href="/create">
              <button className="btn btn-primary">Create poll</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
