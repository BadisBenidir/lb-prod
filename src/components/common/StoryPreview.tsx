import React from 'react';
import { useScreenSize } from '../../hooks/useScreenSize';
import StoryPreviewMobile from './StoryPreviewMobile';
import StoryPreviewDesktop from './StoryPreviewDesktop';

interface StoryPreviewProps {
  onNavigateToAbout?: () => void;
  onNavigateToSell?: () => void;
}

const StoryPreview: React.FC<StoryPreviewProps> = ({ onNavigateToAbout, onNavigateToSell }) => {
  const { isMobile } = useScreenSize();

  return isMobile ? (
    <StoryPreviewMobile 
      onNavigateToAbout={onNavigateToAbout}
      onNavigateToSell={onNavigateToSell}
    />
  ) : (
    <StoryPreviewDesktop 
      onNavigateToAbout={onNavigateToAbout}
      onNavigateToSell={onNavigateToSell}
    />
  );
};

export default StoryPreview;