import { useTypewriter } from "react-simple-typewriter";
import { Textarea } from "../ui/textarea";
import { useEffect, useRef } from "react";

interface Props {
  message: string;
  setIsBotTyping: React.Dispatch<React.SetStateAction<boolean>>;
}

const TypeWriter = ({ message, setIsBotTyping }: Props) => {
  const conversationRef = useRef<HTMLTextAreaElement>(null);

  const [text] = useTypewriter({
    words: [`${message}`],
    loop: 1,
    onLoopDone: () => {
      setIsBotTyping(false);
    },
    onType: () => {
      setIsBotTyping(true);
    },
    typeSpeed: 20,
  });

  useEffect(() => {
    // Scroll to the bottom of the conversation container
    if (conversationRef.current) {
      // Check if the second effect hasn't executed
      const { scrollHeight, clientHeight } = conversationRef.current;
      const maxScrollTop = scrollHeight - clientHeight;
      conversationRef.current.scrollTo({
        top: maxScrollTop,
        behavior: "auto",
      });
    }
  }, [text]);

  return (
    <Textarea
      ref={conversationRef}
      readOnly
      className="resize-none h-[300px] font-semibold text-base italic"
      value={text}
    />
  );
};

export default TypeWriter;
