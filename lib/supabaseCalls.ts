import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  PollDB,
  PollWithQuestionsAndVotesDB,
  QuestionsToInsert,
} from "../types/types";

export const getPollFromSlug = async (slug: string | string[] | undefined) => {
  const { data } = await supabaseClient
    .from<PollWithQuestionsAndVotesDB>("polls")
    .select(
      `
    id,
    title,
    questions(id, question),
    votes(question_id, voter_id)
    `
    )
    .eq("slug", slug)
    .single();

  return data;
};

export const createNewPoll = async (
  title: string,
  slug: string,
  user_id: string
) => {
  const { data } = await supabaseClient
    .from<PollDB>("polls")
    .insert([{ title: title, slug: slug, user_id: user_id }])
    .single();

  return data;
};

export const createNewQuestions = async (questions: QuestionsToInsert) => {
  const { error } = await supabaseClient
    .from("questions")
    .insert([...questions]);

  return error;
};

export const createNewVote = async (
  question_id: number,
  user_id: string,
  poll_id: number
) => {
  const { error } = await supabaseClient
    .from("votes")
    .insert([
      { question_id: question_id, poll_id: poll_id, voter_id: user_id },
    ]);

  return error;
};
