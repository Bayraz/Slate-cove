"""Property context handed to Claude when drafting a reply.

The file is plain JSON so it can be edited without touching code. Matching is
deliberately forgiving: Zeevou's inbox label for a property rarely matches the
listing name exactly.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any


def _normalise(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


@dataclass
class PropertyContext:
    name: str
    facts: dict[str, Any]
    aliases: list[str]

    def as_prompt_block(self) -> str:
        lines = [f"Property: {self.name}"]
        for key, value in self.facts.items():
            if value in (None, "", [], {}):
                continue
            if isinstance(value, list):
                value = "; ".join(str(item) for item in value)
            label = key.replace("_", " ").capitalize()
            lines.append(f"- {label}: {value}")
        return "\n".join(lines)


class PropertyBook:
    def __init__(self, properties: list[PropertyContext], house_rules: str = "") -> None:
        self.properties = properties
        self.house_rules = house_rules
        self._index: dict[str, PropertyContext] = {}
        for prop in properties:
            for key in [prop.name, *prop.aliases]:
                self._index[_normalise(key)] = prop

    @classmethod
    def load(cls, path: str | Path) -> "PropertyBook":
        path = Path(path)
        if not path.exists():
            return cls([], "")
        raw = json.loads(path.read_text(encoding="utf-8"))
        entries = raw.get("properties", []) if isinstance(raw, dict) else raw
        properties = []
        for entry in entries:
            facts = {k: v for k, v in entry.items() if k not in {"name", "aliases"}}
            properties.append(
                PropertyContext(
                    name=entry.get("name", "Unnamed property"),
                    facts=facts,
                    aliases=list(entry.get("aliases", [])),
                )
            )
        house_rules = raw.get("shared_notes", "") if isinstance(raw, dict) else ""
        return cls(properties, house_rules)

    def match(self, label: str) -> PropertyContext | None:
        """Best-effort lookup of a property from Zeevou's inbox label."""
        if not label:
            return None
        key = _normalise(label)
        if key in self._index:
            return self._index[key]
        # Substring either way: "Cove Loft 2B" vs "Cove Loft".
        for indexed, prop in self._index.items():
            if indexed and (indexed in key or key in indexed):
                return prop
        return None

    def context_for(self, label: str) -> str:
        """The prompt block for `label`, falling back to shared notes only."""
        blocks = []
        prop = self.match(label)
        if prop is not None:
            blocks.append(prop.as_prompt_block())
        elif label:
            blocks.append(
                f"Property: {label}\n"
                "- No property file entry matched this name. Do not invent "
                "property-specific details."
            )
        if self.house_rules:
            blocks.append(f"Notes that apply to every property:\n{self.house_rules}")
        return "\n\n".join(blocks) if blocks else "No property context available."
