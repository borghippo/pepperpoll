import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { PollDB } from "../create";

type PollProps = {
  poll: PollDB;
};

type QuestionsDB = {
  id: number;
  created_at: string;
  poll_id: number;
  question: string;
}[];

type VotesDB = {
  id: number;
  created_at: string;
  poll_id: number;
  question_id: number;
}[];

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { data: poll } = await supabase
    .from("polls")
    .select("*")
    .eq("slug", params?.id)
    .single();

  return {
    props: { poll },
  };
};

const Poll: NextPage<PollProps> = ({ poll }) => {
  const [questions, setQuestions] = useState<QuestionsDB>([]);
  const [votes, setVotes] = useState<VotesDB>([]);

  const createVote = async (questionId: number) => {
    const { data: vote } = await supabase
      .from("votes")
      .insert([{ question_id: questionId, poll_id: poll.id }]);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data: questionsFromID } = await supabase
        .from("questions")
        .select("*")
        .eq("poll_id", poll.id);

      if (questionsFromID) {
        setQuestions(questionsFromID);
      }
    };

    const fetchVotes = async () => {
      const { data: votesFromID } = await supabase
        .from("votes")
        .select("*")
        .eq("poll_id", poll.id);

      if (votesFromID) {
        setVotes(votesFromID);
      }
    };

    if (poll) {
      fetchQuestions();
      fetchVotes();
    }

    const subscription = supabase
      .from(`votes:poll_id=eq.${poll.id}`)
      .on("INSERT", (payload) => {
        setVotes((current) => [...current, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  if (!poll) {
    return <div>error</div>;
  }
  if (questions.length > 0) {
    return (
      <div>
        <h1 className="text-xl">{poll.title}</h1>
        {questions.map((question) => {
          return (
            <div key={question.id}>
              <div>{question.question}</div>
              <div>
                {
                  votes.filter((vote) => vote.question_id === question.id)
                    .length
                }
              </div>
              <button
                className="btn btn-primary"
                onClick={() => createVote(question.id)}
              >
                this one
              </button>
            </div>
          );
        })}
      </div>
    );
  }
  return <div>loading</div>;
};

export default Poll;
