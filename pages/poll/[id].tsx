import { NextPage } from "next";
import { useEffect, useState } from "react";
import { supabaseClient, withPageAuth } from "@supabase/auth-helpers-nextjs";
import { PollPageProps } from "../../types/types";
import { useUser } from "@supabase/auth-helpers-react";
import { getPollFromSlug } from "../../lib/supabaseCalls";
import Loading from "../../components/Loading";
import VoteOnPoll from "../../components/VoteOnPoll";
import PollResults from "../../components/PollResults";
import Header from "../../components/Header";

export const getServerSideProps = withPageAuth({
  redirectTo: "/",
  async getServerSideProps({ params }) {
    const poll = await getPollFromSlug(params?.id);

    if (!poll) {
      return {
        notFound: true,
      };
    }

    return {
      props: { poll },
    };
  },
});

const Poll: NextPage<PollPageProps> = (
  { poll },
) => {
  const [questions, setQuestions] = useState(poll.questions);
  const [votes, setVotes] = useState(poll.votes);
  const [voted, setVoted] = useState(false);
  const [checkingIfVoted, setCheckingIfVoted] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const subscription = supabaseClient
      .from(`votes:poll_id=eq.${poll.id}`)
      .on("INSERT", (payload) => {
        setVotes((currentVotes) => [...currentVotes, payload.new]);
      })
      .subscribe();

    return () => {
      supabaseClient.removeSubscription(subscription);
    };
  }, []);

  useEffect(() => {
    const checkIfVoted = () => {
      const userHasVoted = poll.votes.filter(
        (vote) => vote.voter_id === user?.id,
      );

      if (userHasVoted.length > 0) setVoted(true);

      setCheckingIfVoted(false);
    };

    if (user && checkingIfVoted) checkIfVoted();
  }, [user]);

  if (user && !checkingIfVoted) {
    return (
      <>
        <Header />
        {voted &&
          (
            <PollResults
              poll_title={poll.title}
              questions={questions}
              votes={votes}
            />
          )}
        {!voted &&
          (
            <VoteOnPoll
              user_id={user.id}
              poll_id={poll.id}
              setVoted={setVoted}
              poll_title={poll.title}
              questions={poll.questions}
            />
          )}
      </>
    );
  }

  return <Loading />;
};

export default Poll;
