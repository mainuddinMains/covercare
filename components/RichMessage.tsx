import { Fragment } from "react";
import { GLOSSARY, GLOSSARY_REGEX } from "@/lib/glossary";
import GlossaryTerm from "./GlossaryTerm";

interface Props {
  content: string;
}

/**
 * Renders assistant message text with clickable glossary terms highlighted.
 * Preserves whitespace/newlines. Matches are case-insensitive.
 */
export default function RichMessage({ content }: Props) {
  // Split content into lines, preserving paragraph structure
  const lines = content.split("\n");

  return (
    <>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {parseLine(line)}
          {li < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}

function parseLine(line: string): React.ReactNode {
  // Reset regex lastIndex before each use
  GLOSSARY_REGEX.lastIndex = 0;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Clone the regex to avoid shared state issues across concurrent renders
  const re = new RegExp(GLOSSARY_REGEX.source, GLOSSARY_REGEX.flags);

  while ((match = re.exec(line)) !== null) {
    const [fullMatch] = match;
    const start = match.index;

    // Plain text before this match
    if (start > lastIndex) {
      parts.push(line.slice(lastIndex, start));
    }

    const key = fullMatch.toLowerCase();
    const entry = GLOSSARY[key];

    if (entry) {
      parts.push(
        <GlossaryTerm key={`${key}-${start}`} entry={entry}>
          {fullMatch}
        </GlossaryTerm>
      );
    } else {
      parts.push(fullMatch);
    }

    lastIndex = start + fullMatch.length;
  }

  // Remaining plain text
  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return parts;
}
