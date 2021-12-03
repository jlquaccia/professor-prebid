import React, { useEffect } from 'react';
import { IPrebidDetails } from '../../../../inject/scripts/prebid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ITcfDetails } from '../../../../inject/scripts/tcf';
import { TCString } from '@iabtcf/core';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import logger from '../../../../logger';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BusinessIcon from '@mui/icons-material/Business';
import { styled } from '@mui/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import ReactJson from 'react-json-view';
import Grid from '@mui/material/Grid';
import { tileHeight } from './ConfigComponent';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
}));

const TcfComponent = ({ tcf, tcfKey }: any): JSX.Element => {
  const [decodedTcfString, setDecodedTcfString] = React.useState({});
  useEffect(() => {
    const string = tcf[tcfKey]?.consentData || '';
    let decodedTcfString = {};
    try {
      decodedTcfString = TCString.decode(string, null);
    } catch (e) {}
    setDecodedTcfString(decodedTcfString);
  }, []);
  logger.log(`[PopUp][PriceGranularityComponent]: render `, tcf, tcfKey);
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        <strong>Version:</strong> {tcfKey}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <strong>CMP Loaded: </strong> <Checkbox checked={tcf[tcfKey]?.cmpLoaded || false}></Checkbox>
      </Typography>
      <Box sx={{ paddingBottom: 1 }}>
        <TextField
          label="Consent Data:"
          multiline
          variant="outlined"
          value={tcf[tcfKey]?.consentData ? tcf[tcfKey].consentData : 'no consent string found'}
          sx={{ width: 1 }}
        />
      </Box>
      <ReactJson
        src={decodedTcfString}
        name={false}
        collapsed={false}
        enableClipboard={false}
        displayObjectSize={false}
        displayDataTypes={false}
        sortKeys={false}
        quotesOnKeys={false}
        indentWidth={2}
        collapseStringsAfterLength={100}
        style={{ fontSize: '12px', fontFamily: 'roboto', padding: '5px' }}
      />
    </Box>
  );
};

const PrivacyComponent = ({ prebid, tcf }: IPrivacyComponentProps): JSX.Element => {
  const [expanded, setExpanded] = React.useState(false);
  const [maxWidth, setMaxWidth] = React.useState<4 | 12>(4);

  const handleExpandClick = () => {
    setExpanded(!expanded);
    setMaxWidth(expanded ? 4 : 12);
  };
  logger.log(`[PopUp][PriceGranularityComponent]: render `, tcf);
  return (
    <Grid item xs={maxWidth}>
      <Card sx={{ width: 1, minHeight: tileHeight, border: '1px solid #0e86d4' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: '#0e86d4' }} aria-label="recipe">
              <BusinessIcon />
            </Avatar>
          }
          title="Consent Management"
          subheader={''}
          action={
            <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
              <ExpandMoreIcon />
            </ExpandMore>
          }
        />

        <CardContent>
          <Typography variant="body2" color="text.secondary">
            <strong>Allow Auction Without Consent: </strong>
            {JSON.stringify(prebid.config.consentManagement?.allowAuctionWithoutConsent)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>CMP api:</strong>
            {prebid.config.consentManagement.cmpApi ? prebid.config.consentManagement?.cmpApi : prebid.config.consentManagement.gdpr?.cmpApi}
          </Typography>
        </CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              <strong>Default GDPR Scope:</strong>
              {JSON.stringify(
                prebid.config.consentManagement.defaultGdprScope
                  ? prebid.config.consentManagement.defaultGdprScope
                  : prebid.config.consentManagement.gdpr?.defaultGdprScope
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Timeout:</strong>
              {prebid.config.consentManagement.timeout ? prebid.config.consentManagement.timeout : prebid.config.consentManagement.gdpr?.timeout}
            </Typography>
            {Object.keys(tcf).map((key, index) => (
              <TcfComponent key={index} tcf={tcf} tcfKey={key} />
            ))}
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
};

interface IPrivacyComponentProps {
  prebid: IPrebidDetails;
  tcf: ITcfDetails;
}

export default PrivacyComponent;
