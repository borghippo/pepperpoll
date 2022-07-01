import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Loading from "../components/Loading";
import UserPolls from "../components/UserPolls";
import { getUserPolls } from "../lib/supabaseCalls";
import { UsersPolls } from "../types/types";

export const getServerSideProps = withPageAuth({
  redirectTo: "/",
});

const MyPolls: NextPage = () => {
  const { user, isLoading } = useUser();
  const [polls, setPolls] = useState<UsersPolls[]>([]);

  useEffect(() => {
    const getPolls = async () => {
      const polls = await getUserPolls(user!.id);
      if (polls) {
        setPolls(polls);
      }
    };

    if (user) {
      getPolls();
    }
  }, [user]);

  return (
    <>
      <Header />
      {user && <UserPolls polls={polls} />}
      {isLoading && <Loading />}
    </>
  );
};

export default MyPolls;
