import { FC } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { Title } from 'react-admin';

export const Dashboard: FC = () => (
  <Card>
    <Title title="Dashboard" />
    <CardContent>
      <Typography variant="h4">Welcome to Admin Panel Dashboard</Typography>
    </CardContent>
    <CardContent>
      <Typography variant="body1">today is {new Date().toLocaleDateString()}</Typography>
    </CardContent>
  </Card>
);
