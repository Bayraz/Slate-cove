"""Ask Claude for a reply to one guest message."""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass

import anthropic

from .config import Settings
from .properties import Brand, PropertyBook

log = logging.getLogger(__name__)

ESCALATE_MARKER = "[ESCALATE]"

PROMPT_TEMPLATE = """You draft replies to guests on behalf of {brand}{description}. \
A human reads and approves every draft before it is sent, so write the reply \
itself — not advice about what to write.

How to write:
- Warm, direct, and brief. Two to five sentences is usually right.
- British English. Plain words. No marketing language, no exclamation marks.
- Answer the question that was asked. If they asked two things, answer both.
{tone}{sign_off}
What you may say:
- Only facts given in the property context below, plus ordinary courtesy.
- If a needed fact is missing, do not guess it and do not invent an address, a \
code, a price, a time, or a policy.

When to hand it to a human instead:
- Start your reply with the exact token {marker} on its own first line when the \
message involves money (refunds, discounts, damage charges), a complaint, a \
safety or maintenance emergency, a legal or insurance matter, anything you \
would have to invent a fact to answer, or anything the property context lists \
under "escalate if". After that token, still write your best attempt at a \
reply so the human has something to edit.

Output the reply text and nothing else. No preamble, no subject line, no \
explanation of your choices, no quotation marks around the whole reply.
"""


def build_system_prompt(brand: Brand) -> str:
    """The drafting instructions, in the voice of whichever company this is."""
    description = f", {brand.description}" if brand.description else ""
    tone = f"- {brand.tone.strip()}\n" if brand.tone else ""
    sign_off = (
        f"- Sign off as {brand.sign_off.strip()} when the message reads like a "
        "fresh conversation rather than a quick back-and-forth.\n"
        if brand.sign_off
        else ""
    )
    return PROMPT_TEMPLATE.format(
        brand=brand.name,
        description=description,
        tone=tone,
        sign_off=sign_off,
        marker=ESCALATE_MARKER,
    )


@dataclass
class Draft:
    text: str
    escalate: bool
    model: str
    input_tokens: int = 0
    output_tokens: int = 0

    @property
    def is_empty(self) -> bool:
        return not self.text.strip()


class DraftingError(RuntimeError):
    """Claude could not produce a usable draft."""


def parse_reply(raw: str) -> tuple[str, bool]:
    """Split the escalation marker off the model's reply text."""
    text = raw.strip()
    escalate = False
    if text.upper().startswith(ESCALATE_MARKER):
        escalate = True
        text = text[len(ESCALATE_MARKER) :].lstrip(" :—-")
    # Strip a wrapping pair of quotes if the model added them anyway.
    if len(text) > 1 and text[0] == text[-1] and text[0] in {'"', "'", "“"}:
        text = text[1:-1].strip()
    return re.sub(r"\n{3,}", "\n\n", text).strip(), escalate


class Drafter:
    def __init__(self, settings: Settings, book: PropertyBook) -> None:
        self.settings = settings
        self.book = book
        self.system_prompt = build_system_prompt(book.brand)
        self._client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    async def draft(
        self,
        *,
        guest_message: str,
        guest_name: str = "",
        property_label: str = "",
        thread_excerpt: str = "",
    ) -> Draft:
        context = self.book.context_for(property_label)
        user_content = "\n\n".join(
            part
            for part in [
                "<property_context>\n" + context + "\n</property_context>",
                (
                    "<recent_thread>\n" + thread_excerpt.strip() + "\n</recent_thread>"
                    if thread_excerpt.strip()
                    else ""
                ),
                "<guest_name>" + (guest_name or "unknown") + "</guest_name>",
                "<guest_message>\n" + guest_message.strip() + "\n</guest_message>",
                "Write the reply.",
            ]
            if part
        )

        try:
            response = await self._client.messages.create(
                model=self.settings.anthropic_model,
                max_tokens=2000,
                thinking={"type": "adaptive"},
                output_config={"effort": self.settings.anthropic_effort},
                system=[
                    {
                        "type": "text",
                        "text": self.system_prompt,
                        "cache_control": {"type": "ephemeral"},
                    }
                ],
                messages=[{"role": "user", "content": user_content}],
            )
        except anthropic.APIStatusError as exc:
            raise DraftingError(f"Claude API error {exc.status_code}: {exc}") from exc
        except anthropic.APIConnectionError as exc:
            raise DraftingError(f"Could not reach the Claude API: {exc}") from exc

        if response.stop_reason == "refusal":
            raise DraftingError(
                "Claude declined to draft a reply to this message; it needs a "
                "human answer."
            )

        raw = "".join(
            block.text for block in response.content if getattr(block, "type", "") == "text"
        )
        text, escalate = parse_reply(raw)
        if not text:
            raise DraftingError("Claude returned an empty draft.")
        if response.stop_reason == "max_tokens":
            escalate = True

        return Draft(
            text=text,
            escalate=escalate,
            model=response.model,
            input_tokens=response.usage.input_tokens,
            output_tokens=response.usage.output_tokens,
        )
