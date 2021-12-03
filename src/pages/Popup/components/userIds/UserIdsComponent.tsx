import { IPrebidDetails } from '../../../../inject/scripts/prebid';
import React from 'react';
import Box from '@mui/material/Box';
import ReactJson from 'react-json-view';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import logger from '../../../../logger';

const UserIdsComponent = ({ prebid }: IUserIdsComponentProps): JSX.Element => {
  logger.log(`[PopUp][UserIdsComponent]: render `);
  return (
    <Box sx={{ backgroundColor: '#87CEEB', opacity: 0.8, p: '5%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper
        elevation={5}
        sx={{
          margin: '2% 2% 2% 2%',
          borderRadius: 2,
          textAlign: 'center',
          minWidth: '0%',
        }}
      >
        {prebid.eids && prebid.eids[0] && (
          <Typography sx={{ padding: '2%' }}>
            <strong>User IDs</strong>
          </Typography>
        )}
        <TableContainer>
          <Table sx={{ maxWidth: '100%' }}>
              <TableRow>
                <TableCell>Source</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Atype</TableCell>
              </TableRow>
            <TableBody>
              {prebid.eids?.map((eid) =>
                eid.uids.map((uid, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <strong>{eid.source}</strong>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{uid.id}</TableCell>
                    <TableCell>{uid.atype}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        {prebid.config?.userSync?.userIds && prebid.config?.userSync?.userIds[0] && (
          <Typography variant='subtitle1' sx={{ padding: '2%' }}>Config</Typography>
        )}
        <TableContainer>
          <Table>
            <TableBody>
              {prebid.config?.userSync?.userIds?.map((userId, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>Name</TableCell>
                  <TableCell>{userId.name}</TableCell>
                  <TableCell>Storage Type</TableCell>
                  <TableCell>{userId.storage?.type}</TableCell>
                  <TableCell>Storage Expires</TableCell>
                  <TableCell>{userId.storage?.expires}</TableCell>
                  <TableCell>Storage Name</TableCell>
                  <TableCell>{userId.storage?.name}</TableCell>
                  <TableCell>Params</TableCell>
                  <TableCell>
                    <ReactJson
                      src={userId.params}
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

interface IUserIdsComponentProps {
  prebid: IPrebidDetails;
}

export default UserIdsComponent;
