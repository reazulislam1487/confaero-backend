export type JoinSessionPayload = {
  eventId: string;
  sessionIndex: number;
};

export type LiveMessagePayload = {
  eventId: string;
  sessionIndex: number;
  text: string;
};

export type CreatePollPayload = {
  eventId: string;
  sessionIndex: number;
  question: string;
  options: string[];
};

export type VotePollPayload = {
  eventId: string;
  sessionIndex: number;
  pollId: string;
  optionIndex: number;
};
