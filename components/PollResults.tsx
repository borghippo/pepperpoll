import CopyToClipboard from "./CopyToClipboard";
import Loading from "./Loading";

const PollResults: React.FC<{
  poll_title: string;
  questions: {
    id: number;
    question: string;
  }[];
  votes: {
    question_id: number;
    voter_id: string;
  }[];
}> = ({ poll_title, questions, votes }) => {
  if (votes.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl text-center p-4">{poll_title}</h1>
        <CopyToClipboard />
        {questions.map((question) => {
          const votesForQuestion = votes.filter(
            (vote) => vote.question_id === question.id,
          ).length;

          const barValue = Math.round((votesForQuestion / votes.length) * 100);
          return (
            <div
              className="flex flex-col space-y-2 my-4 w-56"
              key={question.id}
            >
              <div className="flex flex-col">
                <p className="font-bold">{question.question}</p>
                <p>
                  {votesForQuestion} votes - {barValue}%
                </p>
              </div>
              <progress
                className="progress progress-primary w-56"
                value={barValue}
                max="100"
              >
              </progress>
            </div>
          );
        })}
      </div>
    );
  }
  return <Loading />;
};

export default PollResults;
