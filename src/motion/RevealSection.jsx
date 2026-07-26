import { motion } from 'framer-motion';
import { fadeUp } from './variants';

export default function RevealSection({ children, className, delay = 0, once = true, amount = 0.2, variants = fadeUp, ...rest }) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
