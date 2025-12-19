import React from 'react';
import { SpecialRuleBlock } from '../../SpecialRuleBlock';

export const TimeLimitStep = (): React.ReactElement => {
  return (
    <SpecialRuleBlock 
      source="setupCard" 
      title="Setup Card Override"
      content={[
        { type: 'strong', content: 'Game Timer:' },
        { type: 'paragraph', content: ['Give a pile of ', { type: 'strong', content: '20 Disgruntled Tokens' }, ' to the player taking the first turn. These tokens will be used as Game Length Tokens.'] },
        { type: 'paragraph', content: ['Each time that player takes a turn, discard one of the Disgruntled Tokens. When the final token is discarded, everyone gets one final turn, then the game is over.'] },
        { type: 'paragraph', content: [{ type: 'warning-box', content: ['If time runs out before the Story Card is completed, the player with the most credits wins.'] }] }
      ]}
    />
  );
};