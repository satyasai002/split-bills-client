import { motion } from "framer-motion";
import { chakra, shouldForwardProp } from "@chakra-ui/react";

const StyledDiv = chakra(motion.div, {
  shouldForwardProp: (prop) => {
    return shouldForwardProp(prop) || prop === "transition";
  },
});

const Section = ({ children, delay = 0, id }) => (
  <StyledDiv
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0., delay, ease: "easeIn" }}
    mb={6}
    id={id}
  >
    {children}
  </StyledDiv>
);

export default Section;
