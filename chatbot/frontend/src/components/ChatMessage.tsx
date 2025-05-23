import React, { useState } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import copyIconUrl from '../assets/images/copy_icon.svg';
import refreshIconUrl from '../assets/images/sync_icon.svg';
import thumbsUpIconUrl from '../assets/images/thumbs_up_icon.svg';
import thumbsDownIconUrl from '../assets/images/thumbs_down_icon.svg';
import buttonIconUrl from '../assets/images/buttonIcon.svg';
import downIconUrl from '../assets/images/down_icon.svg';
import { Message } from '../types';
import { useChat } from '../context/ChatContext';
import sourceIconUrl from '../assets/images/source_icon.svg';
const MessageContainer = styled.div<{ isUser: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-top: ${props => props.isUser ? '8px' : '16px'};
  max-width: ${props => props.isUser ? '80%' : '100%'};
  margin-bottom: 10px;
`;

const UserMessageContent = styled.div`
  background-color: #F5F5F5;
  color: #11171C;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.5;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
`;

const BotMessageContent = styled.div`
  border-radius: 12px;
  width: 100%;
  padding: 6px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  text-align: left;
  font-size: 13px;
  margin: 2px 0;
`;

const ModelInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
`;

const ModelIcon = styled.div`
  width: 20px;
  height: 20px;
  background-image: url(${buttonIconUrl});
  background-size: 16px;
  background-repeat: no-repeat;
  background-position: center;
`;

const ModelName = styled.span`
  font-size: 13px;
  color: #11171C;
  font-weight: 600;
`;

const ModelMetrics = styled.span`
  font-size: 11px;
  color: #5F7281;
`;

const MessageFooter = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  gap: 8px;
  align-items: flex-start;
`;

const MessageActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
  margin-bottom: 24px;
`;

const ActionButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &:hover {
    background-color: #F0F0F0;
    border-radius: 4px;
  }
`;

const CopyButton = styled(ActionButton)<{ copied: boolean }>`
  background-image: url(${props => props.copied ? '' : copyIconUrl});
  background-size: 16px;
  background-repeat: no-repeat;
  background-position: center;
  &:hover {
    background-color: rgba(34, 114, 180, 0.08);
    color: #0E538B;
  }
`;

const CheckIconWrapper = styled.div<{ $copied: boolean }>`
  display: none;
  color: #5F7281;
  font-size: 15px;
  ${props => props.$copied && `
    display: block;
  `}
`;

const RefreshButton = styled(ActionButton)`
  background-image: url(${refreshIconUrl});
  background-size: 16px;
  background-repeat: no-repeat;
  background-position: center;
  &:hover {
    background-color: rgba(34, 114, 180, 0.08);
    color: #0E538B;
  }
`;

const ThumbsUpButton = styled(ActionButton)<{ active: boolean }>`
  background-image: url(${thumbsUpIconUrl});
  background-size: 16px;
  background-repeat: no-repeat;
  background-position: center;
  ${props => props.active && `
    background-color: rgba(34, 114, 180, 0.08);
  `}

`;

const ThumbsDownButton = styled(ActionButton)<{ active: boolean }>`
  background-image: url(${thumbsDownIconUrl});
  background-size: 16px;
  background-repeat: no-repeat;
  background-position: center;
  ${props => props.active && `
    background-color: rgba(34, 114, 180, 0.08);
  `}
  
`;

const SourcesSection = styled.div`
  margin-top: 16px;
  width: 100%;
`;

const SourceContent = styled.div`
  width: 100%;
  padding: 32px;
  background: #F5F5F5;
  box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  outline: 1px #D1D9E1 solid;
  outline-offset: -1px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

const SourceItem = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SourceIconContainer = styled.div`
  height: 32px;
  min-width: 32px;
  background: rgba(0, 0, 59, 0.05);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SourceIcon = styled.div`
  background-image: url(${sourceIconUrl});
  background-size: 16px;
  background-repeat: no-repeat;
  background-position: center;
  width: 16px;
  height: 16px;
`;

const SourceTextContent = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  display: flex;
`;

const SourceText = styled.div`
  color: #11171C;
  font-size: 12px;
  line-height: 1.5;
  width: 100%;
`;

const SourceMetadata = styled.div`
  color: #5F7281;
  font-size: 11px;
  line-height: 1.4;
  width: 100%;
`;

const SourcesButton = styled.button`
  background: none;
  border: none;
  color: #11171C;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  padding-right: 24px;
  position: relative;
  
  &:hover {
    background-color: rgba(34, 114, 180, 0.08);
    border: 1px solid #2272B4;
    color: #0E538B;
  }

  &::after {
    content: "";
    position: absolute;
    right: 4px;
    width: 14px;
    height: 14px;
    background-image: url(${downIconUrl});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
`;

const SourceCardsContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  display: flex;
  gap: 8px;
  margin-top: 8px;
  padding-bottom: 4px;
  
  /* Show scrollbar and style it */
  scrollbar-width: thin;
  scrollbar-color: #C0CDD8 #F5F5F5;
  
  /* Webkit scrollbar styles */
  &::-webkit-scrollbar {
    height: 4px;
    display: block;
  }

  &::-webkit-scrollbar-track {
    background: #F5F5F5;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: #C0CDD8;
    border-radius: 2px;
    
    &:hover {
      background: #A0B0C0;
    }
  }
`;

const SourcePreviewCard = styled.div`
  min-width: 200px;
  max-width: 200px;
  padding: 16px;
  background: white;
  box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  outline: 1px #D1D9E1 solid;
  outline-offset: -1px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  display: flex;
  cursor: pointer;

  &:hover {
    outline: 1px #2272B4 solid;
    background: rgba(34, 114, 180, 0.08);
  }
`;

const SourcePreviewItem = styled.div`
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  display: flex;
`;

const PreviewText = styled.div`
  color: #11171C;
  font-size: 11px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  width: 100%;
`;

const ThinkingIndicator = styled.div`
  font-size: 13px;
  color: #5F7281;
  margin-bottom: 8px;
  align-self: flex-start;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Spinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1px solid transparent;
  border-top: 1px solid #5F7281;
  border-right: 1px solid #5F7281;
  border-radius: 50%;
  animation: spin 0.5s linear infinite;
  margin-right: 8px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface ChatMessageProps {
  message: Message;
  onRegenerate: (messageId: string) => Promise<void>;
  'data-testid'?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRegenerate }) => {
  const { copyMessage, regenerateMessage, rateMessage, messageRatings } = useChat();
  const isUser = message.role === 'user';
  const [showSources, setShowSources] = useState(false);
  const [selectedSource, setSelectedSource] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  console.log(`Message Inside ChatMessage and message.message_id=====>: ${message.content.slice(0, 10)} ${message.message_id}`);
  const currentRating = messageRatings[message.message_id];

  const handleCopy = async () => {
    await copyMessage(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000); // Reset after 5 seconds
  };

  const handleRegenerate = async () => {
    await onRegenerate(message.message_id);
  };

  const handleThumbsUp = () => {
    rateMessage(message.message_id, 'up');
  };

  const handleThumbsDown = () => {
    rateMessage(message.message_id, 'down');
  };

  const renderSources = () => {
    if (!message.sources?.length) return null;

    return (
      <SourcesSection data-testid="sources-section">
        {selectedSource !== null ? (
          <>
            <SourcesButton onClick={() => setSelectedSource(null)}>
              Back to Sources
            </SourcesButton>
            <SourceContent data-testid="source-content">
              <SourceItem data-testid="source-item">
                <SourceTextContent data-testid="source-text-content">
                  <SourceText data-testid="source-text">{message.sources[selectedSource].page_content}</SourceText>
                  {message.sources[selectedSource].metadata?.url && (
                    <SourceMetadata data-testid="source-metadata">{message.sources[selectedSource].metadata.url}</SourceMetadata>
                  )}
                </SourceTextContent>
              </SourceItem>
            </SourceContent>
          </>
        ) : (
          <>
            <SourcesButton onClick={() => setShowSources(!showSources)}>
              Sources
            </SourcesButton>
            <SourceCardsContainer data-testid="source-cards-container">
              {message.sources.map((source, index) => (
                <SourcePreviewCard key={index} onClick={() => setSelectedSource(index)} data-testid="source-preview-card">
                  <SourcePreviewItem data-testid="source-preview-item">
                    <SourceIconContainer data-testid="source-icon-container">
                      <SourceIcon />
                    </SourceIconContainer>
                    <PreviewText data-testid="preview-text">
                      {source.page_content}
                    </PreviewText>
                  </SourcePreviewItem>
                </SourcePreviewCard>
              ))}
            </SourceCardsContainer>
          </>
        )}
      </SourcesSection>
    );
  };

  if (isUser) {
    return (
      <MessageContainer isUser={true} data-testid="user-message-container">
        <UserMessageContent data-testid="user-message-content">
          {message.content}
        </UserMessageContent>
      </MessageContainer>
    );
  }

  if (message.isThinking) {
    return (
      <MessageContainer isUser={false} data-testid="bot-message-container">
        <ModelInfo data-testid="model-info">
          <ModelIcon data-testid="model-icon" />
          <ModelName data-testid="model-name">{message.model || 'Databricks LLM'}</ModelName>
        </ModelInfo>
        <BotMessageContent>
          <ThinkingIndicator>
            <Spinner />
            Thinking...
          </ThinkingIndicator>
        </BotMessageContent>
      </MessageContainer>
    );
  }
  
  return (
    <MessageContainer isUser={false} data-testid="bot-message-container">
      <ModelInfo data-testid="model-info">
        <ModelIcon data-testid="model-icon" />
        <ModelName data-testid="model-name">
          {message.model || 'Databricks LLM'}
        </ModelName>
        
      </ModelInfo>
      
      <BotMessageContent data-testid="bot-message-content">
        <ReactMarkdown>{message.content}</ReactMarkdown>
        {message.metrics && (
          <ModelMetrics>
            {message.metrics.timeToFirstToken && `${message.metrics.timeToFirstToken.toFixed(2)}s to first token + `}
            {message.metrics.totalTime && `${message.metrics.totalTime.toFixed(2)}s`}
          </ModelMetrics>
        )}
        {renderSources()}
        <MessageFooter>
          <MessageActions data-testid="message-actions">
            <CopyButton 
              onClick={handleCopy} 
              title="Copy" 
              copied={copied}
              data-testid={`copy-button-${message.message_id}`}
            >
              <CheckIconWrapper $copied={copied}>
                <FontAwesomeIcon icon={faCheck} />
              </CheckIconWrapper>
            </CopyButton>
            <RefreshButton 
              onClick={handleRegenerate} 
              title="Regenerate" 
              data-testid={`refresh-button-${message.message_id}`}
            />
            <ThumbsUpButton 
              onClick={handleThumbsUp} 
              title="Thumbs Up" 
              active={currentRating === 'up'}
              data-testid={`thumbs-up-button-${message.message_id}`}
            />
            <ThumbsDownButton 
              onClick={handleThumbsDown} 
              title="Thumbs Down" 
              active={currentRating === 'down'}
              data-testid={`thumbs-down-button-${message.message_id}`}
            />
          </MessageActions>
        </MessageFooter>
      </BotMessageContent>
    </MessageContainer>
  );
};

export default ChatMessage; 