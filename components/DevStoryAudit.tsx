import React, { useState, useEffect } from 'react';
import { STORY_CARDS } from '../data/storyCards';
// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { StoryCardDef } from '../types/index';

interface AuditedLink {
  card: StoryCardDef;
  status: 'valid' | 'invalid' | 'cors_error' | 'error';
  errorMessage?: string;
}

interface DevStoryAuditProps {
    onClose: () => void;
}

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

export const DevStoryAudit: React.FC<DevStoryAuditProps> = ({ onClose }) => {
  const [auditedLinks, setAuditedLinks] = useState<AuditedLink[]>([]);
  const [missingLinks, setMissingLinks] = useState<StoryCardDef[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const runAudit = async () => {
    setIsLoading(true);
    setAuditedLinks([]);
    setMissingLinks([]);

    const linksToAudit: StoryCardDef[] = [];
    const missing: StoryCardDef[] = [];

    for (const card of STORY_CARDS) {
      if (card.sourceUrl) {
        linksToAudit.push(card);
      } else {
        missing.push(card);
      }
    }

    setMissingLinks(missing);

    const results = await Promise.all(
      linksToAudit.map(async (card) => {
        try {
          const response = await fetch(card.sourceUrl!, { method: 'GET', mode: 'cors' });
          if (response.ok) {
            return { card, status: 'valid' } as AuditedLink;
          }
          return { card, status: 'invalid', errorMessage: `Status: ${response.status}` } as AuditedLink;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown fetch error';
          const isCorsError = error instanceof TypeError && message.includes('Failed to fetch');

          if (isCorsError) {
            try {
              const proxyUrl = `${CORS_PROXY}${card.sourceUrl!}`;
              const proxyResponse = await fetch(proxyUrl, { method: 'GET', mode: 'cors' });
              if (proxyResponse.ok) {
                return { card, status: 'valid' } as AuditedLink;
              }
              return { card, status: 'invalid', errorMessage: `Status: ${proxyResponse.status} (via proxy)` } as AuditedLink;
            } catch (proxyError) {
              return {
                card,
                status: 'cors_error',
                errorMessage: 'Blocked by CORS (proxy needs activation)',
              } as AuditedLink;
            }
          }
          
          return { card, status: 'error', errorMessage: message } as AuditedLink;
        }
      })
    );

    setAuditedLinks(results);
    setIsLoading(false);
  };

  useEffect(() => {
    runAudit();
  }, []);

  const validLinks = auditedLinks.filter(l => l.status === 'valid');
  const corsLinks = auditedLinks.filter(l => l.status === 'cors_error');
  const errorLinks = auditedLinks.filter(l => l.status === 'invalid' || l.status === 'error');

  const renderLinkList = (links: AuditedLink[], title: string, colorClass: string) => {
    if (links.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className={`text-lg font-bold mb-2 pb-1 border-b ${colorClass} ${colorClass.replace('text-', 'border-')}/30`}>{title} ({links.length})</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          {links.map(({ card, status, errorMessage }) => (
            <li key={card.title}>
              <strong>{card.title}</strong>: <a href={card.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline hover:text-blue-300 break-all">{card.sourceUrl}</a>
              {status !== 'valid' && <span className="text-red-400 ml-2 font-mono text-xs">({errorMessage})</span>}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderMissingList = (cards: StoryCardDef[], title: string) => {
    if (cards.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 pb-1 border-b text-yellow-400 border-yellow-400/30">{title} ({cards.length})</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          {cards.map(card => (
            <li key={card.title}>
              <strong>{card.title}</strong>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col border border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Story Link Audit</h2>
            <button
              onClick={runAudit}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded disabled:opacity-50 disabled:cursor-wait"
            >
              Re-run Audit
            </button>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
              <p className="mt-4">Auditing {STORY_CARDS.filter(c => c.sourceUrl).length} URLs...</p>
            </div>
          ) : (
            <>
              <div className="bg-blue-900/30 border border-blue-700 text-blue-200 text-sm p-4 rounded-lg mb-6">
                <h3 className="font-bold">How Link Auditing Works</h3>
                <p className="mt-1 text-xs leading-relaxed">
                  This tool tries to automatically validate links. Some sites (like BoardGameGeek) block this via a CORS security policy.
                  To work around this, a proxy is used.
                  <br/>
                  <strong>First-time use:</strong> You may need to visit the{' '}
                  <a href={CORS_PROXY} target="_blank" rel="noreferrer" className="text-blue-300 underline font-bold">proxy activation page</a>{' '}
                  and request temporary access. Then, click 'Re-run Audit'.
                </p>
              </div>
              {renderLinkList(corsLinks, "Needs Manual Check (CORS or Proxy Error)", "text-orange-400")}
              {renderLinkList(errorLinks, "Invalid or Unreachable Links", "text-red-400")}
              {renderMissingList(missingLinks, "Stories Missing Links")}
              {renderLinkList(validLinks, "Valid Links", "text-green-400")}
            </>
          )}
        </div>
      </div>
    </div>
  );
};