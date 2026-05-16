import { useEffect, useState } from "react";

const PHRASES = [
  "Trade with clarity.",
  "Invest with precision.",
  "Execute with conviction.",
  "Analyze with confidence.",
];

const TYPE_MS = 55;
const DELETE_MS = 35;
const PAUSE_MS = 2000;

export function TypingHeadline() {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = PHRASES[phraseIdx];

    if (!deleting && displayed === target) {
      const t = setTimeout(() => setDeleting(true), PAUSE_MS);
      return () => clearTimeout(t);
    }

    if (deleting && displayed === "") {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % PHRASES.length);
      return;
    }

    const t = setTimeout(
      () =>
        setDisplayed((d) =>
          deleting ? d.slice(0, -1) : target.slice(0, d.length + 1)
        ),
      deleting ? DELETE_MS : TYPE_MS
    );
    return () => clearTimeout(t);
  }, [displayed, deleting, phraseIdx]);

  return (
    <span>
      {displayed}
      <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-primary align-middle" style={{ height: "1em" }} />
    </span>
  );
}
