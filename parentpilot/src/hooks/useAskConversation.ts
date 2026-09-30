import { useCallback, useMemo, useRef, useState } from "react";
import type { ChatMessage } from "@/ai/types";
import { createAssistant, newMessage, validateUserMessage } from "@/services/askService";
import { useFamily } from "./FamilyProvider";

export function useAskConversation() {
  const { family, caregiver, repos } = useFamily();
  const assistant = useMemo(
    () => createAssistant({ familyId: family.id, caregiverId: caregiver.id, repos }),
    [family.id, caregiver.id, repos],
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [inputError, setInputError] = useState<string | undefined>();
  const sendingRef = useRef(false);
  const messagesRef = useRef<ChatMessage[]>([]);

  const send = useCallback(
    async (raw: string): Promise<boolean> => {
      if (sendingRef.current) return false;
      const checked = validateUserMessage(raw);
      if (!checked.ok) {
        setInputError(checked.message);
        return false;
      }
      setInputError(undefined);
      sendingRef.current = true;
      setSending(true);
      const withUser = [...messagesRef.current, newMessage("user", checked.text)];
      messagesRef.current = withUser;
      setMessages(withUser);
      try {
        const reply = await assistant.reply(withUser);
        const withReply = [...withUser, newMessage("assistant", reply.text, { tone: reply.tone, toolActivity: reply.toolActivity })];
        messagesRef.current = withReply;
        setMessages(withReply);
      } finally {
        sendingRef.current = false;
        setSending(false);
      }
      return true;
    },
    [assistant],
  );

  return { messages, sending, send, inputError, isPreview: assistant.isPreview };
}
