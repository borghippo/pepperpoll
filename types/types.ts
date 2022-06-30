export type PollPageProps = {
  poll: PollWithQuestionsAndVotesDB;
};

export type FormInputs = {
  title: string;
  options: {
    text: string;
  }[];
};

export type QuestionsDB = {
  id: number;
  created_at: string;
  poll_id: number;
  question: string;
}[];

export type VotesDB = {
  id: number;
  created_at: string;
  poll_id: number;
  question_id: number;
  voter_id: string;
}[];

export type PollDB = {
  id: number;
  created_at: string;
  title: string;
  slug: string;
  user_id: string;
};

export type QuestionsToInsert = {
  poll_id: number;
  question: string;
}[];

export type PollWithQuestionsAndVotesDB = {
  id: number;
  questions: { id: number; question: string }[];
  title: string;
  votes: { question_id: number; voter_id: string }[];
  slug: string | string[] | undefined;
};
