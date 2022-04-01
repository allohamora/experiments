import { FC } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { Title, useLocale, useTranslate } from 'react-admin';

export const Dashboard: FC = () => {
  const translate = useTranslate();
  const locale = useLocale();

  return (
    <Card variant="outlined">
      <Title title={translate('dashboard.menuTitle')} />
      <CardContent>
        <Typography variant="h4">{translate('dashboard.title')}</Typography>
      </CardContent>
      <CardContent>
        <Typography variant="body1">
          {translate('dashboard.todayIs')} {new Date().toLocaleDateString(locale)}
        </Typography>
      </CardContent>
    </Card>
  );
};
