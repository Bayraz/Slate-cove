/**
 * Safety policy for ParentPilot's assistant.
 *
 * Two layers:
 *  1. `screenMessage` runs BEFORE any model or tool. Emergencies and crisis
 *     messages get fixed, human-reviewed guidance; the AI never improvises.
 *  2. `SAFETY_POLICY_PROMPT` is the rule set every real model provider must be
 *     given as its system prompt.
 *
 * TODO(stage: safety): clinical review of wording, localisation per region,
 * and a broader, evaluated classifier. Keyword matching is a floor, not a ceiling.
 */
import { env } from "@/config/env";

export type SafetyLevel = "emergency" | "crisis" | "health" | "none";

export interface SafetyScreen {
  level: SafetyLevel;
}

const EMERGENCY = [
  /\b(not|isn'?t|stopped|stops|stop|can'?t|cannot|struggling to|difficulty)\s+breath/i,
  /\bstopped breathing\b/i,
  /\bgasping\b/i,
  /\b(unresponsive|unconscious|won'?t wake|not waking|can'?t wake|passed out)\b/i,
  /\b(floppy|limp)\b/i,
  /\b(seizure|seizing|convulsion|convulsing|having a fit)\b/i,
  /\bchoking\b/i,
  /\b(blue|grey|gray)\s+(lips|skin|face|colou?r)\b/i,
  /\bturning (blue|grey|gray)\b/i,
  /\b(severe|heavy)\s+bleeding\b/i,
  /\bwon'?t stop bleeding\b/i,
  /\b(swallowed|ate|drank)\b.*\b(battery|batteries|poison|bleach|tablets?|pills?|medicine|detergent)\b/i,
  /\b(overdose|overdosed|poisoned)\b/i,
];

const CRISIS = [
  /\b(kill|hurt\w*|harm\w*)\s+(myself|me)\b/i,
  /\bsuicid/i,
  /\bend my life\b/i,
  /\b(want|going|thinking|thought|urge|scared i)\b.*\b(hurt\w*|harm\w*|shak\w+|smother\w*|drop\w*)\b.*\b(baby|him|her|child|newborn)\b/i,
  /\bdon'?t want to be here\b/i,
];

const HEALTH = [
  /\b(fever|temperature|rash|vomit\w*|diarrh?oea|cough\w*|wheez\w*|jaundice|reflux|colic|allerg\w*|infection|dehydrat\w*|constipat\w*)\b/i,
  /\b(medicine|medication|dose|dosage|paracetamol|calpol|ibuprofen|antibiotics?|ointment|drops)\b/i,
  /\b(symptoms?|diagnos\w*|is (it|this|that) normal|should i be worried|poorly|unwell|\bill\b|\bsick\b)\b/i,
  /\b(not feeding|won'?t feed|refusing (a )?(feed|bottle)|not eating|weight loss|not gaining)\b/i,
];

export function screenMessage(text: string): SafetyScreen {
  if (EMERGENCY.some((re) => re.test(text))) return { level: "emergency" };
  if (CRISIS.some((re) => re.test(text))) return { level: "crisis" };
  if (HEALTH.some((re) => re.test(text))) return { level: "health" };
  return { level: "none" };
}

export function emergencyReply(): string {
  return [
    `This could be an emergency. Please call ${env.emergencyNumber} now, or go to your nearest emergency department.`,
    "Don't wait for the app. If you're alone, put the phone on speaker and follow what the call handler tells you.",
    "I'm not able to assess what's happening, and I haven't contacted anyone for you.",
  ].join("\n\n");
}

export function crisisReply(): string {
  return [
    "I'm really glad you said something. You don't have to handle this alone, and it's okay to ask for help right now.",
    `If you or your baby might be in immediate danger, call ${env.emergencyNumber}.`,
    "For someone to talk to any time, the Samaritans are free on 116 123 (UK). You can also call NHS 111 or speak to your GP or health visitor today.",
    "If you can, tell someone you trust that you're struggling. I haven't contacted anyone for you.",
  ].join("\n\n");
}

export function healthReply(): string {
  return [
    "I can't diagnose, judge whether something is serious, or suggest medicines or doses. That needs a health professional who can consider your baby's situation.",
    "For trustworthy guidance, use the NHS website or call NHS 111, or speak to your GP or health visitor. If you think it's urgent, or something feels wrong, call 111, or " +
      `${env.emergencyNumber} in an emergency.`,
    "I haven't saved this or told anyone about it.",
  ].join("\n\n");
}

/**
 * System prompt every real model provider MUST send. Kept here, not in the
 * provider, so the rules are versioned and reviewed in one place.
 */
export const SAFETY_POLICY_PROMPT = `You are ParentPilot's assistant, helping new parents with small practical tasks.
You are not a doctor, nurse or any kind of clinician, and you must never suggest you are.

Hard rules:
- Never diagnose a condition, judge severity, or suggest that symptoms are harmless.
- Never state or estimate medication names, doses or timings. Refer to a pharmacist, GP, health visitor, or NHS 111.
- For health questions, point to current authoritative sources (NHS / official healthcare guidance) and say when you are unsure. Do not present uncertain information as fact.
- If a message suggests an emergency, tell the parent to call emergency services immediately. Do not continue normal assistance.
- You can only act through the tools you are given. Never claim you saved, set, sent, booked, added, changed or deleted anything unless a tool result in this conversation confirms it succeeded.
- If you cannot do something, say so plainly and do not pretend.
- Only describe stored family information using tool results; do not invent details about the family.
- Keep replies short, warm and calm. The reader is tired.`;

/**
 * Backstop against the assistant claiming an action that never happened.
 * If the reply reads like "I've saved/set/added ..." but no write tool
 * succeeded this turn, the claim is replaced with an honest message.
 */
const ACTION_CLAIM =
  /\b(i(?:'ve| have| just)\s+(?:\w+\s+)?(?:saved|set|added|created|scheduled|sent|booked|deleted|removed|updated|logged|remembered)|(?:reminder|appointment|event|note)\s+(?:is |has been |was )?(?:set|saved|added|created|booked|scheduled)|(?:i(?:'ll| will) (?:remind|notify|message) you)|all (?:done|set))\b/i;

export function guardActionClaims(text: string, successfulWriteTools: number): string {
  if (successfulWriteTools > 0 || !ACTION_CLAIM.test(text)) return text;
  return "I can't confirm that anything has been saved or changed, so please don't rely on it. I haven't completed any action for you.";
}
