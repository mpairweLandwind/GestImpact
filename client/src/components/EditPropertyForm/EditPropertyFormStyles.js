import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  card: {
    maxWidth: '800px',  // Fixed width for larger screens
    margin: 'auto',     // Center the card
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      maxWidth: '100%',  // Full width on smaller screens
    },
  },
}));

export default useStyles;
