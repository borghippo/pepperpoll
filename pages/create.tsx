import type { NextPage } from "next";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import CreatePoll from "../components/CreatePoll";
import Loading from "../components/Loading";
import Header from "../components/Header";

export const getServerSideProps = withPageAuth({
  redirectTo: "/",
});

const Create: NextPage = () => {
  const { user } = useUser();

  if (user) {
    return (
      <>
        <Header />
        <CreatePoll user={user} />
      </>
    );
  }

  return <Loading />;
};

export default Create;
