import React, { useEffect, useState, useContext } from 'react';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { INITIATOR_TOGGLE, INITIATOR_ROOT_URL } from '../../constants';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import JSONViewerComponent from '../JSONViewerComponent';
import AppStateContext from '../../contexts/appStateContext';
import Grid from '@mui/material/Grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import './InitiatorComponent.css';

const gridStyle = {
  p: 0.5,
  '& .MuiGrid-item > .MuiPaper-root': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const InitiatorComponent = (): JSX.Element => {
  const { initReqChain } = useContext(AppStateContext);
  const [initChainFeatureStatus, setInitChainFeatureStatus] = useState<boolean>(null);
  const [rootUrl, setRootUrl] = useState<string>('');

  useEffect(() => {
    chrome.storage.local.get(INITIATOR_TOGGLE, (result) => {
      const value = result ? result[INITIATOR_TOGGLE] : false;
      setInitChainFeatureStatus(value);
    });
  }, [initChainFeatureStatus]);

  useEffect(() => {
    chrome.storage.local.get(INITIATOR_ROOT_URL, (result) => {
      const value = result ? result[INITIATOR_ROOT_URL] : rootUrl;
      setRootUrl(value);
    });
  }, [rootUrl]);

  const handleInitChainFeatureStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInitChainFeatureStatus(event.target.checked);
    const { checked } = event.target;
    chrome.storage.local.set({ [INITIATOR_TOGGLE]: checked }, () => {
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        const tab = tabs[0];
        chrome.tabs.sendMessage(tab.id as number, { type: INITIATOR_TOGGLE, consoleState: checked });
      });
    });
  };

  const handleSettingRootUrl = () => {
    chrome.storage.local.set({ [INITIATOR_ROOT_URL]: rootUrl }, () => {
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        const tab = tabs[0];
        chrome.tabs.sendMessage(tab.id as number, { type: INITIATOR_ROOT_URL, rootUrl });
      });
    });
  };

  const handleChangeOfRootUrlField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRootUrl(e.target.value);
  };

  return (
    <Grid container direction="row" justifyContent="start" spacing={0.25} sx={gridStyle}>
      <Grid item xs={12}>
        <Box sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 1 }} className="box-wrapper">
          <Typography paragraph>
            The Network Inspector tool can be utilized to visualize initiator request chains originating from a specific root URL/resource in order to
            identify whether or not specific privacy related params are being passed along where they should be.
          </Typography>
          <Typography paragraph>
            Under the hood this tool uses the Chrome Devtools Network API which requires that a new instance of the Chrome devtools be opened each
            time a modification is made to this Network Inspector tool (Modifying the root URL, toggling the feature on/off, etc.). For more details
            see the instructions below.
          </Typography>
          <Typography paragraph>
            <b>Instructions on How to Use:</b>
          </Typography>
          <ol>
            <li>
              <Typography>Enable the feature by sliding the toggle below.</Typography>
            </li>
            <li>
              <Typography>Enter a root URL to listen for to generate a request chain from and then click the "Set URL" button.</Typography>
            </li>
            <li>
              <Typography>
                Close Professor Prebid and open a new instance of the developer tools on the current webpage (right-click "Inspect").
              </Typography>
            </li>
            <li className="refresh-icon__list-item">
              <Typography component={'span'} className="initiator__flex-parent">
                Re-open Professor Prebid, navigate back to the Network Inspector tool and click the{' '}
                <RefreshIcon />
                icon (top-right).
              </Typography>
            </li>
            <li>
              <Typography>The "Refresh" button below will be enabled whenever the initiator request chain has been generated or updated.</Typography>
            </li>
          </ol>
          <br />
          <br />
          <div className="initiator-form">
            <FormControl>
              <FormControlLabel
                control={<Switch checked={initChainFeatureStatus || false} onChange={handleInitChainFeatureStatusChange} />}
                label={initChainFeatureStatus ? 'On' : 'Off'}
              />
            </FormControl>
            <TextField
              id="outlined-basic"
              label="Enter Root URL"
              variant="outlined"
              size="small"
              className="child margin-right"
              value={rootUrl}
              onChange={handleChangeOfRootUrlField}
            />
            <Button variant="outlined" className="submit-button margin-right" onClick={handleSettingRootUrl}>
              Set URL
            </Button>
          </div>
          <div className="initiator-output">
            <JSONViewerComponent
              src={initReqChain}
              name={false}
              collapsed={2}
              displayObjectSize={true}
              displayDataTypes={false}
              sortKeys={false}
              quotesOnKeys={false}
              indentWidth={2}
              collapseStringsAfterLength={100}
              style={{ fontSize: '12px', fontFamily: 'roboto', padding: '5px' }}
            />
          </div>
        </Box>
      </Grid>
    </Grid>
  );
};

export interface InitiatorComponentProps {
  initReqChain: {
    [key: string]: any;
  }
}

export default InitiatorComponent;
