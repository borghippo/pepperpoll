import Link from "next/link";
import { UsersPolls } from "../types/types";

const UserPolls: React.FC<{ polls: UsersPolls[] }> = ({ polls }) => {
  return (
    <div className="flex flex-col space-y-4 my-2">
      <h1 className="p-4 text-4xl font-bold text-center">
        Your Polls
      </h1>
      {polls.map((poll, index) => {
        return (
          <div
            key={index}
            className="flex flex-col items-center justify-center"
          >
            <Link href={`/poll/${poll.slug}`}>
              <a>{poll.title}</a>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default UserPolls;
