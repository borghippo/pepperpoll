import { Dispatch, SetStateAction } from "react";
import { createNewVote } from "../lib/supabaseCalls";

const VoteOnVoll: React.FC<
  {
    user_id: string;
    poll_id: number;
    setVoted: Dispatch<SetStateAction<boolean>>;
    poll_title: string;
    questions: {
      id: number;
      question: string;
    }[];
  }
> = (
  { user_id, poll_id, setVoted, poll_title, questions },
) => {
  const createVote = async (questionId: number) => {
    const error = await createNewVote(questionId, user_id, poll_id);

    if (!error) setVoted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl text-center pt-2 pb-8">{poll_title}</h1>
      <div className="flex flex-col space-y-4 w-72">
        {questions.map((question) => {
          return (
            <div
              className="flex items-center justify-between space-x-2"
              key={question.id}
            >
              <p className="font-bold">{question.question}</p>
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
    </div>
  );
};

export default VoteOnVoll;
