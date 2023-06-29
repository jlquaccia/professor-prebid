import React, { createContext, useEffect, useState, useCallback } from 'react';
import { ITabInfo, ITabInfos, InitReqChainData } from '../../Background/background';
import { getTabId, sendChromeTabsMessage } from '../../Shared/utils';
import { DOWNLOAD_FAILED } from '../constants';

const InspectedPageContext = createContext<ITabInfo | undefined>(undefined);

interface ChromeStorageProviderProps {
  children: React.ReactNode;
}

export const InspectedPageContextProvider = ({ children }: ChromeStorageProviderProps) => {
  const [pageContext, setPageContext] = useState<ITabInfo>({});
  const [downloading, setDownloading] = useState<'true' | 'false' | 'error'>('false');
  const [syncInfo, setSyncInfo] = useState<string>('');
  const [initReqChainData, setInitReqChainData] = useState<InitReqChainData>({});

  const fetchEvents = useCallback(async (tabInfos: ITabInfos) => {
    const tabId = await getTabId();
    const prebids = tabInfos[tabId]?.prebids;
    if (prebids) {
      for (const [namespace, prebid] of Object.entries(prebids)) {
        setSyncInfo(`try to download Events from ${prebid.eventsUrl}`);
        try {
          setDownloading('true');

          setSyncInfo(`${namespace}: downloading ${prebid.eventsUrl}`);
          const response = await fetch(prebid.eventsUrl);

          setSyncInfo(`${namespace}: get JSON from response stream`);
          prebid.events = await response.json();

          setDownloading('false');
          setSyncInfo(null);
        } catch (error) {
          sendChromeTabsMessage(DOWNLOAD_FAILED, { eventsUrl: prebid.eventsUrl });
          setSyncInfo(`${namespace}: error during download of ${prebid.eventsUrl}`);
          setDownloading('error');
        }
      }
    }
    return { ...tabInfos[tabId] };
  }, []);

  useEffect(() => {
    // Read initial value from chrome.storage.local
    chrome.storage.local.get(['tabInfos'], async ({ tabInfos }) => {
      if (!tabInfos) return;
      const tabInfoWithEvents = await fetchEvents(tabInfos);
      setPageContext(tabInfoWithEvents);
    });
  }, [fetchEvents]);

  useEffect(() => {
    // Subscribe to changes in local storage
    const handler = async (changes: any, areaName: 'sync' | 'local' | 'managed') => {
      if (areaName === 'local' && changes.tabInfos && changes) {
        const tabInfoWithEvents = await fetchEvents({ ...changes.tabInfos.newValue });
        setPageContext(tabInfoWithEvents);
      }

      if (areaName === 'local' && changes.initReqChain && changes) {
        setInitReqChainData({ initReqChain: changes.initReqChain.newValue });
      }
    };
    chrome.storage.onChanged.addListener(handler);

    // Unsubscribe when component unmounts
    return () => {
      chrome.storage.onChanged.removeListener(handler);
    };
  }, [fetchEvents]);

  const contextValue: ITabInfo = { ...pageContext, downloading, syncState: syncInfo, initReqChainData };

  return <InspectedPageContext.Provider value={contextValue}>{children}</InspectedPageContext.Provider>;
};

export default InspectedPageContext;
